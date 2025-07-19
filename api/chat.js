import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSISTANT_ID = process.env.ASSISTANT_ID;  // e.g. asst_xxx
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;

export default async function handler(req, res) {
  try {
    // Cosmo Triage chat API
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { role, message } = req.body;

    // 1.1 Create thread
    const thread = await openai.beta.threads.create({
      messages: [{ role, content: message }]
    });

    // 1.2 Run assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });

    // 1.3 Poll for completion
    let runStatus = run;
    while (['queued', 'in_progress'].includes(runStatus.status)) {
      await new Promise(r => setTimeout(r, 1500));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, runStatus.id);
    }

    // 1.4 Retrieve assistant response
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
