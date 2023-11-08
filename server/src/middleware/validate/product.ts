import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import type { ZodError } from "zod";
import type { CustomHttpError } from "./types/http-errors";

export const createProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const Schema = z.object({
      name: z.string(),
      price: z.number(),
      period: z.number()
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

//! TODO: CHECK OPTIONAL SCHEMA TO UPDATE
export const updateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const Schema = z.object({
      name: z.string(),
      price: z.number(),
      period: z.number()
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
