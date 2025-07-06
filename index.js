// File: index.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
app.use(express.json());
app.use(cors());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: Missing environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const TRACKER_FILE = 'project-tracker.json';

async function updateProjectTracker() {
    try {
        const { data, error } = await supabase
            .from('cosmic_nexus')
            .select('*');
        if (error) {
            console.error('Supabase fetch error:', error.message);
            return;
        }
        await fs.writeFile(TRACKER_FILE, JSON.stringify(data, null, 2));
        console.log('Project tracker updated');
    } catch (err) {
        console.error('Update tracker error:', err);
    }
}

// initial update and periodic refresh every hour
updateProjectTracker();
setInterval(updateProjectTracker, 1000 * 60 * 60);

app.get('/api/project-tracker', async (req, res) => {
    try {
        const data = await fs.readFile(TRACKER_FILE, 'utf8');
        return res.status(200).json(JSON.parse(data));
    } catch (err) {
        console.error('Read tracker error:', err);
        return res.status(500).json({ error: 'Unable to load tracker data' });
    }
});

app.post('/api/query-supabase', async (req, res) => {
    const { prompt, tableName } = req.body;
    if (!prompt || !tableName) {
        return res.status(400).json({ error: "Prompt and tableName are required." });
    }

    try {
        const schemaPrompt = `Based on the table schema for "${tableName}" (columns: "EntryID", "SubmissionTimestamp", "SubmitterEmail", "SubmitterHandle", "EntryTimestamp", "TransactionArchetype", "TransactionType", "Direction", "Currency", "Value", "Counterparty", "Purpose", "Method/Account", "DueDate", "LunarCycle"), convert the user's request into a valid PostgreSQL query. Only return the SQL query. User's request: "${prompt}"`;
        
        const result = await model.generateContent(schemaPrompt);
        const sqlQuery = result.response.text().trim().replace(/;/g, '');

        const { data, error } = await supabase.rpc('execute_sql', { sql_query: sqlQuery });

        if (error) {
            console.error('Supabase Error:', error.message);
            return res.status(500).json({ error: `Database Error: ${error.message}` });
        }
        
        res.status(200).json({ sql: sqlQuery, result: data });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
