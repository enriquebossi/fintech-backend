// File: index.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ethers } = require('ethers');
const cors = require('cors');
const creditAbi = require('./artifacts/contracts/CreditToken.sol/CreditToken.json').abi;
const nftAbi = require('./artifacts/contracts/DynamicMetadataNFT.sol/DynamicMetadataNFT.json').abi;

const app = express();
app.use(express.json());
app.use(cors());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !GEMINI_API_KEY || !PRIVATE_KEY) {
    console.error("CRITICAL ERROR: Missing environment variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const credit = new ethers.Contract(process.env.CREDIT_TOKEN_ADDRESS || ethers.ZeroAddress, creditAbi, signer);
const nft = new ethers.Contract(process.env.NFT_ADDRESS || ethers.ZeroAddress, nftAbi, signer);

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

app.post('/api/mint-credit', async (req, res) => {
    const { address, amount } = req.body;
    if (!address || !amount) {
        return res.status(400).json({ error: 'address and amount are required' });
    }
    try {
        const tx = await credit.mint(address, amount);
        await tx.wait();
        res.status(200).json({ txHash: tx.hash });
    } catch (err) {
        console.error('Mint credit error:', err);
        res.status(500).json({ error: 'mint failed' });
    }
});

app.post('/api/mint-nft', async (req, res) => {
    const { address, uri } = req.body;
    if (!address || !uri) {
        return res.status(400).json({ error: 'address and uri are required' });
    }
    try {
        const tokenId = await nft.mintWithURI.staticCall(address, uri);
        const tx = await nft.mintWithURI(address, uri);
        await tx.wait();
        res.status(200).json({ tokenId: tokenId.toString(), txHash: tx.hash });
    } catch (err) {
        console.error('Mint nft error:', err);
        res.status(500).json({ error: 'mint failed' });
    }
});

app.post('/api/cycle/start', async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });
    const { data, error } = await supabase.from('cycles').insert({
        user_id,
        cycle_status: 'started',
        start_date: new Date().toISOString()
    }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
});

app.post('/api/cycle/checkpoint', async (req, res) => {
    const { cycle_id, address, uri } = req.body;
    if (!cycle_id || !address || !uri) return res.status(400).json({ error: 'cycle_id, address and uri required' });
    try {
        const tokenId = await nft.mintWithURI.staticCall(address, uri);
        const tx = await nft.mintWithURI(address, uri);
        await tx.wait();
        const { error } = await supabase.from('cycles').update({
            cycle_status: 'checkpoint',
            checkpoint_nft_id: tokenId.toString()
        }).eq('id', cycle_id);
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ tokenId: tokenId.toString(), txHash: tx.hash });
    } catch (err) {
        console.error('Checkpoint error:', err);
        res.status(500).json({ error: 'checkpoint failed' });
    }
});

app.post('/api/cycle/end', async (req, res) => {
    const { cycle_id } = req.body;
    if (!cycle_id) return res.status(400).json({ error: 'cycle_id required' });
    const { error } = await supabase.from('cycles').update({ cycle_status: 'ended' }).eq('id', cycle_id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ status: 'ended' });
});

app.get('/api/oracle/:symbol', async (req, res) => {
    const { data, error } = await supabase.from('oracle_prices').select('*').eq('symbol', req.params.symbol).single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = { app, supabase, credit, nft };
