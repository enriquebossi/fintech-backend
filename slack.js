export async function sendSlackMessage(webhookUrl, text, channel = process.env.SLACK_CHANNEL || '#cosmic-nexus-it') {
  if (!webhookUrl) return;
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel, text })
  });
}
