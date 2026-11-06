import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - deleteNote (Ejercicio 5)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('devuelve true al eliminar una nota existente', () => {
        const note = service.createNote({ title: 'A', content: 'B' });

        expect(service.deleteNote(note.id)).toBe(true);
    });

    it('la nota eliminada ya no se puede obtener', () => {
        const note = service.createNote({ title: 'A', content: 'B' });

        service.deleteNote(note.id);

        expect(service.getNote(note.id)).toBeUndefined();
    });

    it('solo elimina la nota indicada, las demás siguen en listNotes()', () => {
        const first = service.createNote({ title: 'A', content: 'B' });
        const second = service.createNote({ title: 'C', content: 'D' });

        service.deleteNote(first.id);

        expect(service.listNotes().map((n) => n.id)).toEqual([second.id]);
    });

    it('devuelve false si el id no existe', () => {
        expect(service.deleteNote(999)).toBe(false);
    });
});