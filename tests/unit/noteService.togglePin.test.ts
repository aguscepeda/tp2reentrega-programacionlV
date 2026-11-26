import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';
import { notify } from '../../src/services/notificationService';

vi.mock('../../src/services/notificationService', () => ({
    notify: vi.fn()
}));

describe('NoteService - togglePin', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('cambia pinned de false a true', () => {
        const note = service.createNote({
            title: 'Nota',
            content: 'Contenido',
            pinned: false
        });

        const updated = service.togglePin(note.id);

        expect(updated?.pinned).toBe(true);
    });

    it('cambia pinned de true a false', () => {
        const note = service.createNote({
            title: 'Nota',
            content: 'Contenido',
            pinned: true
        });

        const updated = service.togglePin(note.id);

        expect(updated?.pinned).toBe(false);
    });

    it('llama a notify solo cuando la nota queda fijada', () => {
        const note = service.createNote({
            title: 'Nota',
            content: 'Contenido',
            pinned: false
        });

        const updated = service.togglePin(note.id);

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(updated);

        service.togglePin(note.id);

        expect(notify).toHaveBeenCalledTimes(1);
    });

    it('devuelve undefined cuando el id no existe', () => {
        const result = service.togglePin(999);

        expect(result).toBeUndefined();
    });
});