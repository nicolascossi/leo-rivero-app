import { API_URL } from "../config/const.js"
import { mostrarAlerta } from "../utils/alert.js"

const PAYMENTS_URL = `${API_URL}/payments`;

export const createPayment = (data) => {
    return fetch(PAYMENTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .catch((error) => {
        mostrarAlerta('error', 'No se pudo agregar el pago');
        throw error;
      });
  }