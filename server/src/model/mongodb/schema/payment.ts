import { Schema, model } from "mongoose";
import InvoiceProductModel from "./invoice-product";
import type { InvoiceProduct } from "./invoice-product";
import { getCounter } from "./auto-increment";
import type { MongooseIdSchema } from "../types/schema";

export enum PaymentsMethods {
  cash = "cash",
  transfer = "transfer",
  credit = "credit",
  canje = "canje",
}

export interface Payment {
  invoiceProduct: InvoiceProduct | number
  method: PaymentsMethods
  value: number
  paymentDate: Date
  createdAt?: string
  updatedAt?: string
}

const paymentSchema = new Schema<MongooseIdSchema<Payment>>(
  {
    _id: {
      type: Number
    },
    invoiceProduct: {
      type: Number,
      ref: "invoice_products",
      name: "invoice_product",
      required: true
    },
    method: {
      type: String,
      enum: PaymentsMethods,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    paymentDate: {
      type: Date,
      required: true
    }
  },
  {
    _id: false,
    id: true,
    timestamps: true
  }
);

paymentSchema.post("save", async function () {
  await InvoiceProductModel.updateOne(
    { id: this.invoiceProduct },
    {
      $push: {
        payments: this.id
      }
    }
  );
});

paymentSchema.pre("save", async function (next) {
  if (!this.isNew) return;
  this._id = await getCounter("payment");
  next();
});

const PaymentModel = model<MongooseIdSchema<Payment>>(
  "payments",
  paymentSchema
);

export default PaymentModel;
