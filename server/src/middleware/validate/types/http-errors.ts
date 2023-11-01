import type { HttpError } from "http-errors";

export interface CustomHttpError<N extends number> extends Omit<HttpError<N>, "message"> {
  message: string | unknown[]
}
