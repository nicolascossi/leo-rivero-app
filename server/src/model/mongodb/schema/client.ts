import { Schema, model } from "mongoose";
import { getCounter } from "./auto-increment";
import type { MongooseIdSchema } from "../types/schema";

export interface Client {
  name: string
  email?: string
  phone?: string
  address?: string
  CUIT?: string
  note?: string
  createdAt?: string
  updatedAt?: string
}

const clientSchema = new Schema<MongooseIdSchema<Client>>({
  _id: {
    type: Number
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  CUIT: {
    type: String,
    required: false
  },
  note: String
}, {
  _id: false,
  id: true,
  timestamps: true
});

clientSchema.pre("save", async function (next) {
  if (!this.isNew) return;
  this._id = await getCounter("client");
  next();
});

const ClientModel = model<MongooseIdSchema<Client>>("clients", clientSchema);

export default ClientModel;
