import type { InvoiceProduct } from "@model/mongodb/schema/invoice-product";
import type { MongooseDTO, MongooseIdSchema } from "@model/mongodb/types/schema";
import PaymentDTO from "./payment";
import type { Invoice } from "@model/mongodb/schema/invoice";
import type { Product } from "@model/mongodb/schema/product";
import InvoiceDTO from "./invoice";
import ProductDTO from "./product";

class InvoiceProductDTO implements Omit<MongooseDTO<InvoiceProduct>, "payments" | "invoice" | "product"> {
  id: number;
  numberId: number;
  invoice: number | InvoiceDTO;
  product: number | ProductDTO;
  period: number;
  price: number;
  deliveryDate?: Date | undefined;
  retirementDate?: Date | undefined;
  payments?: PaymentDTO[] | number[];

  constructor (invoiceProduct: MongooseIdSchema<InvoiceProduct>) {
    this.id = invoiceProduct._id;
    this.numberId = invoiceProduct.numberId;
    this.invoice = typeof invoiceProduct.invoice === "number"
      ? invoiceProduct.invoice
      : new InvoiceDTO(invoiceProduct.invoice as MongooseIdSchema<Invoice>);
    this.product = typeof invoiceProduct.product === "number"
      ? invoiceProduct.product
      : new ProductDTO(invoiceProduct.product as MongooseIdSchema<Product>);
    this.period = invoiceProduct.period;
    this.price = invoiceProduct.price;
    this.deliveryDate = invoiceProduct.deliveryDate;
    this.retirementDate = invoiceProduct.retirementDate;
    if (invoiceProduct.payments !== undefined && invoiceProduct.payments.length !== 0) {
      this.payments = invoiceProduct.payments.map((payment) => {
        return typeof payment === "number"
          ? payment
          : new PaymentDTO(payment);
      });
    }
  }
}

export default InvoiceProductDTO;
