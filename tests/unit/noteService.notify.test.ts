import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';
import { notify } from '../../src/services/notificationService';

vi.mock('../../src/services/notificationService', () => ({
    notify: vi.fn()
}));

describe('NoteService - notificación al fijar (Ejercicio 6)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('llama a notify con la nota creada cuando pinned es true', () => {
        const note = service.createNote({ title: 'Importante', content: 'No olvidar', pinned: true });

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(note);
    });

    it('no llama a notify cuando pinned es false', () => {
        service.createNote({ title: 'A', content: 'B', pinned: false });

        expect(notify).not.toHaveBeenCalled();
    });

    it('no llama a notify cuando pinned no se indica', () => {
        service.createNote({ title: 'A', content: 'B' });

        expect(notify).not.toHaveBeenCalled();
    });

    it('igual devuelve la nota creada con pinned: true', () => {
        const note = service.createNote({ title: 'A', content: 'B', pinned: true });

        expect(note.pinned).toBe(true);
        expect(service.getNote(note.id)).toEqual(note);
    });
});