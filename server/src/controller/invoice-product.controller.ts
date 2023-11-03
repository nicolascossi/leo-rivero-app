import type { InvoiceProduct } from "@model/mongodb/schema/invoice-product";
import type { NextFunction, Request, Response } from "express";
import invoiceProductService from "service/invoice-product.service";

class InvoiceProductController {
  async getAll (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoiceId = req.query.invoiceId as string;

      const invoices = await invoiceProductService.getAll({ invoiceId });

      void res.json({
        status: 200,
        message: "Invoice Products delivered succesfully",
        data: invoices
      });
    } catch (error) {
      next(error);
    }
  }

  async getById (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const invoiceProduct = await invoiceProductService.getById(id);

      void res.json({
        status: 200,
        message: "Invoice product delivered succesfully",
        data: invoiceProduct
      });
    } catch (error) {
      next(error);
    }
  }

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        numberId,
        price,
        period,
        invoice,
        product,
        deliveryDate,
        retirementDate
      } = req.body as InvoiceProduct;
      const invoiceProduct = await invoiceProductService.create({
        numberId,
        price,
        period,
        invoice,
        product,
        deliveryDate,
        retirementDate
      });

      void res.json({
        status: 201,
        message: "Invoice Product has been created succesfully",
        data: invoiceProduct
      });
    } catch (error) {
      next(error);
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        retirementDate
      } = req.body as InvoiceProduct;
      const invoiceProductId = req.params.id;
      const doc = await invoiceProductService.update(invoiceProductId, {
        retirementDate
      });

      void res.json({
        status: 201,
        message: "Invoice Products has been created succesfully",
        data: doc
      });
    } catch (error) {
      next(error);
    }
  }

  async delete (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoiceProductId = req.params.id;
      await invoiceProductService.delete(invoiceProductId);

      void res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

export default new InvoiceProductController();
