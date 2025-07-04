// File: index.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const { addTransaction, getTransactions } = require('./data/transactions');

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

// Store a transaction in memory
app.post('/api/transactions', (req, res) => {
    const txn = req.body;
    if (!txn || typeof txn.Value !== 'number' || !txn.Currency) {
        return res.status(400).json({ error: 'Invalid transaction data.' });
    }
    addTransaction(txn);
    res.status(201).json({ status: 'saved' });
});

// Return aggregated analytics of transactions
app.get('/api/transaction-analytics', (req, res) => {
    const totals = {};
    const txns = getTransactions();
    for (const t of txns) {
        if (typeof t.Value !== 'number' || !t.Currency) continue;
        totals[t.Currency] = (totals[t.Currency] || 0) + t.Value;
    }
    res.json({ count: txns.length, totals });
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
