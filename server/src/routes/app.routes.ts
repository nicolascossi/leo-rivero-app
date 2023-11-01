import { Router } from "express";
import ClientRouter from "./client.routes";
import ProductRouter from "./product.routes";
import InvoiceRouter from "./invoice.routes";
import InvoiceProductRouter from "./invoice-product.routes";
import PaymentRouter from "./payment.routes";

const router = Router();

router.get("/test", (req, res) => {
  res.json({
    status: 200,
    message: "The API is working correctly",
    data: null
  });
});

router.use("/clients", ClientRouter);
router.use("/products", ProductRouter);
router.use("/invoices", InvoiceRouter);
router.use("/invoice-products", InvoiceProductRouter);
router.use("/payments", PaymentRouter);

export default router;
