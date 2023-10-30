// mostrarAlerta('success', '¡Operación exitosa!');
// mostrarAlerta('danger', '¡Error! Algo salió mal.');
// mostrarAlerta('info', 'Información importante.');

const url = 'http://localhost:4000/';

let newInvoice = {
  items: []
};

document.addEventListener('DOMContentLoaded', () => {
  consultarResolucion();
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

function mostrarAlerta(tipo, mensaje) {
  const alertaDiv = document.createElement('div');
  alertaDiv.classList.add('alert', `alert-${tipo}`);
  alertaDiv.textContent = mensaje;
  const alertContainer = document.getElementById('alert-container');
  alertContainer.appendChild(alertaDiv);

  setTimeout(() => {
    alertContainer.removeChild(alertaDiv);
  }, 3000);
}

function consultarResolucion() {
  if (screen.width < 1024)
    location.href = "../pages/no-support.html";
}

function consultarPedidos() {
  const urlApi = `${url}invoices`;

  fetch(urlApi)
    .then(respuesta => respuesta.json())
    .then(resultado => mostrarPedidos(resultado))
    .catch(error => console.log(error));
}

function consultarClientes() {
  const urlApi = `${url}clients`;

  fetch(urlApi)
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

function eliminarItemPedido(nuevoItem) {
  const index = newInvoice.items.indexOf(nuevoItem);
  if (index !== -1) {
    newInvoice.items.splice(index, 1);
  }

  mostrarAlerta('success', '¡Item eliminado!');
}

function consultarClientesID(id) {
  const urlApi = `${url}clients/${id}`;

  return fetch(urlApi)
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

  const listaItems = document.getElementById('lista-items');
  const itemAdded = itemInput + ` #${itemNumber}`;

  if (itemInput === "" || itemNumber === "" || itemDate === "") {
    mostrarAlerta('danger', '¡Completa todos los campos.');
    return;
  }

  const nuevoItem = {
    "id": itemInput === "Obrador" ? 1 : 2,
    "name": itemInput,
    "item_number": itemNumber,
    "delivery_date": itemDate,
    "charged_amount": 0,
    "total_periods": 0,
    "total_cost": 0,
    "period_price": itemInput === "Obrador" ? 15000 : 10000,
    "period_days": itemInput === "Obrador" ? 15 : 7,
    "quantity": 1
  };

  nuevoItem.total_cost = (nuevoItem.period_price * nuevoItem.total_periods) - nuevoItem.charged_amount;

  newInvoice.items.push(nuevoItem);

  const div = document.createElement('div');
  div.classList.add('item-added');

  const deleteItemBtn = document.createElement('button');
  deleteItemBtn.classList.add('buttonModalNewInvoice');
  deleteItemBtn.textContent = "X";
  deleteItemBtn.addEventListener('click', () => {
    eliminarItemPedido(nuevoItem);
    listaItems.removeChild(div);
  });

  const itemType = document.createElement('p');
  itemType.textContent = itemAdded;

  const dateItem = document.createElement('p');
  dateItem.textContent = itemDate;

  div.appendChild(itemType);
  div.appendChild(dateItem);
  div.appendChild(deleteItemBtn);
  listaItems.appendChild(div);

  const itemInputD = document.getElementById('item-input');
  const itemNumberD = document.getElementById('item-number');
  const itemDateD = document.getElementById('date-item');

  itemInputD.value = "";
  itemNumberD.value = "";
  itemDateD.value = "";

  mostrarAlerta('success', '¡Nuevo Item Agregado!');
}

const guardarPedidoBtn = document.getElementById('guardar-pedido');
guardarPedidoBtn.addEventListener('click', guardarPedido);

function guardarPedido() {
  const nuevoId = generarIdUnico();
  const clientId = document.getElementById('invoice-client').value;
  const date = document.getElementById('InvoiceDate').value;
  const deliveryAddress = document.getElementById('deliveryAddress').value;
  const iva = document.getElementById('iva').value;

  if (nuevoId === "" || clientId === "" || date === "" || deliveryAddress === "") {
    return;
  }

  newInvoice.id = nuevoId;
  newInvoice.clientId = clientId;
  newInvoice.date = date;
  newInvoice.delivery_address = deliveryAddress;
  newInvoice.iva = iva;
  newInvoice.city = "Bahia Blanca";
  newInvoice.postalCode = 8000;

  const urlApi = `${url}invoices`;

  fetch(urlApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newInvoice)
  })
    .then(response => response.json())
    .then(result => {
      mostrarAlerta('success', '¡Pedido Guardado!');
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

  if (!orderId) {
    console.error('No se pudo obtener el ID del pedido');
    return;
  }

  const urlApi = `${url}invoices/${orderId}`;

  fetch(urlApi)
    .then(respuesta => respuesta.json())
    .then(pedido => {
      document.getElementById('id').textContent = `#${pedido.id}`;
      document.getElementById('delivery_address').textContent = pedido.delivery_address;
      document.getElementById('date').textContent = pedido.date;

      const finalizarPedidoBtn = document.querySelector('#finalizar-pedido');
      finalizarPedidoBtn.dataset.pedidoId = pedido.id;

      const editarPedidoBtn = document.querySelector('#editar-pedido');
      editarPedidoBtn.dataset.pedidoId = pedido.id;

      consultarClientesID(pedido.clientId)
        .then(cliente => {
          document.getElementById('client-name').textContent = cliente.name;
          document.getElementById('client-phone').textContent = cliente.phone;
          document.getElementById('client-email').textContent = cliente.email;
        })
        .catch(error => {
          console.error('Error al obtener los datos del cliente:', error);
        });

      let totalSum = 0;
      let itemNamesAndNumbers = '';
      let totalPeriods = '';
      let periodPrices = '';
      let itemTotals = '';

      pedido.items.forEach(item => {
        totalSum += item.total;

        itemNamesAndNumbers += `<p>${item.name} #${item.item_number}</p>`;
        totalPeriods += `<p>${item.total_periods}</p>`;
        periodPrices += `<p>$${item.period_price}</p>`;
        itemTotals += `<p>$${item.total}</p>`;
      });

      document.getElementById('itemnameandnumber').innerHTML = itemNamesAndNumbers;
      document.getElementById('total_periods').innerHTML = totalPeriods;
      document.getElementById('period_price').innerHTML = periodPrices;
      document.getElementById('total').innerHTML = itemTotals;
      document.getElementById('invoiceTotal').textContent = `$${totalSum}`;

      const modal = document.getElementById('invoiceResumeModal');
      const modalBootstrap = new bootstrap.Modal(modal);
      modalBootstrap.show();
    })
    .catch(error => console.error('Error al obtener los datos de la factura:', error));
}

const finalizarPedidoBtn = document.querySelector('#finalizar-pedido');
finalizarPedidoBtn.addEventListener('click', finalizarPedido);

function finalizarPedido(event) {
  const pedidoId = event.target.dataset.pedidoId;

  const confirmar = confirm('¿Deseas archivar/eliminar este pedido?');
  if (confirmar) {
    eliminarPedido(pedidoId);
  }
}

function eliminarPedido(id) {
  try {
    fetch(`${url}invoices/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log(`Pedido con ID ${id} eliminado correctamente.`);
        } else {
          console.error(`Error al eliminar el pedido con ID ${id}.`);
        }
      })
      .catch(error => {
        console.error('Error al eliminar el pedido:', error);
      });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
  }
}

// EDITAR PEDIDO
const botonEditarCliente = document.querySelector('#editar-cliente-modal');
botonEditarCliente.addEventListener('click', editarCliente);

function editarCliente(event) {
  const clienteId = event.target.dataset.clientId;

  const resumeClientModal = document.getElementById('resumeClientModal');
  resumeClientModal.classList.remove('show');

  const editingClientModal = document.getElementById('editingClientModal');

  editingClientModal.addEventListener('shown.bs.modal', function () {
    editingClientModal.classList.add('show');
  });

  const editingClientModalInstance = new bootstrap.Modal(editingClientModal);
  editingClientModalInstance.show();

  const urlApi = `${url}clients`;

  fetch(`${urlApi}/${clienteId}`)
    .then(response => response.json())
    .then(data => {
      const nombreInput = document.querySelector('#client-name');
      const phoneInput = document.querySelector('#client-phone');
      const cuitInput = document.querySelector('#client-cuit');
      const emailInput = document.querySelector('#client-email');
      const adressInput = document.querySelector('#client-adress');
      const extrasInput = document.querySelector('#client-extras');

      nombreInput.value = data.name;
      phoneInput.value = data.phone;
      cuitInput.value = data.CUIT;
      emailInput.value = data.email;
      adressInput.value = data.address;
      extrasInput.value = data.extras;

      const modal = document.getElementById('editingClientModal');
      const modalBootstrap = new bootstrap.Modal(modal);
      modalBootstrap.hide();

      const patchClientButton = document.getElementById('patch-client-button');
      patchClientButton.dataset.clientId = clienteId;
      patchClientButton.addEventListener('click', actualizarCliente);
    })
    .catch(error => {
      console.error('Error al obtener los datos del cliente:', error);
    });
}
