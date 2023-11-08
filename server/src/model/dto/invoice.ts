import type { Invoice, InvoiceStatus } from "@model/mongodb/schema/invoice";
import type { MongooseDTO, MongooseIdSchema } from "@model/mongodb/types/schema";
import InvoiceProductDTO from "./invoice-product";
import ClientDTO from "./client";
import type { Client } from "@model/mongodb/schema/client";

class InvoiceDTO implements Omit<MongooseDTO<Invoice>, "products" | "client"> {
  id: number;
  IVA?: boolean;
  address: string;
  client: number | ClientDTO;
  isArchived: boolean;
  status: InvoiceStatus;
  products?: InvoiceProductDTO[];
  createdAt?: string;
  updatedAt?: string;

  constructor (invoice: MongooseIdSchema<Invoice>) {
    this.id = invoice._id;
    this.IVA = invoice.IVA;
    this.address = invoice.address;
    this.client = typeof invoice.client === "number"
      ? invoice.client
      : new ClientDTO(invoice.client as MongooseIdSchema<Client>);
    this.status = invoice.status;
    this.isArchived = invoice.isArchived;
    if (invoice.products !== undefined) {
      this.products = invoice.products.map((product) => new InvoiceProductDTO(product));
    }
    this.createdAt = invoice.createdAt;
    this.updatedAt = invoice.updatedAt;
  }
}

export default InvoiceDTO;
