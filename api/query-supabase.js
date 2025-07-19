import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { prompt, tableName } = req.body;
  if (!prompt || !tableName) {
    return res.status(400).json({ error: 'Prompt and tableName are required.' });
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
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
