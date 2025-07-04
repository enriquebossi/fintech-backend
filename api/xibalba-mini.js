import OpenAI from "openai";

// Mini Xibalbá storage endpoint
import { put, list, get } from '@vercel/blob';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSISTANT_ID = process.env.ASSISTANT_ID;  // e.g. asst_xxx
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;

export default async function handler(req, res) {
  try {
    // 1. Handle Mini Xibalbá storage API
    if (req.url.endsWith('/api/xibalba-mini')) {
      const bucket = 'xibalba-mini';
      if (req.method === 'POST') {
        const { id, date, from, subject, content } = req.body;
        const data = { id, date, from, subject, content };
        await put(`${bucket}/${id}.json`, JSON.stringify(data));
        return res.status(201).json({ status: 'saved' });
      }
      if (req.method === 'GET') {
        const blobs = await list({ prefix: `${bucket}/` });
        const messages = await Promise.all(
          blobs.blobs.map(b => get(b.url).then(r => r.json()))
        );
        return res.status(200).json(messages);
      }
      return res.status(405).end();
    }

    // 2. Cosmo Triage chat API
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { role, message } = req.body;

    // 2.1 Create thread
    const thread = await openai.beta.threads.create({
      messages: [{ role, content: message }]
    });

    // 2.2 Run assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });

    // 2.3 Poll for completion
    let runStatus = run;
    while (['queued', 'in_progress'].includes(runStatus.status)) {
      await new Promise(r => setTimeout(r, 1500));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, runStatus.id);
    }

    // 2.4 Retrieve assistant response
    const msgList = await openai.beta.threads.messages.list(thread.id);
    const answer = msgList.data[0].content[0].text.value;

    // 3. Relay to Slack
    if (SLACK_WEBHOOK) {
      await fetch(SLACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: process.env.SLACK_CHANNEL || '#cosmic-nexus-it',
          text: `🤖 Cosmo responde: ${answer}`
        })
      });
    }

    // 4. Return to user
    res.status(200).json({ answer });
  } catch (err) {
    console.error('Cosmo Triage Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
