

import { createInvoice, getInvoice,getInvoicesByClient, getInvoices,archiveInvoice } from "./services/invoices.js";
import { getProducts } from "./services/product.js";
import { createPayment } from "./services/payments.js";
import { calcPeriods, calcPeriodsPrices } from "./utils/product.js";
import { getActualDate } from "./utils/date.js";



async function exportarPDF(datos) {
    try {
        const pdf = new jsPDF();
        let plantillaHTML = `
            <h1>Información del Usuario</h1>
            <p><strong>Nombre del cliente:</strong> ${datos[0].client.name}</p>
        `;

        let plantillaPedidoHTML = `
            <h1>Información de los Pedidos</h1>
        `;

        // Filtrar los pedidos con isArchived: false
        const pedidosNoArchivados = datos.filter(pedido => !pedido.isArchived);

        // Agregar información de pedidos no archivados a la plantilla
        pedidosNoArchivados.forEach(pedido => {
            plantillaPedidoHTML += `
                <p><strong>Dirección del pedido:</strong> ${pedido.address}</p>
            `;
        });

        plantillaHTML += plantillaPedidoHTML;

        pdf.fromHTML(plantillaHTML, 15, 15);
        pdf.output('save', 'filename.pdf');
    } catch (error) {
        console.error('Error al exportar a PDF:', error);
    }
}




const imprimirResumen = document.getElementById('nuevo-pdf');

imprimirResumen.addEventListener('click', async () => {
    try {
        const numeroCliente = document.getElementById('numberId').value;

        if (!numeroCliente) {
            console.log('Ingresa un número de cliente válido.');
            return;
        }

        console.log('Número de Pedido:', numeroCliente);

        const { data: pedidosCliente } = await getInvoicesByClient(numeroCliente.toString());

        if (pedidosCliente && pedidosCliente.length > 0) {
            console.log('Datos de la factura:', pedidosCliente);

            await exportarPDF(pedidosCliente);
        } else {
            console.log('No se encontraron facturas para el cliente con el número:', numeroCliente);
        }
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
    }
});
