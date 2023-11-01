import type { Product } from "@model/mongodb/schema/product";
import type { NextFunction, Request, Response } from "express";
import productService from "service/product.service";

class ProductController {
  async getAll (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await productService.getAll();

      void res.json({
        status: 200,
        message: "Products delivered succesfully",
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  async getById (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const product = await productService.getById(id);

      void res.json({
        status: 200,
        message: "Product delivered succesfully",
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        name,
        period,
        price
      } = req.body as Product;

      const product = await productService.create({
        name,
        period,
        price
      });
      void res.json({
        status: 201,
        message: "Product has been created succesfully",
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        name,
        period,
        price
      } = req.body as Product;

      const productId = req.params.id;

      const product = await productService.update(
        productId,
        {
          name,
          period,
          price
        }
      );
      void res.json({
        status: 201,
        message: "Product has been updated succesfully",
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async delete (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = req.params.id;

      await productService.delete(productId);

      void res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
