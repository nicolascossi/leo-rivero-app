import type { Invoice, InvoiceStatus } from "@model/mongodb/schema/invoice";
import type { NextFunction, Request, Response } from "express";
import invoiceService from "service/invoice.service";

class InvoiceController {
  async getAll (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        clientId,
        address,
        client,
        item
      } = req.query as Record<string, string>;
      const status = req.query.status as InvoiceStatus | "archived";

      const invoices = await invoiceService.getAll({
        client: clientId,
        status
      }, {
        clientName: client,
        address,
        orderItemId: item
      });

      void res.json({
        status: 200,
        message: "Invoices delivered succesfully",
        data: invoices
      });
    } catch (error) {
      next(error);
    }
  }

  async getById (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const invoice = await invoiceService.getById(id);

      void res.json({
        status: 200,
        message: "Invoice delivered succesfully",
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        client,
        IVA,
        address
      } = req.body as Invoice;

      const invoice = await invoiceService.create({
        client,
        IVA,
        address
      });

      void res.json({
        status: 201,
        message: "Invoice has been created succesfully",
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        IVA,
        address
      } = req.body as Invoice;

      const productId = req.params.id;

      const invoice = await invoiceService.update(productId, {
        IVA,
        address
      });
      void res.json({
        status: 201,
        message: "Invoice has been updated succesfully",
        data: invoice
      });
    } catch (error) {
      next(error);
    }
  }

  async delete (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoiceId = req.params.id;

      await invoiceService.delete(invoiceId);

      void res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

export default new InvoiceController();
