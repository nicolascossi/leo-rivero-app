import { Schema, model } from "mongoose";
import { getCounter } from "./auto-increment";
import type { MongooseIdSchema } from "../types/schema";
import type { ProductPrice } from "./price";

export interface Product {
  name: string
  price?: Array<MongooseIdSchema<ProductPrice>>
  period: number
  createdAt?: string
  updatedAt?: string
}

const productSchema = new Schema<MongooseIdSchema<Product>>({
  _id: {
    type: Number
  },
  name: {
    type: String,
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

productSchema.virtual("price", {
  ref: "prices",
  localField: "_id",
  foreignField: "product"
});

productSchema.pre("save", async function (next) {
  if (!this.isNew) return;
  this._id = await getCounter("product");
  next();
});

const ProductModel = model<MongooseIdSchema<Product>>("products", productSchema);

export default ProductModel;
