import PaymentDTO from "@model/dto/payment";
import PaymentModel from "@model/mongodb/schema/payment";
import type { Payment, PaymentsMethods } from "@model/mongodb/schema/payment";
import createHttpError from "http-errors";
import { cleanUndefinedValues } from "utils/validations";

class PaymentService {
  async getAll (
    query: {
      method?: PaymentsMethods
      invoiceProduct?: string
    }
  ): Promise<PaymentDTO[]> {
    const payments = await PaymentModel.find(cleanUndefinedValues(query), { __v: 0 })
      .populate({ path: "invoiceProduct", select: "-__v" });
    return payments.map((payment) => new PaymentDTO(payment));
  }

  async getById (id: string): Promise<PaymentDTO | null> {
    const payment = await PaymentModel.findById({ _id: id }, { __v: 0 })
      .populate({ path: "invoiceProduct", select: "-__v" });

    return payment !== null ? new PaymentDTO(payment) : null;
  }

  async create ({
    invoiceProduct,
    method,
    note,
    paymentDate,
    value
  }: Payment): Promise<PaymentDTO> {
    const payment = new PaymentModel({
      invoiceProduct,
      method,
      note,
      paymentDate,
      value
    });

    const newPayment = await payment.save();

    return new PaymentDTO(newPayment);
  }

  async update (
    id: string,
    {
      note
    }: Pick<Payment, "note">
  ): Promise<PaymentDTO | null> {
    const updatedPayment = await PaymentModel.findByIdAndUpdate(
      { _id: id },
      {
        note
      },
      { new: true }
    );
    return updatedPayment !== null ? new PaymentDTO(updatedPayment) : null;
  }

  async delete (id: string): Promise<void> {
    const payment = await PaymentModel.findById({ id });

    if (payment === null) {
      throw createHttpError.NotFound("Payment not founded");
    }

    await PaymentModel.findByIdAndDelete({ _id: id });
  }
}

export default new PaymentService();
