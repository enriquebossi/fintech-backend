// This is a server-side script using Node.js and Express.
// It creates an API endpoint that your React app will call.

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// --- CONFIGURATION ---
// These must be set as environment variables on your deployment platform
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- INITIALIZATION CHECK ---
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: Missing one or more environment variables (SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY).");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// --- API ENDPOINT ---
app.post('/api/query-supabase', async (req, res) => {
    console.log("Received a request to /api/query-supabase");
    const { prompt, tableName } = req.body;

    if (!prompt) {
        console.log("Request failed: Prompt is missing.");
        return res.status(400).json({ error: "Prompt is required." });
    }
    if (!tableName || !['transactions', 'demo_transactions'].includes(tableName)) {
        console.log(`Request failed: Invalid table name "${tableName}".`);
        return res.status(400).json({ error: "Invalid table name specified." });
    }
    console.log(`Processing prompt for table: "${tableName}"`);

    try {
        // Step 1: Use Gemini to convert the natural language prompt to a SQL query
        console.log("Generating SQL query with Gemini...");
        const schemaPrompt = `
            You are an expert PostgreSQL assistant. Based on the following table schema for a table named "${tableName}", convert the user's request into a valid SQL query.
            The table schema has the following columns with their types: "EntryID" (text), "SubmissionTimestamp" (timestamp), "SubmitterEmail" (text), "SubmitterHandle" (text), "EntryTimestamp" (date), "TransactionArchetype" (text), "TransactionType" (text), "Direction" (text, can be 'IN', 'OUT', 'TAKEN', 'GRANTED'), "Currency" (text, e.g., 'USD', 'GTQ'), "Value" (numeric), "Counterparty" (text), "Purpose" (text), "Method/Account" (text), "DueDate" (date), "LunarCycle" (text), "HumanNotes" (text), "AIPromptContext" (text).
            Only return the SQL query and nothing else. Do not wrap it in markdown or any other characters.
            
            User's request: "${prompt}"
        `;
        
        const result = await model.generateContent(schemaPrompt);
        const sqlQuery = result.response.text().trim().replace(/;/g, ''); // Remove trailing semicolons
        console.log("Generated SQL:", sqlQuery);

        // Step 2: Execute the generated SQL query against the Supabase database
        console.log("Executing SQL query against Supabase...");
        // We call the custom RPC function we created in Supabase
        const { data, error } = await supabase.rpc('execute_sql', { sql_query: sqlQuery });

        if (error) {
            console.error('Supabase RPC error:', error.message);
            // This error often means the SQL was invalid or the 'execute_sql' function doesn't exist.
            return res.status(500).json({ error: `Database query failed. Please check your Supabase 'execute_sql' function exists and the query is valid. Details: ${error.message}` });
        }

        // Step 3: Return the generated SQL and the data to the frontend
        console.log("Successfully retrieved data. Sending response to client.");
        res.status(200).json({
            sql: sqlQuery,
            result: data
        });

    } catch (error) {
        console.error('Full server error:', error);
        res.status(500).json({ error: 'An internal server error occurred processing your request.' });
    }
});

// Start the server for local testing (optional)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // For serverless deployment on Vercel
