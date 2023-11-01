import invoiceProductController from "@controller/invoice-product.controller";
import { Router } from "express";
import { createInvoiceProduct, updateInvoiceProduct } from "middleware/validate/invoice-product";

const InvoiceProductRouter = Router();

InvoiceProductRouter.get("/", invoiceProductController.getAll);
InvoiceProductRouter.get("/:id", invoiceProductController.getById);
InvoiceProductRouter.post("/", createInvoiceProduct, invoiceProductController.create);
InvoiceProductRouter.put("/:id", updateInvoiceProduct, invoiceProductController.update);
InvoiceProductRouter.delete("/:id", invoiceProductController.delete);

export default InvoiceProductRouter;
