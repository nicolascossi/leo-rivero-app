import invoiceController from "@controller/invoice.controller";
import { Router } from "express";
import { createInvoice, updateInvoice } from "middleware/validate/invoice";

const InvoiceRouter = Router();

InvoiceRouter.get("/", invoiceController.getAll);
InvoiceRouter.get("/:id", invoiceController.getById);
InvoiceRouter.post("/", createInvoice, invoiceController.create);
InvoiceRouter.put("/:id", updateInvoice, invoiceController.update);
InvoiceRouter.delete("/:id", invoiceController.delete);

export default InvoiceRouter;
