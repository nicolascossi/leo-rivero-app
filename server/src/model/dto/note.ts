import type { Note } from "@model/mongodb/schema/note";
import type { MongooseDTO, MongooseIdSchema } from "@model/mongodb/types/schema";

class NoteDTO implements MongooseDTO<Note> {
  id: number;
  note: string;
  createdAt?: string;
  updatedAt?: string;

  constructor (note: MongooseIdSchema<Note>) {
    this.id = note._id;
    this.note = note.note;
    this.createdAt = note.createdAt;
    this.updatedAt = note.updatedAt;
  }
}

export default NoteDTO;
