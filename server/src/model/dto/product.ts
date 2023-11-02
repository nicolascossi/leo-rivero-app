import type { Product } from "@model/mongodb/schema/product";
import type { MongooseDTO, MongooseIdSchema } from "@model/mongodb/types/schema";

class ProductDTO implements MongooseDTO<Product> {
  id: number;
  name: string;
  period: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;

  constructor (product: MongooseIdSchema<Product>) {
    this.id = product._id;
    this.name = product.name;
    this.period = product.period;
    this.price = product.price;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}

export default ProductDTO;
