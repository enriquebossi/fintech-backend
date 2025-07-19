process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_ANON_KEY = 'anon';
process.env.GEMINI_API_KEY = 'key';

jest.mock('../artifacts/contracts/CreditToken.sol/CreditToken.json', () => ({ abi: [] }), { virtual: true });
jest.mock('../artifacts/contracts/DynamicMetadataNFT.sol/DynamicMetadataNFT.json', () => ({ abi: [] }), { virtual: true });

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'SELECT * FROM table' }
      })
    })
  }))
}));

jest.mock('ethers', () => {
  const Contract = jest.fn().mockImplementation(() => ({
    mint: jest.fn().mockResolvedValue({ wait: () => Promise.resolve(), hash: '0x123' }),
    mintWithURI: Object.assign(jest.fn().mockResolvedValue({ wait: () => Promise.resolve(), hash: '0xabc' }), { staticCall: jest.fn().mockResolvedValue(1) })
  }));
  const ethers = {
    JsonRpcProvider: jest.fn(),
    Wallet: class { constructor() {} static createRandom() { return { privateKey: '0x' }; } },
    Contract,
    ZeroAddress: '0x0000000000000000000000000000000000000000'
  };
  return { ethers };
});

const request = require('supertest');
const { app, supabase, credit, nft } = require('../index');

describe('API routes', () => {
  beforeAll(() => {
    jest.spyOn(credit, 'mint').mockImplementation(() => Promise.resolve({ wait: () => Promise.resolve(), hash: '0x123' }));
    jest.spyOn(nft.mintWithURI, 'staticCall').mockResolvedValue(1);
    jest.spyOn(nft, 'mintWithURI').mockImplementation(() => Promise.resolve({ wait: () => Promise.resolve(), hash: '0xabc' }));
    jest.spyOn(supabase, 'from').mockImplementation(() => ({
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 1 }, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { price: 1 }, error: null }) }) })
    }));
    jest.spyOn(supabase, 'rpc').mockImplementation(() => Promise.resolve({ data: [{ some: 'result' }], error: null }));
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

  test('query supabase', async () => {
    const res = await request(app).post('/api/query-supabase').send({ prompt: 'show me table', tableName: 'ledger' });
    expect(res.statusCode).toBe(200);
    expect(res.body.sql).toBe('SELECT * FROM table');
    expect(res.body.result).toEqual([{ some: 'result' }]);
  });

  test('mint nft', async () => {
    const res = await request(app).post('/api/mint-nft').send({ address: '0x1', uri: 'ipfs://hash' });
    expect(res.statusCode).toBe(200);
    expect(res.body.tokenId).toBe('1');
    expect(res.body.txHash).toBe('0xabc');
  });

  test('cycle checkpoint', async () => {
    const res = await request(app).post('/api/cycle/checkpoint').send({ cycle_id: 1, address: '0x1', uri: 'ipfs://hash' });
    expect(res.statusCode).toBe(200);
    expect(res.body.tokenId).toBe('1');
    expect(res.body.txHash).toBe('0xabc');
  });

  test('cycle end', async () => {
    const res = await request(app).post('/api/cycle/end').send({ cycle_id: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ended');
  });

  test('oracle price', async () => {
    const res = await request(app).get('/api/oracle/BTC');
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(1);
  });
});
