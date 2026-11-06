import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

// EJERCICIO 3 — getNote(id)

describe('NoteService - getNote (Ejercicio 3)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('devuelve la nota cuando el id existe', () => {
        const created = service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });

        const found = service.getNote(created.id);

        expect(found).toEqual(created);
    });

    it('devuelve la nota correcta cuando hay varias', () => {
        service.createNote({ title: 'A', content: 'B' });
        const second = service.createNote({ title: 'C', content: 'D' });

        const found = service.getNote(second.id);

        expect(found?.title).toBe('C');
        expect(found?.content).toBe('D');
    });

    it('devuelve undefined si el id no existe', () => {
        expect(service.getNote(999)).toBeUndefined();
    });
});