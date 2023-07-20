let newInvoice = { items: [
    
]
}
/* Imprimimos pedidos y agregamos pedidos. Falta la funcion de agregar Items*/

document.addEventListener('DOMContentLoaded', consultarPedidos);

function consultarPedidos() {
    const url = 'http://localhost:4000/invoices';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPedidos(resultado))
        .catch(error => console.log(error));
}

function consultarClientes() {
    const url = 'http://localhost:4000/clients';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPedidos(resultado))
        .catch(error => console.log(error));
}

function consultarClientesID(id) {
    const url = `http://localhost:4000/clients/${id}`;

    return fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => resultado)
        .catch(error => console.log(error));
}

async function mostrarPedidos(invoices) {
    const contenido = document.querySelector('#pedidos');

    const promises = invoices.map(invoice => {
        const div = document.createElement('div');
        div.classList.add("invoice");

        const orderNumber = document.createElement('p');
        orderNumber.classList.add("order-number");
        orderNumber.textContent = "#" + invoice.id;

        const clientName = document.createElement('p');
        clientName.classList.add("client-name");

        const invoiceAddress = document.createElement('p');
        invoiceAddress.classList.add("invoice-address");
        invoiceAddress.textContent = invoice.delivery_address;

        let totalSum = 0;
        invoice.items.forEach(item => {
            const itemTotal = item.quantity * item.period_price;
            totalSum += itemTotal;
        });

        const invoiceTotal = document.createElement('p');
        invoiceTotal.classList.add("invoice-total");
        invoiceTotal.textContent = "$" + parseFloat(totalSum.toFixed(2));

        const infoPedidoBtn = document.createElement('BUTTON')
        infoPedidoBtn.classList.add('status-button')
        infoPedidoBtn.textContent = "Status"

        // Utilizar consultarClientesID para obtener el nombre del cliente y asignarlo a clientName
        return consultarClientesID(invoice.clientId)
            .then(client => {
                clientName.textContent = client.name;
                div.appendChild(orderNumber);
                div.appendChild(clientName);
                div.appendChild(invoiceAddress);
                div.appendChild(invoiceTotal);
                div.appendChild(infoPedidoBtn)
                contenido.appendChild(div);
            });
    });

    // Esperar a que todas las promesas se resuelvan antes de continuar
    await Promise.all(promises);
}

const guardarPedidoBtn = document.getElementById('guardar-pedido');

guardarPedidoBtn.addEventListener('click', guardarPedido);

function guardarPedido() {
    const nuevoId = generarIdUnico();
    const clientId = document.getElementById('invoice-client').value;
    const date = document.getElementById('InvoiceDate').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;

    if( newInvoice.id === "" || newInvoice.clientId === "" || newInvoice.date === "" || newInvoice.deliveryAddress === "") {
        return
    }

    newInvoice.id = nuevoId;
    newInvoice.clientId = clientId;
    newInvoice.date = date;
    newInvoice.delivery_address = deliveryAddress;


    const url = 'http://localhost:4000/invoices';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newInvoice)
    })
        .then(response => response.json())
        .then(result => {
            console.log('El post ha sido creado:', result);
            newInvoice = {
                items : [

                ]
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    const modal = document.getElementById('newInvoiceModal');
    const modalBootstrap = bootstrap.Modal.getInstance(modal);
    modalBootstrap.hide();
}

const addItem = document.getElementById('save-item-invoice')
addItem.addEventListener('click', guardarItemPedido)

function guardarItemPedido() {

    const itemInput = document.getElementById('item-input').value
    const itemNumber = document.getElementById('item-number').value
    const itemDate = document.getElementById('date-item').value
    
    if (itemInput === "" || itemNumber === "" || itemDate === ""){
        return alert("Completa todos los campos")
        
    }

    const nuevoItem = {
        "id": itemInput === "Obrador" ? 1 : 2,
        "name": itemInput,
        "item_number": itemNumber,
        "quantity": 1,
        "period_price": itemInput === "Volquete" ? 10000 : 15000,
        "start_date": itemDate
    }

    newInvoice.items.push(nuevoItem)
}



function generarIdUnico() {
    const max = 9999;
    const min = 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const dataList = document.getElementById('client-list-options');

fetch('http://localhost:4000/clients')
    .then(response => response.json())
    .then(data => {
        data.forEach(cliente => {
            const option = document.createElement('option');
            option.text = cliente.name;
            option.value = cliente.id;
            dataList.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error al obtener los datos de los clientes:', error);
    });


/* Rediccionamos a clientes.html si tocan en el modal nuevo cliente */



// Función para redireccionar al hacer clic en el botón
function redireccionarAlSitio() {
    const url = '../pages/clients.html'; // Reemplaza con la URL a la que quieres redireccionar

    // Redireccionar al sitio
    window.location.href = url;
}

// Agregar un evento clic al botón que llame a la función de redireccionamiento
const miBoton = document.getElementById('new-client-href');
miBoton.addEventListener('click', redireccionarAlSitio)