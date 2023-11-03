import ProductDTO from "@model/dto/product";
import ProductModel from "@model/mongodb/schema/product";
import type { Product } from "@model/mongodb/schema/product";
import createHttpError from "http-errors";

class ProductService {
  async getAll (): Promise<ProductDTO[]> {
    const products = await ProductModel.find({}, { __v: 0 });

    return products.map((product) => new ProductDTO(product));
  }

  async getById (id: string): Promise<ProductDTO | null> {
    const product = await ProductModel.findOne({ _id: id }, { __v: 0 });

    return product !== null ? new ProductDTO(product) : null;
  }

  async create ({
    name,
    period,
    price
  }: Product): Promise<ProductDTO> {
    const product = new ProductModel({
      name,
      period,
      price
    });

    const newProduct = await product.save();

    return new ProductDTO(newProduct);
  }

  async update (
    id: string,
    {
      name,
      period,
      price
    }: Product
  ): Promise<ProductDTO | null> {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: id },
      {
        name,
        period,
        price
      },
      { new: true }
    );

    return updatedProduct !== null ? new ProductDTO(updatedProduct) : null;
  }

  async delete (id: string): Promise<void> {
    const product = await ProductModel.findById({ _id: id });

    if (product === null) {
      throw createHttpError.NotFound("Product not founded");
    }

    await ProductModel.deleteOne({ _id: id });
  }
}

export default new ProductService();
