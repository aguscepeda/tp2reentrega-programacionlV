import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

// EJERCICIO 2 — listNotes

describe('NoteService - listNotes (Ejercicio 2)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('devuelve un arreglo vacío si no hay notas', () => {
        expect(service.listNotes()).toEqual([]);
    });

    it('devuelve todas las notas creadas', () => {
        service.createNote({ title: 'A', content: 'B' });
        service.createNote({ title: 'C', content: 'D' });

        const notes = service.listNotes();

        expect(notes).toHaveLength(2);
        expect(notes.map((n) => n.title)).toEqual(['A', 'C']);
    });

    it('las devuelve en orden de creación (por id ascendente)', () => {
        const first = service.createNote({ title: 'Primera', content: 'x' });
        const second = service.createNote({ title: 'Segunda', content: 'y' });

        const ids = service.listNotes().map((n) => n.id);

        expect(ids).toEqual([first.id, second.id]);
    });
});