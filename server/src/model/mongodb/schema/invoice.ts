import { Schema, model } from "mongoose";
import { getCounter } from "./auto-increment";
import type { MongooseIdSchema } from "../types/schema";
import type { InvoiceProduct } from "./invoice-product";
import type { Client } from "./client";

export enum InvoiceStatus {
  pending = "pending",
  completed = "payed"
}

export interface Invoice {
  address: string
  IVA: boolean
  isArchived: boolean
  client: Client | number
  status: InvoiceStatus
  products?: Array<MongooseIdSchema<InvoiceProduct>>
}

const invoiceSchema = new Schema<MongooseIdSchema<Invoice>>({
  _id: {
    type: Number
  },
  address: {
    type: String,
    required: true
  },
  IVA: {
    type: Boolean,
    required: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  client: {
    type: Number,
    ref: "clients",
    required: true
  },
  status: {
    type: String,
    enum: InvoiceStatus,
    default: InvoiceStatus.pending
  }
}, {
  _id: false,
  id: true,
  timestamps: true
});

invoiceSchema.virtual("products", {
  ref: "invoice_products",
  localField: "_id",
  foreignField: "invoice"
});

invoiceSchema.pre("save", async function (next) {
  if (!this.isNew) return;
  this._id = await getCounter("invoice");
  next();
});

const InvoiceModel = model<MongooseIdSchema<Invoice>>("invoices", invoiceSchema);

export default InvoiceModel;
