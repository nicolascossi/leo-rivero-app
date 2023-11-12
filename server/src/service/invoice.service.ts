import InvoiceDTO from "@model/dto/invoice";
import InvoiceModel, { InvoiceStatus } from "@model/mongodb/schema/invoice";
import type { Invoice } from "@model/mongodb/schema/invoice";
import createHttpError from "http-errors";
import { cleanUndefinedValues } from "utils/validations";

class InvoiceService {
  async getAll (
    query: {
      status?: InvoiceStatus | "archived"
      client?: string
    },
    options?: {
      orderItemId?: string
      clientName?: string
      address?: string
    }
  ): Promise<InvoiceDTO[]> {
    // console.log(query.status === "archived");
    const status = query.status === undefined
      ? {}
      : query.status === "archived"
        ? { isArchived: true }
        : { status: query.status, isArchived: false };
    const addressFilter = { ...(options?.address !== undefined ? { address: new RegExp(options?.address, "ig") } : {}) };
    const invoices = await InvoiceModel.find(cleanUndefinedValues({ ...{ client: query.client }, ...status, ...addressFilter }), { __v: 0 })
      .populate("client")
      .populate({
        path: "products",
        populate: [
          {
            path: "price"
          },
          {
            path: "product"
          },
          {
            path: "payments"
          }
        ]
      });

    if (options?.orderItemId !== undefined) {
      return invoices
        .filter((invoice) => {
          return invoice.products?.some((invoiceProduct) => invoiceProduct._id === Number(options.orderItemId));
        })
        .map((invoice) => new InvoiceDTO(invoice));
    }

    if (options?.clientName !== undefined) {
      return invoices
        .filter((invoice) => {
          const regex = new RegExp((options.clientName as string), "ig");
          return typeof invoice.client !== "number" && regex.test(invoice.client.name);
        })
        .map((invoice) => new InvoiceDTO(invoice));
    }

    return invoices
      .map((invoice) => new InvoiceDTO(invoice));
  }

  async getById (id: string): Promise<InvoiceDTO | null> {
    const invoice = await InvoiceModel.findById({ _id: id }, { __v: 0 })
      .populate("client")
      .populate({
        path: "products",
        populate: [
          {
            path: "price"
          },
          {
            path: "product"
          },
          {
            path: "payments"
          }
        ]
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
      address,
      status,
      isArchived
    }: Partial<Pick<Invoice, "IVA" | "address" | "status" | "isArchived" >>
  ): Promise<InvoiceDTO | null> {
    const updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { _id: id },
      {
        IVA,
        address,
        status,
        isArchived
      },
      {
        new: true
      }
    );
    return updatedInvoice !== null ? new InvoiceDTO(updatedInvoice) : null;
  }

  async delete (id: string): Promise<void> {
    const invoice = await InvoiceModel.findById({ _id: id });

    if (invoice === null) {
      throw createHttpError.NotFound("Invoice not founded");
    }

    if (invoice.status === InvoiceStatus.completed) {
      throw createHttpError["422"]("Can't delete a completed Invoice");
    }

    await InvoiceModel.deleteOne({ _id: id });
  }

  async archive (id: string): Promise<void> {
    await this.update(id, { isArchived: true });
  }
}

export default new InvoiceService();
