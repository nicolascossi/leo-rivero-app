import type { Client } from "@model/mongodb/schema/client";
import type { MongooseDTO, MongooseIdSchema } from "@model/mongodb/types/schema";

class ClientDTO implements MongooseDTO<Client> {
  CUIT?: string;
  address?: string;
  email?: string;
  id: number;
  name: string;
  note?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;

  constructor (client: MongooseIdSchema<Client>) {
    console.log(client);
    this.id = client._id;
    this.CUIT = client.CUIT;
    this.address = client.address;
    this.email = client.email;
    this.name = client.name;
    this.note = client.note;
    this.phone = client.phone;
    this.createdAt = client.createdAt;
    this.updatedAt = client.updatedAt;
  }
}

export default ClientDTO;
