import type { Note } from "@model/mongodb/schema/note";
import type { NextFunction, Request, Response } from "express";
import noteService from "service/note.service";

class NoteController {
  async getAll (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notes = await noteService.getAll();

      void res.json({
        status: 200,
        message: "Notes delivered succesfully",
        data: notes
      });
    } catch (error) {
      next(error);
    }
  }

  async getById (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const note = await noteService.getById(id);

      void res.json({
        status: 200,
        message: "Note delivered succesfully",
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        note
      } = req.body as Note;
      const newNote = await noteService.create({
        note
      });

      void res.json({
        status: 201,
        message: "Note has been created succesfully",
        data: newNote
      });
    } catch (error) {
      next(error);
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        note
      } = req.body as Note;
      const noteId = req.params.id;

      const updatedNote = await noteService.update(noteId, {
        note
      });

      void res.json({
        status: 201,
        message: "Note has been updated succesfully",
        data: updatedNote
      });
    } catch (error) {
      next(error);
    }
  }

  async delete (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const noteId = req.params.id;

      await noteService.delete(noteId);

      void res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

export default new NoteController();
