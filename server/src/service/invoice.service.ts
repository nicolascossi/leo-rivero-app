import InvoiceDTO from "@model/dto/invoice";
import InvoiceModel, { InvoiceStatus } from "@model/mongodb/schema/invoice";
import type { Invoice } from "@model/mongodb/schema/invoice";
import createHttpError from "http-errors";
import { cleanUndefinedValues } from "utils/validations";

class InvoiceService {
  async getAll (
    query: {
      status?: InvoiceStatus
      client?: string
    }
  ): Promise<InvoiceDTO[]> {
    const invoices = await InvoiceModel.find(cleanUndefinedValues(query), { __v: 0 })
      .populate("client")
      .populate({
        path: "products",
        populate: {
          path: "product"
        }
      });

    return invoices.map((invoice) => new InvoiceDTO(invoice));
  }

  async getById (id: string): Promise<InvoiceDTO | null> {
    const invoice = await InvoiceModel.findById({ _id: id }, { __v: 0 })
      .populate("client")
      .populate({
        path: "products",
        populate: {
          path: "product"
        }
      });

    return invoice !== null ? new InvoiceDTO(invoice) : null;
  }

  async create ({
    client,
    IVA,
    address
  }: Omit<Invoice, "status" | "products" | "isArchived">): Promise<InvoiceDTO> {
    const invoice = new InvoiceModel({
      client,
      IVA,
      address
    });
    const newInvoice = await invoice.save();
    return new InvoiceDTO(newInvoice);
  }

  async update (
    id: string,
    {
      IVA,
      address
    }: Pick<Invoice, "IVA" | "address">
  ): Promise<InvoiceDTO | null> {
    const updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { id },
      {
        IVA,
        address
      },
      {
        new: true
      }
    );
    return updatedInvoice !== null ? new InvoiceDTO(updatedInvoice) : null;
  }

  async delete (id: string): Promise<void> {
    const invoice = await InvoiceModel.findById({ id });

    if (invoice === null) {
      throw createHttpError.NotFound("Invoice not founded");
    }

    if (invoice.status === InvoiceStatus.completed) {
      throw createHttpError["422"]("Can't delete a completed Invoice");
    }

    await InvoiceModel.deleteOne({ id });
  }
}

export default new InvoiceService();
