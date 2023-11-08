import { API_URL } from "../config/const.js"
import { mostrarAlerta } from "../utils/alert.js"

const INVOICE_URL = `${API_URL}/invoice-products`;

export const getInvoiceProducts = () => {
  return fetch(INVOICE_URL)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export const getInvoiceProduct = (id) => {
  return fetch(`${INVOICE_URL}/${id}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export const createInvoiceProduct = (data) => {
  return fetch(INVOICE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .catch((error) => {
      mostrarAlerta('error', 'No se pudo agregar el producto');
      throw error;
    });
}

export const updateInvoiceProduct = (id, data) => {
  return fetch(`${INVOICE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .catch((error) => {
      mostrarAlerta('error', 'No se pudo actualizar el producto');
      throw error;
    });
}

export const deleteInvoiceProduct = (id) => {
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
