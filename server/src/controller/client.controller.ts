import type { Client } from "@model/mongodb/schema/client";
import type { NextFunction, Request, Response } from "express";
import clientService from "service/client.service";

class ClientController {
  async getAll (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clients = await clientService.getAll();

      void res.json({
        status: 200,
        message: "Clients delivered succesfully",
        data: clients
      });
    } catch (error) {
      next(error);
    }
  }

  async getById (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const client = await clientService.getById(id);

      void res.json({
        status: 200,
        message: "Client delivered succesfully",
        data: client
      });
    } catch (error) {
      next(error);
    }
  }

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        name,
        email,
        CUIT,
        phone,
        address,
        note
      } = req.body as Client;
      const client = await clientService.create({
        name,
        email,
        CUIT,
        phone,
        address,
        note
      });

      void res.json({
        status: 201,
        message: "Client has been created succesfully",
        data: client
      });
    } catch (error) {
      next(error);
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        name,
        email,
        CUIT,
        phone,
        address,
        note
      } = req.body as Client;
      const clientId = req.params.id;

      const client = await clientService.update(clientId, {
        name,
        email,
        CUIT,
        phone,
        address,
        note
      });

      void res.json({
        status: 201,
        message: "Client has been updated succesfully",
        data: client
      });
    } catch (error) {
      next(error);
    }
  }

  async delete (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientId = req.params.id;

      await clientService.delete(clientId);

      void res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

export default new ClientController();
