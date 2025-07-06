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
const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: Missing environment variables.");
}
if (!BLOCKCHAIN_RPC_URL || !PRIVATE_KEY || !NFT_CONTRACT_ADDRESS) {
    console.warn("Blockchain environment variables are not fully configured. NFT issuance will be disabled.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

let nftContract = null;
try {
    if (BLOCKCHAIN_RPC_URL && PRIVATE_KEY && NFT_CONTRACT_ADDRESS) {
        const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const abi = [
            "function mint(address to, string tokenURI) public returns (uint256)"
        ];
        nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, wallet);
    }
} catch (err) {
    console.error('Failed to initialize blockchain provider:', err);
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

app.post('/api/issue-nft', async (req, res) => {
    const { memberId, lunarCycle, tokenURI } = req.body;
    if (!memberId || !lunarCycle) {
        return res.status(400).json({ error: 'memberId and lunarCycle are required' });
    }
    try {
        const cycleStart = new Date();
        const cycleEnd = new Date(cycleStart.getTime() + 28 * 24 * 60 * 60 * 1000);

        const { data: cycle, error: cycleError } = await supabase
            .from('membership_cycles')
            .insert({
                member_id: memberId,
                cycle_start: cycleStart.toISOString().split('T')[0],
                cycle_end: cycleEnd.toISOString().split('T')[0],
                lunar_cycle: lunarCycle
            })
            .select()
            .single();

        if (cycleError) {
            console.error('Supabase Cycle Error:', cycleError.message);
            return res.status(500).json({ error: cycleError.message });
        }

        let txHash = null;
        let tokenId = null;
        if (nftContract && tokenURI) {
            const tx = await nftContract.mint(memberId, tokenURI);
            const receipt = await tx.wait();
            txHash = receipt.hash;
            tokenId = receipt.logs?.[0]?.topics?.[3] || null;
        }

        const { error: nftError } = await supabase.from('membership_nfts').insert({
            member_id: memberId,
            cycle_id: cycle.id,
            token_uri: tokenURI,
            token_id: tokenId ? tokenId.toString() : null,
            tx_hash: txHash
        });

        if (nftError) {
            console.error('Supabase NFT Error:', nftError.message);
            return res.status(500).json({ error: nftError.message });
        }

        res.status(201).json({ cycle, txHash, tokenId });
    } catch (err) {
        console.error('Issue NFT Error:', err);
        res.status(500).json({ error: 'Failed to issue NFT' });
    }
});

app.post('/api/subscription', async (req, res) => {
    const { memberId, status } = req.body;
    if (!memberId || !status) {
        return res.status(400).json({ error: 'memberId and status are required' });
    }
    try {
        const { error } = await supabase
            .from('members')
            .update({ status })
            .eq('id', memberId);

        if (error) {
            console.error('Supabase Update Error:', error.message);
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ status: 'updated' });
    } catch (err) {
        console.error('Subscription Update Error:', err);
        res.status(500).json({ error: 'Failed to update subscription' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
