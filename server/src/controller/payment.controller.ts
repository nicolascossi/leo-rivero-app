import type { NextFunction, Request, Response } from "express";
import type { Payment, PaymentsMethods } from "@model/mongodb/schema/payment";
import paymentService from "service/payment.service";

class PaymentController {
  async getAll (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoiceProductId = req.query.invoiceProductId as string;
      const method = req.query.method as PaymentsMethods;

      const payments = await paymentService.getAll({
        invoiceProduct: invoiceProductId,
        method
      });

      void res.json({
        status: 200,
        message: "Payments delivered succesfully",
        data: payments
      });
    } catch (error) {
      next(error);
    }
  }

  async getById (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const payment = await paymentService.getById(id);

      void res.json({
        status: 200,
        message: "Payment delivered succesfully",
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  async create (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        invoiceProduct,
        method,
        paymentDate,
        value
      } = req.body as Payment;

      const payment = await paymentService.create({
        invoiceProduct,
        method,
        paymentDate,
        value
      });

      void res.json({
        status: 201,
        message: "Payment has been created succesfully",
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  // async update (req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const {
  //       note
  //     } = req.body as Payment;

  //     const paymentId = req.params.id;

  //     const payment = await paymentService.update(paymentId, {
  //       note
  //     });

  //     void res.json({
  //       status: 201,
  //       message: "Payment has been updated succesfully",
  //       data: payment
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async delete (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paymentId = req.params.id;

      await paymentService.delete(paymentId);

      void res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
