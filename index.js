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
const ETH_PROVIDER_URL = process.env.ETH_PROVIDER_URL;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const CREDIT_TOKEN_ADDRESS = process.env.CREDIT_TOKEN_ADDRESS;
const CHECKPOINT_NFT_ADDRESS = process.env.CHECKPOINT_NFT_ADDRESS;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: Missing environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

let creditToken;
let checkpointNFT;
if (ETH_PROVIDER_URL && WALLET_PRIVATE_KEY && CREDIT_TOKEN_ADDRESS && CHECKPOINT_NFT_ADDRESS) {
    const provider = new ethers.JsonRpcProvider(ETH_PROVIDER_URL);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const creditAbi = require('./contracts/artifacts/contracts/CreditToken.sol/CreditToken.json').abi;
    const nftAbi = require('./contracts/artifacts/contracts/CheckpointNFT.sol/CheckpointNFT.json').abi;
    creditToken = new ethers.Contract(CREDIT_TOKEN_ADDRESS, creditAbi, wallet);
    checkpointNFT = new ethers.Contract(CHECKPOINT_NFT_ADDRESS, nftAbi, wallet);
} else {
    console.warn('Token contracts not configured. Minting endpoints disabled.');
}

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

// helper to fetch oracle price (BTC/USD for demo)
async function getOraclePrice() {
    try {
        const resp = await fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json');
        const data = await resp.json();
        return parseFloat(data.bpi.USD.rate.replace(',', ''));
    } catch (err) {
        console.error('Oracle fetch failed:', err);
        return null;
    }
}

app.get('/api/oracle-price', async (req, res) => {
    const price = await getOraclePrice();
    if (!price) return res.status(500).json({ error: 'oracle unavailable' });
    res.json({ price });
});

app.post('/api/start-cycle', async (req, res) => {
    const start = new Date();
    const end = new Date(start.getTime() + 28 * 24 * 60 * 60 * 1000);
    const price = await getOraclePrice();
    const { data, error } = await supabase
        .from('cycles')
        .insert({ start_date: start.toISOString(), end_date: end.toISOString(), cycle_status: 'active', oracle_price: price })
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/mint-credit', async (req, res) => {
    if (!creditToken) return res.status(500).json({ error: 'contract not configured' });
    const { to, amount } = req.body;
    try {
        const tx = await creditToken.mint(to, amount);
        await tx.wait();
        res.json({ hash: tx.hash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/mint-nft', async (req, res) => {
    if (!checkpointNFT) return res.status(500).json({ error: 'contract not configured' });
    const { to, cycleId, status } = req.body;
    try {
        const tx = await checkpointNFT.mint(to, cycleId, status);
        const receipt = await tx.wait();
        const tokenId = receipt.events.find(e => e.event === 'Transfer').args.tokenId.toString();
        await supabase.from('cycles').update({ checkpoint_nft_id: tokenId }).eq('id', cycleId);
        res.json({ tokenId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/cycle/:id', async (req, res) => {
    const { data, error } = await supabase.from('cycles').select('*').eq('id', req.params.id).single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
