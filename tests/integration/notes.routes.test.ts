import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

// Tests de integración de las rutas HTTP (Supertest sobre la app completa,
// con una base SQLite en memoria nueva para cada test).

describe('GET /notes/:id (Ejercicio 3)', () => {
    let app: ReturnType<typeof makeApp>;

    beforeEach(() => {
        app = makeApp(':memory:');
    });

    it('200 y devuelve la nota si existe', async () => {
        const created = await request(app)
            .post('/notes')
            .send({ title: 'Comprar pan', content: 'Antes de las 20hs' });

        const res = await request(app).get(`/notes/${created.body.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(created.body);
    });

    it('404 si la nota no existe', async () => {
        const res = await request(app).get('/notes/999');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'NotFound' });
    });
});