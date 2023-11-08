import { API_URL } from "../config/const.js"
import { mostrarAlerta } from "../utils/alert.js"

const INVOICE_URL = `${API_URL}/invoices`;

export const getInvoices = () => {
  return fetch(INVOICE_URL)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export const getInvoice = (id) => {
  return fetch(`${INVOICE_URL}/${id}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export const getInvoicesByClient = (id) => {
  return fetch(`${INVOICE_URL}?clientId=${id}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export const createInvoice = (data) => {
  return fetch(INVOICE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .catch((error) => {
      mostrarAlerta('error', 'No se pudo crear el pedido');
      throw error;
    });
}

export const updateInvoice = (id, data) => {
  return fetch(`${INVOICE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .catch((error) => {
      mostrarAlerta('error', 'No se pudo actualizar el pedido');
      throw error;
    });
}

export const deleteInvoice = (id) => {
  return fetch(`${INVOICE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((response) => response.json())
    .catch((error) => {
      mostrarAlerta('error', 'No se pudo borrar el producto');
      throw error;
    });
}