

import { createInvoice, getInvoice,getInvoicesByClient, getInvoices,archiveInvoice } from "./services/invoices.js";
import { getProducts } from "./services/product.js";
import { createPayment } from "./services/payments.js";
import { calcPeriods, calcPeriodsPrices } from "./utils/product.js";
import { getActualDate } from "./utils/date.js";



export async function exportarPDF(datos) {
    try {
        const pdf = new jsPDF();
        let plantillaHTML = `
            <h1>Información del Usuario</h1>
            <p><strong>Nombre del cliente:</strong> ${datos.client.name}</p>
            <p><strong>Direccion del pedido:</strong> ${datos.address}</p>
            <p><strong>Numero de pedido:</strong> ${datos.id}</p>

            
        `;
        let rows = "";

        datos.products.forEach((item) => {
            const totalPeriods =
              item.manualPeriod ??
              calcPeriods(
                new Date(item.deliveryDate),
                item.retirementDate,
                item.period
              );
              console.log(totalPeriods);
            const periodsByPrices = calcPeriodsPrices(
              item.period,
              totalPeriods,
              item.deliveryDate,
              item.price
            );
            const subtotal = Object.values(periodsByPrices).reduce(
              (total, { price }) => total + price,
              0
            );
            
            const total = subtotal
            
            
            rows += `
            <div class="parent-items-row">
              <p class="text-start">${item.product.name} #${item.numberId}</p>
              <p class="text-start">${subtotal}</p>
              <p class="text-center">${new Date(
                item.deliveryDate
              ).toLocaleDateString()}</p>
              <p class="text-center">${
                item.retirementDate
                  ? new Date(item.retirementDate).toLocaleDateString()
                  : "No se retiró"
              }</p>
              <p class="text-center">${totalPeriods}</p>
              <p class="text-center">$${periodsByPrices[totalPeriods].price}</p>
              <p class="text-end">$${total}</p>
            </div>
            `;
          });

          plantillaHTML += rows
      

        pdf.fromHTML(plantillaHTML, 15, 15);
        pdf.output('save', 'filename.pdf')
    } catch (error) {
        console.error('Error al exportar a PDF:', error);
    }
}


const imprimirResumen = document.getElementById('nuevo-pdf');

imprimirResumen.addEventListener('click', async () => {
    try {
        const numeroPedido = document.getElementById('numberId').value;
        console.log('Número de Pedido:', numeroPedido);

        const { data: invoiceData } = await getInvoice(numeroPedido);

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
