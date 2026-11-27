import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';
import { crearNota } from './helpers';

describe('GET /notes?q= (buscar notas)', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(async () => {
    app = makeApp(':memory:');
    await crearNota(app, { title: 'Comprar pan', content: 'Antes de las 20hs' });
    await crearNota(app, { title: 'Dentista', content: 'Comprar hilo dental' });
    await crearNota(app, { title: 'Gimnasio', content: 'Piernas' });
  });

  it('GET /notes?q=pan devuelve solo las notas que coinciden', async () => {
    const res = await request(app).get('/notes').query({ q: 'pan' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Comprar pan');
  });

  it('GET /notes sin q sigue devolviendo todas', async () => {
    const res = await request(app).get('/notes');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });
});