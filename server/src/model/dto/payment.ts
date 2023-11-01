import type { InvoiceProduct } from "@model/mongodb/schema/invoice-product";
import type { Payment, PaymentsMethods } from "@model/mongodb/schema/payment";
import type { MongooseDTO, MongooseIdSchema } from "@model/mongodb/types/schema";
import InvoiceProductDTO from "./invoice-product";

class PaymentDTO implements Omit<MongooseDTO<Payment>, "invoiceProduct"> {
  id: number;
  invoiceProduct: number | InvoiceProductDTO;
  method: PaymentsMethods;
  note: string;
  paymentDate: Date;
  value: number;

  constructor (payment: MongooseIdSchema<Payment>) {
    this.id = payment._id;
    this.invoiceProduct = typeof payment.invoiceProduct === "number" ? payment.invoiceProduct : new InvoiceProductDTO(payment.invoiceProduct as MongooseIdSchema<InvoiceProduct>);
    this.method = payment.method;
    this.note = payment.note;
    this.paymentDate = payment.paymentDate;
    this.value = payment.value;
  }
}

export default PaymentDTO;
