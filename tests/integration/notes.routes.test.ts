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

describe('PATCH /notes/:id (Ejercicio 4)', () => {
    let app: ReturnType<typeof makeApp>;

    beforeEach(() => {
        app = makeApp(':memory:');
    });

    it('200 y modifica solo los campos enviados', async () => {
        const created = await request(app)
            .post('/notes')
            .send({ title: 'Comprar pan', content: 'Antes de las 20hs' });

        const res = await request(app)
            .patch(`/notes/${created.body.id}`)
            .send({ content: 'Antes de las 21hs' });

        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Comprar pan');
        expect(res.body.content).toBe('Antes de las 21hs');
    });

    it('404 si la nota no existe', async () => {
        const res = await request(app).patch('/notes/999').send({ title: 'X' });

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'NotFound' });
    });

    it('400 si el body es inválido (title vacío)', async () => {
        const created = await request(app).post('/notes').send({ title: 'A', content: 'B' });

        const res = await request(app).patch(`/notes/${created.body.id}`).send({ title: '' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('ValidationError');
    });
});

describe('DELETE /notes/:id (Ejercicio 5)', () => {
    let app: ReturnType<typeof makeApp>;

    beforeEach(() => {
        app = makeApp(':memory:');
    });

    it('204 al eliminar y la nota deja de existir (GET → 404)', async () => {
        const created = await request(app).post('/notes').send({ title: 'A', content: 'B' });

        const res = await request(app).delete(`/notes/${created.body.id}`);
        const after = await request(app).get(`/notes/${created.body.id}`);

        expect(res.status).toBe(204);
        expect(after.status).toBe(404);
    });

    it('404 si la nota no existe', async () => {
        const res = await request(app).delete('/notes/999');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'NotFound' });
    });
});