// pdfUtils.js
// pdfUtils.js
import jsPDF from '../../../server/node_modules/pdfjs'; // o la ruta correcta a tu archivo jsPDF


export async function exportarPDF(datos) {
    try {
        const pdf = new jsPDF();
        const plantillaHTML = `
            <h1>Información del Usuario</h1>
            <p><strong>Nombre:</strong> ${datos.nombre}</p>
            <p><strong>Edad:</strong> ${datos.edad}</p>
            <p><strong>Ciudad:</strong> ${datos.ciudad}</p>
        `;

        pdf.fromHTML(plantillaHTML, 15, 15);
        pdf.output('dataurlnewwindow');
    } catch (error) {
        console.error('Error al exportar a PDF:', error);
    }
}
