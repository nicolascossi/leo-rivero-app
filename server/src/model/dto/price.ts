import type { ProductPrice } from "@model/mongodb/schema/price";
import type { Product } from "@model/mongodb/schema/product";
import type { MongooseDTO, MongooseIdSchema } from "@model/mongodb/types/schema";

class ProductPriceDTO implements MongooseDTO<ProductPrice> {
  id: number;
  price: number;
  product: number | Product;
  createdAt?: string;
  updatedAt?: string;

  constructor (price: MongooseIdSchema<ProductPrice>) {
    this.id = price._id;
    this.product = price.product;
    this.price = price.price;
    this.createdAt = price.createdAt;
    this.updatedAt = price.updatedAt;
  }
}

export default ProductPriceDTO;
