const test = require('node:test');
const assert = require('node:assert');
const { once } = require('node:events');
const app = require('../index.js');
const { clearTransactions } = require('../data/transactions.js');

let server;

test.beforeEach(async () => {
  clearTransactions();
  server = app.listen(0);
  await once(server, 'listening');
});

test.afterEach(async () => {
  server.close();
  await once(server, 'close');
});

test('analytics aggregates totals', async () => {
  const port = server.address().port;
  const base = `http://localhost:${port}`;
  const headers = { 'Content-Type': 'application/json' };

  await fetch(`${base}/api/transactions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ Currency: 'USD', Value: 100 })
  });
  await fetch(`${base}/api/transactions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ Currency: 'USD', Value: 50 })
  });
  await fetch(`${base}/api/transactions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ Currency: 'EUR', Value: 70 })
  });

  const res = await fetch(`${base}/api/transaction-analytics`);
  const data = await res.json();

  assert.strictEqual(data.count, 3);
  assert.strictEqual(data.totals.USD, 150);
  assert.strictEqual(data.totals.EUR, 70);
});
