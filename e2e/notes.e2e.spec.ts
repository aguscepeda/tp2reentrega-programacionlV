import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

test.beforeEach(async ({ baseURL }) => {
    await resetAndSeed(baseURL!);
});

test('happy path: crear, listar, leer, modificar y eliminar una nota', async ({ request }) => {
    const initial = await request.get('/notes');
    expect(initial.status()).toBe(200);
    expect(await initial.json()).toHaveLength(2);

    const created = await request.post('/notes', {
        data: { title: 'Estudiar testing', content: 'Repasar TDD' }
    });
    expect(created.status()).toBe(201);
    const note = await created.json();
    expect(note).toMatchObject({ title: 'Estudiar testing', content: 'Repasar TDD', pinned: false });

    const listed = await (await request.get('/notes')).json();
    expect(listed).toHaveLength(3);
    expect(listed.map((n: { id: number }) => n.id)).toContain(note.id);

    const fetched = await request.get(`/notes/${note.id}`);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toEqual(note);

    const patched = await request.patch(`/notes/${note.id}`, {
        data: { content: 'Repasar TDD y Playwright' }
    });
    expect(patched.status()).toBe(200);
    const patchedBody = await patched.json();
    expect(patchedBody.title).toBe('Estudiar testing');
    expect(patchedBody.content).toBe('Repasar TDD y Playwright');

    const removed = await request.delete(`/notes/${note.id}`);
    expect(removed.status()).toBe(204);
    const gone = await request.get(`/notes/${note.id}`);
    expect(gone.status()).toBe(404);
});

test('caso de error: id inexistente → 404 y body inválido → 400', async ({ request }) => {
    const missing = await request.get('/notes/999999');
    expect(missing.status()).toBe(404);
    expect(await missing.json()).toEqual({ error: 'NotFound' });

    const invalid = await request.post('/notes', { data: { title: '', content: 'sin título' } });
    expect(invalid.status()).toBe(400);
    expect((await invalid.json()).error).toBe('ValidationError');

    const listed = await (await request.get('/notes')).json();
    expect(listed).toHaveLength(2);
});