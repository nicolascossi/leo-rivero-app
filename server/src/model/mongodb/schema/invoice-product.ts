import InvoiceModel from "./invoice";
import type { Invoice } from "./invoice";
import { Schema, model } from "mongoose";
import { getCounter } from "./auto-increment";
import type { MongooseIdSchema } from "../types/schema";
import type { Payment } from "./payment";
import type { Product } from "./product";
import type { ProductPrice } from "./price";

export interface InvoiceProduct {
  numberId: number
  price: Array<MongooseIdSchema<ProductPrice>>
  manualPeriod?: number
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
  manualPeriod: {
    type: Number
  },
  numberId: {
    type: Number
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

invoiceProductSchema.virtual("price", {
  ref: "prices",
  localField: "product",
  foreignField: "product",
  match (invoiceProduct) {
    const start = new Date(invoiceProduct.createdAt);
    start.setHours(0);
    start.setMinutes(0);
    let end = new Date(invoiceProduct.retirementDate ?? Date.now());
    end.setDate(end.getDate() + 1);
    if (invoiceProduct.manualPeriod !== undefined) {
      end = new Date(invoiceProduct.deliveryDate);
      end.setDate(end.getDate() + invoiceProduct.manualPeriod * invoiceProduct.period + 1);
    }
    return {
      // TODO: ENCONTRAR MANERA DE QUE AGARRE EL PRIMER PRECIO ANTERIOR A LA FECHA DE DELIVERY
      createdAt: {
        $lt: end
      }
    };
  }
});

invoiceProductSchema.pre("save", async function (next) {
  if (!this.isNew) return;
  this._id = await getCounter("invoice-products");
  next();
});

const InvoiceProductModel = model<MongooseIdSchema<InvoiceProduct>>("invoice_products", invoiceProductSchema);

export default InvoiceProductModel;
