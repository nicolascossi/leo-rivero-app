import { API_URL } from "../config/const.js"
import { mostrarAlerta } from "../utils/alert.js"

const CLIENT_URL = `${API_URL}/clients`;

export const getClients = () => {
  return fetch(CLIENT_URL)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export const getClient = (id) => {
  return fetch(`${CLIENT_URL}/${id}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export const createClient = (data) => {
  return fetch(CLIENT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .catch((error) => {
      mostrarAlerta('error', 'No se pudo crear el cliente');
      throw error;
    });
}

export const updateClient = (id, data) => {
  return fetch(`${CLIENT_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .catch((error) => {
      mostrarAlerta('error', 'No se pudo actualizar el cliente');
      throw error;
    });
}

export const deleteClient = (id) => {
  return fetch(`${CLIENT_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    } 
  })
    .catch((error) => {
      mostrarAlerta('error', 'No se pudo borrar el cliente');
      throw error;
    });
}