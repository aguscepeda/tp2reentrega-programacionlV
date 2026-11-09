import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - updateNote (Ejercicio 4)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('si el patch solo trae title, content no cambia', () => {
        const note = service.createNote({ title: 'Viejo', content: 'Contenido original' });

        const updated = service.updateNote(note.id, { title: 'Nuevo' });

        expect(updated?.title).toBe('Nuevo');
        expect(updated?.content).toBe('Contenido original');
    });

    it('si el patch solo trae content, title no cambia', () => {
        const note = service.createNote({ title: 'Titulo', content: 'Viejo' });

        const updated = service.updateNote(note.id, { content: 'Nuevo' });

        expect(updated?.title).toBe('Titulo');
        expect(updated?.content).toBe('Nuevo');
    });

    it('puede modificar pinned', () => {
        const note = service.createNote({ title: 'A', content: 'B' });

        const updated = service.updateNote(note.id, { pinned: true });

        expect(updated?.pinned).toBe(true);
    });

    it('no cambia id ni createdAt, pero sí actualiza updatedAt', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'));
        const note = service.createNote({ title: 'A', content: 'B' });

        vi.setSystemTime(new Date('2026-01-01T11:00:00.000Z'));
        const updated = service.updateNote(note.id, { title: 'C' });

        expect(updated?.id).toBe(note.id);
        expect(updated?.createdAt).toBe(note.createdAt);
        expect(updated?.updatedAt).toBe('2026-01-01T11:00:00.000Z');
        expect(updated?.updatedAt).not.toBe(note.updatedAt);
    });

    it('el cambio queda persistido (getNote lo refleja)', () => {
        const note = service.createNote({ title: 'A', content: 'B' });

        service.updateNote(note.id, { title: 'Z' });

        expect(service.getNote(note.id)?.title).toBe('Z');
    });

    it('devuelve undefined si el id no existe', () => {
        expect(service.updateNote(999, { title: 'X' })).toBeUndefined();
    });
});