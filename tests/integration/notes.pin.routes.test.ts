import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';
import { crearNota } from './helpers';

describe('POST /notes/:id/pin', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('200 y fija la nota si existe', async () => {
    const created = await crearNota(app, {
      title: 'Comprar pan',
      content: 'Antes de las 20hs',
      pinned: false
    });

    const res = await request(app).post(`/notes/${created.id}/pin`);

    expect(res.status).toBe(200);
    expect(res.body.pinned).toBe(true);
  });

  it('404 si la nota no existe', async () => {
    const res = await request(app).post('/notes/999/pin');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'NotFound' });
  });
});