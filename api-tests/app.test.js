process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_ANON_KEY = 'anon';
process.env.GEMINI_API_KEY = 'key';
const request = require('supertest');
const { app, supabase, credit, nft } = require('../index');

describe('API routes', () => {
  beforeAll(() => {
    jest.spyOn(credit, 'mint').mockImplementation(() => Promise.resolve({ wait: () => Promise.resolve(), hash: '0x123' }));
    nft.mintWithURI.staticCall = jest.fn().mockResolvedValue(1);
    jest.spyOn(nft, 'mintWithURI').mockImplementation(() => Promise.resolve({ wait: () => Promise.resolve(), hash: '0xabc' }));
    jest.spyOn(supabase, 'from').mockImplementation(() => ({
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 1 }, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { price: 1 }, error: null }) }) })
    }));
  });

  afterAll(() => jest.restoreAllMocks());

  test('mint credit', async () => {
    const res = await request(app).post('/api/mint-credit').send({ address: '0x1', amount: 100 });
    expect(res.statusCode).toBe(200);
    expect(res.body.txHash).toBe('0x123');
  });

  test('start cycle', async () => {
    const res = await request(app).post('/api/cycle/start').send({ user_id: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
  });
});
