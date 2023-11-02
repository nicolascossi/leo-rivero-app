import paymentController from "@controller/payment.controller";
import { Router } from "express";
import { createPayment } from "middleware/validate/payment";

const PaymentRouter = Router();

PaymentRouter.get("/", paymentController.getAll);
PaymentRouter.get("/:id", paymentController.getById);
PaymentRouter.post("/", createPayment, paymentController.create);
// PaymentRouter.put("/:id", updatePayment, paymentController.update);
PaymentRouter.delete("/:id", paymentController.delete);

export default PaymentRouter;
