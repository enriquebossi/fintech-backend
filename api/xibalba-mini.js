import { put, list, get } from '@vercel/blob';

// Endpoint: guarda/recupera mensajes JSON
export default async function handler(req, res) {
  const bucket = 'xibalba-mini';
  
  if (req.method === 'POST') {
    const { id, date, from, subject, content } = req.body;
    const data = { id, date, from, subject, content };
    await put(`${bucket}/${id}.json`, JSON.stringify(data));
    return res.status(201).json({ status: 'saved' });
  }

  if (req.method === 'GET') {
    const blobs = await list({ prefix: `${bucket}/` });
    const messages = await Promise.all(blobs.blobs.map(b => get(b.url).then(r => r.json())));
    return res.status(200).json(messages);
  }

  res.status(405).end();
}
