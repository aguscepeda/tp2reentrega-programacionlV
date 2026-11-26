import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - searchNotes', () => {
  let service: NoteServiceImpl;
  beforeEach(() => {
    service = new NoteServiceImpl(new SqliteNoteRepository(createDb(':memory:')));
    service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });
    service.createNote({ title: 'Dentista', content: 'Comprar hilo dental' });
    service.createNote({ title: 'Gimnasio', content: 'Piernas' });
  });

  it('busca en título y contenido', () => {
    expect(service.searchNotes('comprar').map(n => n.title)).toEqual(['Comprar pan', 'Dentista']);
  });
  it('no distingue mayúsculas', () => {
    expect(service.searchNotes('GIMNASIO')).toHaveLength(1);
  });
  it('devuelve [] si no hay coincidencias', () => {
    expect(service.searchNotes('xyz')).toEqual([]);
  });
});
