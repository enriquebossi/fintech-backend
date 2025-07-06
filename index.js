// File: index.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ethers } = require('ethers');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: Missing environment variables.");
}

let nftContract;
if (RPC_URL && PRIVATE_KEY && NFT_CONTRACT_ADDRESS) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const abi = [
        'function mint(address to, uint256 tokenId) public returns (uint256)'
    ];
    nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, wallet);
}

function currentLunarCycle(date = new Date()) {
    const epoch = new Date('2024-01-01T00:00:00Z');
    const diffDays = Math.floor((date - epoch) / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 28) + 1;
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

app.post('/api/membership/start', async (req, res) => {
    const { email, handle } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'email is required' });
    }
    const cycle = currentLunarCycle();
    const { data, error } = await supabase
        .from('memberships')
        .insert({ email, handle, start_date: new Date().toISOString(), lunar_cycle: cycle, active: true })
        .select()
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
});

app.get('/api/membership/:email', async (req, res) => {
    const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('email', req.params.email)
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
});

app.post('/api/nft/issue', async (req, res) => {
    const { memberId, address } = req.body;
    if (!memberId || !address) {
        return res.status(400).json({ error: 'memberId and address are required' });
    }
    const tokenId = Date.now();
    try {
        let txHash = null;
        if (nftContract) {
            const tx = await nftContract.mint(address, tokenId);
            await tx.wait();
            txHash = tx.hash;
        }
        await supabase.from('nft_issuances').insert({ member_id: memberId, token_id: tokenId, tx_hash: txHash });
        // log transaction with lunar cycle
        await supabase.from('transactions').insert({
            EntryTimestamp: new Date().toISOString(),
            TransactionArchetype: 'NFT',
            TransactionType: 'ISSUE',
            Direction: 'OUT',
            Currency: 'NFT',
            Value: 1,
            Counterparty: address,
            Purpose: 'SnowGlaz Membership NFT',
            'Method/Account': 'Blockchain',
            LunarCycle: currentLunarCycle()
        });
        res.status(201).json({ tokenId, txHash });
    } catch (err) {
        console.error('NFT mint error:', err);
        res.status(500).json({ error: 'NFT issuance failed' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
