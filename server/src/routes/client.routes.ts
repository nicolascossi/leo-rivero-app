import clientController from "@controller/client.controller";
import { Router } from "express";
import { createClient, updateClient } from "middleware/validate/client";

const ClientRouter = Router();

ClientRouter.get("/", clientController.getAll);
ClientRouter.get("/:id", clientController.getById);
ClientRouter.post("/", createClient, clientController.create);
ClientRouter.put("/:id", updateClient, clientController.update);
ClientRouter.delete("/:id", clientController.delete);

export default ClientRouter;
