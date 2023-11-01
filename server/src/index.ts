/* eslint-disable no-console */
import type { NextFunction, Request, Response } from "express";
import type { AddressInfo } from "net";
// Import database connection
import "@model/mongodb/config/connection";
import createError from "http-errors";
import express from "express";
import cors from "cors";
import routerApp from "@routes/app.routes";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", routerApp);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (createError.isHttpError(err)) {
    res.status(err.status).json({
      message: err.message,
      status: err.status
    });
  } else {
    console.log(err);
    res.status(500).json({
      message: "Something is going wrong...",
      status: 500
    });
  }
});

const server = app.listen(8080, () => {
  const address = server.address() as AddressInfo;

  const port = address.port;

  console.log(`Listening in http://localhost:${port}/`);
});
