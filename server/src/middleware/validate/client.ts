import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import type { ZodError } from "zod";
import type { CustomHttpError } from "./types/http-errors";

export const createClient = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const Schema = z.object({
      CUIT: z.optional(z.string()),
      email: z.optional(z.string().trim().email()),
      name: z.string().max(30),
      phone: z.optional(
        z.string()
      ),
      address: z.optional(z.string().trim()),
      note: z.optional(z.string())
    });

    Schema.parse(req.body);

    next();
  } catch (error) {
    const HttpError: CustomHttpError<400> = createHttpError.BadRequest();
    const issues = (error as ZodError).issues;
    HttpError.message = issues.map((issue) => (
      {
        path: issue.path,
        error: issue.message
      }
    ));
    next(HttpError);
  }
};

export const updateClient = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const Schema = z.object({
      CUIT: z.optional(z.string()),
      email: z.optional(z.string().trim().email()),
      name: z.string().max(30),
      phone: z.optional(
        z.string()
      ),
      address: z.optional(z.string().trim()),
      note: z.optional(z.string())
    });

    Schema.partial().parse(req.body);

    next();
  } catch (error) {
    const HttpError: CustomHttpError<400> = createHttpError.BadRequest();
    const issues = (error as ZodError).issues;
    HttpError.message = issues.map((issue) => (
      {
        path: issue.path,
        error: issue.message
      }
    ));
    next(HttpError);
  }
};
