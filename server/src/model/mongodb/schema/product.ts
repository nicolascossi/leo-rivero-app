import { Schema, model } from "mongoose";
import { getCounter } from "./auto-increment";
import type { MongooseIdSchema } from "../types/schema";

export interface Product {
  name: string
  price: number
  period: number
}

const productSchema = new Schema<MongooseIdSchema<Product>>({
  _id: {
    type: Number
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  period: {
    type: Number,
    required: true
  }
}, {
  _id: false,
  id: true,
  timestamps: true
});

productSchema.pre("save", async function (next) {
  if (!this.isNew) return;
  this._id = await getCounter("product");
  next();
});

const ProductModel = model<MongooseIdSchema<Product>>("products", productSchema);

export default ProductModel;
