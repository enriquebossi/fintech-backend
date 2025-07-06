export default async function sendSlackMessage(text) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  const channel = process.env.SLACK_CHANNEL || '#cosmic-nexus-it';

  if (!webhook) return;

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel, text })
  });
}
