import NoteDTO from "@model/dto/note";
import NoteModel from "@model/mongodb/schema/note";
import type { Note } from "@model/mongodb/schema/note";

class NoteService {
  async getAll (): Promise<NoteDTO[]> {
    const notes = await NoteModel.find({}, { __v: 0 });

    return notes.map((note) => new NoteDTO(note));
  }

  async getById (id: string): Promise<NoteDTO | null> {
    const note = await NoteModel.findById({ _id: id }, { __v: 0 });
    return note !== null ? new NoteDTO(note) : null;
  }

  async create ({ note }: Note): Promise<Note> {
    const noteModel = new NoteModel({
      note
    });
    const newNote = await noteModel.save();

    return new NoteDTO(newNote);
  }

  async update (
    id: string,
    {
      note
    }: Note
  ): Promise<NoteDTO | null> {
    const updatedNote = await NoteModel.findByIdAndUpdate(
      { _id: id },
      {
        note
      },
      { new: true }
    );

    return updatedNote !== null ? new NoteDTO(updatedNote) : null;
  }

  async delete (id: string): Promise<void> {
    await NoteModel.findByIdAndDelete({ _id: id });
  }
}

export default new NoteService();
