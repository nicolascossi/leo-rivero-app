import { Schema, model } from "mongoose";
import { getCounter } from "./auto-increment";
import type { MongooseIdSchema } from "../types/schema";

export interface Note {
  note: string
  createdAt?: string
  updatedAt?: string
}

const noteSchema = new Schema<MongooseIdSchema<Note>>({
  _id: {
    type: Number
  },
  note: {
    type: String,
    required: true
  }
}, {
  _id: false,
  id: true,
  timestamps: true
});

noteSchema.pre("save", async function (next) {
  if (!this.isNew) return;
  this._id = await getCounter("note");
  next();
});

const NoteModel = model<MongooseIdSchema<Note>>("notes", noteSchema);

export default NoteModel;
