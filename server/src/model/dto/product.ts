import type { Product } from "@model/mongodb/schema/product";
import type { MongooseDTO, MongooseIdSchema } from "@model/mongodb/types/schema";
import ProductPriceDTO from "./price";

class ProductDTO implements Omit<MongooseDTO<Product>, "price"> {
  id: number;
  name: string;
  period: number;
  price?: ProductPriceDTO[];
  createdAt?: string;
  updatedAt?: string;

  constructor (product: MongooseIdSchema<Product>) {
    this.id = product._id;
    this.name = product.name;
    this.period = product.period;
    this.price = product?.price?.map((price) => new ProductPriceDTO(price));
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}

export default ProductDTO;
