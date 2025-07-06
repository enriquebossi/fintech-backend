const request = require('supertest');
const app = require('../index');

jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      from: () => ({
        insert: () => ({ select: () => ({ single: () => ({ data: { id: 1, cycle_status: 'active' }, error: null }) }) }),
        update: () => ({ eq: () => ({}) }),
        select: () => ({ eq: () => ({ single: () => ({ data: {}, error: null }) }) })
      })
    })
  };
});

describe('API routes', () => {
  it('starts a cycle', async () => {
    const res = await request(app).post('/api/start-cycle');
    expect(res.statusCode).toBe(200);
    expect(res.body.cycle_status).toBe('active');
  });
});
