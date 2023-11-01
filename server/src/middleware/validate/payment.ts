import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import type { ZodError } from "zod";
import type { CustomHttpError } from "./types/http-errors";

export const createPayment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const Schema = z.object({
      invoiceProduct: z.number(),
      method: z.enum(["cash", "transfer", "cheque", "canje"]),
      value: z.number(),
      paymentDate: z.string().datetime(),
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

//! TODO: CHECK OPTIONAL SCHEMA TO UPDATE
export const updatePayment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const Schema = z.object({
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
