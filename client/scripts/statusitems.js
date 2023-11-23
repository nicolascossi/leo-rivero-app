// Importa la función getInvoiceProducts desde tu archivo
import { getInvoiceProducts } from "./services/invoice-products.js";
import { getClient } from "./services/client.js"

const obtenerBoton = document.getElementById('obtener-ubicacion');
obtenerBoton.addEventListener('click', mostrarObjetosSinRetirementDate);

// Define la función para mostrar objetos sin retirementDate
async function mostrarObjetosSinRetirementDate() {
    try {
        // Obtén los datos usando la función importada
        const apiResponse = await getInvoiceProducts();

        // Verificar si apiResponse es un objeto con la propiedad "data" que es un array
        if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
            console.error("La respuesta de la API no tiene la estructura esperada:", apiResponse);
            return;
        }

        // Obtener los IDs de los clientes únicos
        const clienteIds = new Set(apiResponse.data.map(objeto => objeto.invoice.client));

        // Obtener la información de todos los clientes en un solo fetch
        const clientes = await Promise.all(Array.from(clienteIds).map(clientId => getClient(clientId)));

        // Crear un mapa para mapear el ID del cliente a la información del cliente
        const clientesMap = new Map(clientes.map(cliente => [cliente.data.id, cliente.data]));

        // Obtener el elemento en el DOM donde se mostrará la información
        const outputElement = document.getElementById("ubicaciones");

        // Limpiar el contenido anterior
        outputElement.innerHTML = "";

        // Generar el contenido HTML dinámicamente
        for (const objeto of apiResponse.data) {
            const div = document.createElement("div");
            div.classList.add('lista-ubicaciones');

            // Obtener la información del cliente usando el mapa
            const cliente = clientesMap.get(objeto.invoice.client);

            div.innerHTML = `
            <div class="segunda"><p class="text-start">${objeto.product.name} #${objeto.numberId}</p></div>
            <div class="primera"><p class="text-center">${cliente ? cliente.name : "Nombre no disponible"}</p></div>
            <div class="segunda"><p class="text-center">${objeto.invoice.address}</p></div>
            <div class="tercera"><p class="text-end">${new Date(objeto.deliveryDate).toLocaleDateString()}</p></div>
                
                
                
                <!-- Agrega más propiedades según tus necesidades -->
            `;

            outputElement.appendChild(div);
        }
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);
    }
}
