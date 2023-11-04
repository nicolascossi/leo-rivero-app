import ClientDTO from "@model/dto/client";
import ClientModel from "@model/mongodb/schema/client";
import type { Client } from "@model/mongodb/schema/client";

class ClientService {
  async getAll (): Promise<ClientDTO[]> {
    const clients = await ClientModel.find({}, { __v: 0 });

    return clients.map((client) => new ClientDTO(client));
  }

  async getById (id: string): Promise<ClientDTO | null> {
    const client = await ClientModel.findById({ _id: id }, { __v: 0 });
    return client !== null ? new ClientDTO(client) : null;
  }

  async create ({ name, email, CUIT, phone, address, note }: Client): Promise<Client> {
    const client = new ClientModel({
      name,
      email,
      CUIT,
      phone,
      address,
      note
    });
    const newClient = await client.save();

    return new ClientDTO(newClient);
  }

  async update (
    id: string,
    {
      name,
      email,
      CUIT,
      phone,
      address,
      note
    }: Client
  ): Promise<ClientDTO | null> {
    const updatedClient = await ClientModel.findByIdAndUpdate(
      { _id: id },
      {
        name,
        email,
        CUIT,
        phone,
        address,
        note
      },
      { new: true }
    );

    return updatedClient !== null ? new ClientDTO(updatedClient) : null;
  }

  async delete (id: string): Promise<void> {
    await ClientModel.findByIdAndDelete({ _id: id });
  }
}

export default new ClientService();
