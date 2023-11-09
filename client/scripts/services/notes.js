import { API_URL } from "../config/const.js"
import { mostrarAlerta } from "../utils/alert.js"

const NOTES_URL = `${API_URL}/notes`;

export const getNotes = () => {
    return fetch(NOTES_URL)
        .then((response) => response.json())
        .catch((error) => {
            console.error(error);
            throw error;
        });
}

export const createNote = (data) => {
    return fetch(NOTES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .catch((error) => {
            mostrarAlerta('error', 'No se pudo crear la nota');
            throw error;
        });
}

export const deleteNote = (id) => {
    return fetch(`${NOTES_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .catch((error) => {
            mostrarAlerta('error', 'No se pudo borrar la nota');
            throw error;
        });
}