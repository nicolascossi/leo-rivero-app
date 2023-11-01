import productController from "@controller/product.controller";
import { Router } from "express";
import { createProduct, updateProduct } from "middleware/validate/product";

const ProductRouter = Router();

ProductRouter.get("/", productController.getAll);
ProductRouter.get("/:id", productController.getById);
ProductRouter.post("/", createProduct, productController.create);
ProductRouter.put("/:id", updateProduct, productController.update);
ProductRouter.delete("/:id", productController.delete);

export default ProductRouter;
