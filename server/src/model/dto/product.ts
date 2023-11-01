import type { Product } from "@model/mongodb/schema/product";
import type { MongooseDTO, MongooseIdSchema } from "@model/mongodb/types/schema";

class ProductDTO implements MongooseDTO<Product> {
  id: number;
  name: string;
  period: number;
  price: number;

  constructor (product: MongooseIdSchema<Product>) {
    this.id = product._id;
    this.name = product.name;
    this.period = product.period;
    this.price = product.price;
  }
}

export default ProductDTO;
