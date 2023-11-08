import { API_URL } from "../config/const.js"
import { mostrarAlerta } from "../utils/alert.js"

const PRODUCT_URL = `${API_URL}/products`;

export const getProducts = () => {
  return fetch(PRODUCT_URL)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export const getProduct = (id) => {
  return fetch(`${PRODUCT_URL}/${id}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export const createProduct = (data) => {
  return fetch(PRODUCT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .catch((error) => {
      mostrarAlerta('error', 'No se pudo crear el producto');
      throw error;
    });
}

export const updateProduct = (id, data) => {
  return fetch(`${PRODUCT_URL}/${id}`, {
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

export const deleteProduct = (id) => {
  return fetch(`${PRODUCT_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    } 
  })
    .catch((error) => {
      mostrarAlerta('error', 'No se pudo borrar el producto');
      throw error;
    });
}