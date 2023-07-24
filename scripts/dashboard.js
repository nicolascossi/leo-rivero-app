// dashboard.js
let newInvoice = {
  items: []
};

document.addEventListener('DOMContentLoaded', () => {
  consultarClientes();
  consultarPedidos();

  // Delegación de eventos para abrir el modal al hacer clic en el botón de "Status"
  document.addEventListener('click', (event) => {
    if (event.target.matches('.status-button')) {
      const orderId = event.target.dataset.invoiceId;
      obtenerInformacionFactura(orderId);
    }
  });
});

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
    .then(data => {
      if (Array.isArray(data)) {
        const dataList = document.getElementById('client-list-options');
        data.forEach(cliente => {
          const option = document.createElement('option');
          option.text = cliente.name;
          option.value = cliente.id;
          dataList.appendChild(option);
        });
      } else {
        console.error('Los datos de los clientes no son un array:', data);
      }
    })
    .catch(error => {
      console.error('Error al obtener los datos de los clientes:', error);
    });
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
    div.classList.add('invoice');

    const orderNumber = document.createElement('p');
    orderNumber.classList.add('order-number');
    orderNumber.textContent = '#' + invoice.id;

    const clientName = document.createElement('p');
    clientName.classList.add('client-name');

    const invoiceAddress = document.createElement('p');
    invoiceAddress.classList.add('invoice-address');
    invoiceAddress.textContent = invoice.delivery_address;

    let totalSum = 0;
    const checkboxIVA = document.getElementById('iva');
    const ivaPercentage = 0.21; // El porcentaje de IVA es 21%

    invoice.items.forEach(item => {
      const itemTotal = item.total_periods * item.period_price;
      totalSum += itemTotal;
    });

    if (checkboxIVA.checked) {
      const ivaAmount = totalSum * ivaPercentage;
      totalSum += ivaAmount;
    }

    const invoiceTotal = document.createElement('p');
    invoiceTotal.classList.add('invoice-total');
    invoiceTotal.textContent = '$' + parseFloat(totalSum.toFixed(2));

    const infoPedidoBtn = document.createElement('button');
    infoPedidoBtn.classList.add('status-button');
    infoPedidoBtn.setAttribute('data-invoice-id', invoice.id);
    infoPedidoBtn.textContent = 'Status';

    return consultarClientesID(invoice.clientId)
      .then(client => {
        clientName.textContent = client.name;
        div.appendChild(orderNumber);
        div.appendChild(clientName);
        div.appendChild(invoiceAddress);
        div.appendChild(invoiceTotal);
        div.appendChild(infoPedidoBtn);
        contenido.appendChild(div);

        return infoPedidoBtn;
      });
  });

  const buttons = await Promise.all(promises);
  buttons.forEach(button => {
    button.addEventListener('click', obtenerInformacionFactura);
  });
}

function redireccionarAlSitio() {
  const url = '../pages/clients.html';
  window.location.href = url;
}

const miBoton = document.getElementById('new-client-href');
miBoton.addEventListener('click', redireccionarAlSitio);

const addItem = document.getElementById('save-item-invoice');
addItem.addEventListener('click', guardarItemPedido);

function guardarItemPedido() {
  const itemInput = document.getElementById('item-input').value;
  const itemNumber = document.getElementById('item-number').value;
  const itemDate = document.getElementById('date-item').value;

  if (itemInput === "" || itemNumber === "" || itemDate === "") {
    return alert("Completa todos los campos");
  }

  const nuevoItem = {
    "id": itemInput === "Obrador" ? 1 : 2,
    "name": itemInput,
    "item_number": itemNumber,
    "delivery_date": itemDate,
    "withdraw_date": 0,
    "total_periods": 0,
    "period_price": itemInput === "Obrador" ? 15000 : 10000,
  };

  newInvoice.items.push(nuevoItem);
  console.log("Nuevo item agregado:", nuevoItem);
}

const guardarPedidoBtn = document.getElementById('guardar-pedido');
guardarPedidoBtn.addEventListener('click', guardarPedido);

function guardarPedido() {
  const nuevoId = generarIdUnico();
  const clientId = document.getElementById('invoice-client').value;
  const date = document.getElementById('InvoiceDate').value;
  const deliveryAddress = document.getElementById('deliveryAddress').value;
  const iva = document.getElementById('iva').value;

  if (newInvoice.id === "" || newInvoice.clientId === "" || date === "" || deliveryAddress === "") {
    return;
  }

  newInvoice.id = nuevoId;
  newInvoice.clientId = clientId;
  newInvoice.date = date;
  newInvoice.delivery_address = deliveryAddress;
  newInvoice.iva = iva;

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
        items: []
      };
    })
    .catch(error => {
      console.error('Error:', error);
    });

  const modal = document.getElementById('myModal');
  const modalBootstrap = new bootstrap.Modal(modal);
  modalBootstrap.hide();
}

function generarIdUnico() {
  const max = 9999;
  const min = 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function obtenerInformacionFactura(event) {
  const orderId = event.target.dataset.invoiceId;
  const url = `http://localhost:4000/invoices/${orderId}`;

  fetch(url)
    .then(respuesta => respuesta.json())
    .then(pedido => {
      // Actualiza la información del modal con los datos obtenidos
      const modalContent = document.querySelector('.modal-content');
      const itemContainer = document.querySelector('.item-list');

      // Limpia la lista de items antes de agregar los nuevos
      itemContainer.innerHTML = '';

      // Recorre los items y agrega la información al modal
      pedido.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');

        const itemName = document.createElement('p');
        itemName.classList.add('item-name');
        itemName.textContent = item.name;
        itemElement.appendChild(itemName);

        const itemQuantity = document.createElement('p');
        itemQuantity.classList.add('item-quantity');
        itemQuantity.textContent = item.quantity;
        itemElement.appendChild(itemQuantity);

        const itemPeriods = document.createElement('p');
        itemPeriods.classList.add('item-periods');
        itemPeriods.textContent = item.periods;
        itemElement.appendChild(itemPeriods);

        const itemPrice = document.createElement('p');
        itemPrice.classList.add('item-price');
        itemPrice.textContent = `$${item.period_price}`;
        itemElement.appendChild(itemPrice);

        const itemTotal = document.createElement('p');
        itemTotal.classList.add('item-total');
        itemTotal.textContent = `$${item.total}`;
        itemElement.appendChild(itemTotal);

        itemContainer.appendChild(itemElement);
      });

      // Obtener información del cliente
      consultarClientesID(pedido.clientId)
        .then(cliente => {
          // Actualizar el contenido del modal con la información del cliente
          const modalClienteInfo = document.querySelector('.resume-info');
          modalClienteInfo.innerHTML = `
            <p><strong>Nombre del cliente:</strong> ${cliente.name}</p>
            <p><strong>Email:</strong> ${cliente.email}</p>
            <p><strong>Teléfono:</strong> ${cliente.phone}</p>
            <p><strong>Dirección:</strong> ${cliente.adress}</p>
          `;

          // Actualizar el encabezado del pedido con número de factura, dirección, etc.
          const modalResumeHeading = document.querySelector('.modal-resume-heading');
          modalResumeHeading.innerHTML = `
            <p><strong>Número de Factura:</strong> #${pedido.id}</p>
            <p><strong>Dirección de entrega:</strong> ${pedido.delivery_address}</p>
          `;

          // Actualizar el total confirmado
          const totalConfirmado = document.querySelector('.amount-due-resume');
          totalConfirmado.innerHTML = `<p>Total confirmado: $${pedido.totalConfirmado}</p>`;

          // Mostrar el modal después de obtener la información del cliente
          const modal = document.getElementById('invoiceResumeModal');
          const modalBootstrap = new bootstrap.Modal(modal);
          modalBootstrap.show();
        })
        .catch(error => console.error('Error al obtener los datos del cliente:', error));
    })
    .catch(error => console.error('Error al obtener los datos de la factura:', error));
}
