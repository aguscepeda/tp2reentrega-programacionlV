import { expect } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';
import { NewNote, Note } from '../../src/models/Note';

type App = ReturnType<typeof makeApp>;

export async function crearNota(app: App, datos: NewNote): Promise<Note> {
  const res = await request(app).post('/notes').send(datos);
  expect(res.status).toBe(201);
  return res.body;
}