import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('GET /notes/stats', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('200 y devuelve { total: 0, pinned: 0 } cuando no hay notas', async () => {
    const res = await request(app).get('/notes/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 0, pinned: 0 });
  });

  it('200 y devuelve los conteos de total y fijadas', async () => {
    await request(app).post('/notes').send({ title: 'Nota 1', content: 'A', pinned: true });
    await request(app).post('/notes').send({ title: 'Nota 2', content: 'B', pinned: false });
    await request(app).post('/notes').send({ title: 'Nota 3', content: 'C' });

    const res = await request(app).get('/notes/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ total: 3, pinned: 1 });
  });
});