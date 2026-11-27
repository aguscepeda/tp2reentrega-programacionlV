import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - getStats', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('devuelve { total: 0, pinned: 0 } cuando no hay notas', () => {
    expect(service.getStats()).toEqual({ total: 0, pinned: 0 });
  });

  it('cuenta el total de notas y cuántas están fijadas', () => {
    service.createNote({ title: 'Nota 1', content: 'Contenido 1', pinned: true });
    service.createNote({ title: 'Nota 2', content: 'Contenido 2', pinned: false });
    service.createNote({ title: 'Nota 3', content: 'Contenido 3' });

    expect(service.getStats()).toEqual({ total: 3, pinned: 1 });
  });
});