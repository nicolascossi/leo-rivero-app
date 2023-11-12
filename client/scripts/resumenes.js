// Importa las funciones necesarias de tus servicios y utilidades
import { getInvoice } from "./services/invoices.js";
import { exportarPDF } from "./utils/pdfUtils.js"; // Asegúrate de tener un archivo que exporte la función exportarPDF

// Otros imports necesarios

const imprimirResumen = document.getElementById('nuevo-pdf');

imprimirResumen.addEventListener('click', async () => {
    try {
        const numeroPedido = document.getElementById('numberId').value;
        console.log('Número de Pedido:', numeroPedido);

        const invoiceData = await getInvoice(numeroPedido);

        if (invoiceData) {
            console.log('Data de la factura:', invoiceData);

            await exportarPDF(invoiceData);
        } else {
            console.log('No se encontró la factura con el número de pedido especificado.');
        }
    } catch (error) {
        console.error('Error al obtener la factura:', error);
    }
});
