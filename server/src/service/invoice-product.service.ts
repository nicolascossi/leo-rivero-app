import InvoiceProductDTO from "@model/dto/invoice-product";
import InvoiceProductModel from "@model/mongodb/schema/invoice-product";
import type { InvoiceProduct } from "@model/mongodb/schema/invoice-product";
import createHttpError from "http-errors";
import { cleanUndefinedValues } from "utils/validations";
import invoiceService from "./invoice.service";
import productService from "./product.service";

class InvoiceProductService {
  async getAll (
    query: {
      invoiceId?: string
    }
  ): Promise<InvoiceProductDTO[]> {
    const invoiceProducts = await InvoiceProductModel.find(cleanUndefinedValues(query), { __v: 0 })
      .populate("product")
      .populate("invoice")
      .populate("payments");
    return invoiceProducts.map((invoiceProduct) => new InvoiceProductDTO(invoiceProduct));
  }

  async getById (id: string): Promise<InvoiceProductDTO | null> {
    const invoiceProduct = await InvoiceProductModel.findById({ _id: id }, { __v: 0 })
      .populate("product")
      .populate("invoice")
      .populate("payments");

    return invoiceProduct !== null ? new InvoiceProductDTO(invoiceProduct) : null;
  }

  async create ({
    numberId,
    invoice,
    period,
    price,
    product,
    deliveryDate,
    retirementDate
  }: Omit<InvoiceProduct, "payments">): Promise<InvoiceProductDTO> {
    const invoiceModel = await invoiceService.getById(String(invoice));

    if (invoiceModel === null) {
      throw createHttpError.NotFound("The Invoice was not founded");
    }

    const productModel = await productService.getById(String(product));

    if (productModel === null) {
      throw createHttpError.NotFound("The Product was not founded");
    }

    const invoiceProduct = new InvoiceProductModel({
      numberId,
      invoice,
      period: period ?? productModel.period,
      price: price ?? productModel.price,
      product,
      deliveryDate,
      retirementDate
    });
    const newInvoiceProduct = await invoiceProduct.save();

    return new InvoiceProductDTO(newInvoiceProduct);
  }

  async update (
    id: string,
    {
      deliveryDate,
      retirementDate
    }: Pick<InvoiceProduct, "deliveryDate" | "retirementDate">
  ): Promise<InvoiceProductDTO | null> {
    const updatedInvoiceProduct = await InvoiceProductModel.findOneAndUpdate(
      { id },
      {
        deliveryDate,
        retirementDate
      },
      { new: true }
    );
    return updatedInvoiceProduct !== null ? new InvoiceProductDTO(updatedInvoiceProduct) : null;
  }

  async delete (id: string): Promise<void> {
    const invoiceProduct = await InvoiceProductModel.findById({ _id: id });

    if (invoiceProduct === null) {
      throw createHttpError.NotFound("Invoice Product not founded");
    }

    if (invoiceProduct.payments !== undefined && invoiceProduct.payments.length !== 0) {
      throw createHttpError["422"]("Can't delete invoice products with payments");
    }

    await InvoiceProductModel.deleteOne({ id });
  }
}

export default new InvoiceProductService();
