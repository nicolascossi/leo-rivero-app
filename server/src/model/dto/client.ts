import type { Client } from "@model/mongodb/schema/client";
import type { MongooseDTO, MongooseIdSchema } from "@model/mongodb/types/schema";

class ClientDTO implements MongooseDTO<Client> {
  CUIT: string;
  city?: string;
  postalCode?: number;
  email: string;
  id: number;
  name: string;
  note?: string;
  phone: string;

  constructor (client: MongooseIdSchema<Client>) {
    this.id = client._id;
    this.CUIT = client.CUIT;
    this.city = client.city;
    this.postalCode = client.postalCode;
    this.email = client.email;
    this.name = client.name;
    this.note = client.note;
    this.phone = client.phone;
  }
}

export default ClientDTO;
