import InvoiceModel from "./invoice";
import type { Invoice } from "./invoice";
import { Schema, model } from "mongoose";
import { getCounter } from "./auto-increment";
import type { MongooseIdSchema } from "../types/schema";
import type { Payment } from "./payment";
import type { Product } from "./product";

export interface InvoiceProduct {
  numberId: number
  price: number
  period: number
  product: Product | number
  invoice: Invoice | number
  payments?: Array<MongooseIdSchema<Payment>>
  deliveryDate?: Date
  retirementDate?: Date
  createdAt?: string
  updatedAt?: string
}

const invoiceProductSchema = new Schema<MongooseIdSchema<InvoiceProduct>>({
  _id: {
    type: Number
  },
  numberId: {
    type: Number
  },
  price: {
    type: Number,
    required: true
  },
  period: {
    type: Number,
    required: true
  },
  product: {
    type: Number,
    ref: "products",
    required: true
  },
  invoice: {
    type: Number,
    ref: "invoices",
    required: true
  },
  deliveryDate: {
    type: Date,
    default: Date.now()
  },
  retirementDate: {
    type: Date
  }
}, {
  _id: false,
  id: true,
  timestamps: true
});

invoiceProductSchema.virtual("payments", {
  ref: "payments",
  localField: "_id",
  foreignField: "invoiceProduct"
});

invoiceProductSchema.post("save", async function () {
  await InvoiceModel.updateOne(
    { id: this.invoice },
    {
      $push: {
        products: this.id
      }
    }
  );
});

invoiceProductSchema.pre("save", async function (next) {
  if (!this.isNew) return;
  this._id = await getCounter("invoice-products");
  next();
});

const InvoiceProductModel = model<MongooseIdSchema<InvoiceProduct>>("invoice_products", invoiceProductSchema);

export default InvoiceProductModel;
