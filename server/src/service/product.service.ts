import ProductDTO from "@model/dto/product";
import ProductPriceModel from "@model/mongodb/schema/price";
import ProductModel from "@model/mongodb/schema/product";
import type { Product } from "@model/mongodb/schema/product";
import createHttpError from "http-errors";

class ProductService {
  async getAll (): Promise<ProductDTO[]> {
    const products = await ProductModel.find({}, { __v: 0 })
      .populate({
        path: "price",
        options: {
          limit: 1,
          sort: {
            createdAt: 1
          }
        }
      });

    return products.map((product) => new ProductDTO(product));
  }

  async getById (id: string): Promise<ProductDTO | null> {
    const product = await ProductModel.findOne({ _id: id }, { __v: 0 })
      .populate({
        path: "price",
        options: {
          limit: 1,
          sort: {
            createdAt: 1
          }
        }
      });

    return product !== null ? new ProductDTO(product) : null;
  }

  async create ({
    name,
    period,
    price
  }: Omit<Product, "price"> & { price: number }): Promise<ProductDTO> {
    const product = new ProductModel({
      name,
      period
    });

    const newProduct = await product.save();

    const productPrice = new ProductPriceModel({
      price,
      product: product.id
    });

    await productPrice.save();

    return new ProductDTO(await newProduct.populate("price"));
  }

  async update (
    id: string,
    {
      name,
      period,
      price
    }: Omit<Product, "price"> & { price?: number }
  ): Promise<ProductDTO | null> {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: id },
      {
        name,
        period
      },
      { new: true }
    );

    if (price !== undefined) {
      const productPrice = new ProductPriceModel({
        price,
        product: id
      });

      await productPrice.save();
    }

    return updatedProduct !== null ? new ProductDTO(await updatedProduct.populate("price")) : null;
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
