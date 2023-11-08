import noteController from "@controller/note.controller";
import { Router } from "express";
import { createNote } from "middleware/validate/note";

const NoteRouter = Router();

NoteRouter.get("/", noteController.getAll);
NoteRouter.get("/:id", noteController.getById);
NoteRouter.post("/", createNote, noteController.create);
// NoteRouter.put("/:id", updatePayment, noteController.update);
NoteRouter.delete("/:id", noteController.delete);

export default NoteRouter;
