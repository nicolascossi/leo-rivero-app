import { Schema, model } from "mongoose";
import { getCounter } from "./auto-increment";
import type { MongooseIdSchema } from "../types/schema";
import type { Product } from "./product";

export interface ProductPrice {
  price: number
  product: Product | number
  createdAt?: string
  updatedAt?: string
}

const productPriceSchema = new Schema<MongooseIdSchema<ProductPrice>>({
  _id: {
    type: Number
  },
  product: {
    type: Number,
    required: true,
    ref: "products"
  },
  price: {
    type: Number,
    required: true
  }
}, {
  _id: false,
  id: true,
  timestamps: true
});

productPriceSchema.pre("save", async function (next) {
  if (!this.isNew) return;
  this._id = await getCounter("price");
  next();
});

const ProductPriceModel = model<MongooseIdSchema<ProductPrice>>("prices", productPriceSchema);

export default ProductPriceModel;
