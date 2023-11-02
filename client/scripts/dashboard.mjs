// mostrarAlerta('success', '¡Operación exitosa!');
// mostrarAlerta('danger', '¡Error! Algo salió mal.');
// mostrarAlerta('info', 'Información importante.');

import { createInvoice, getInvoice, getInvoices } from "./services/invoices.js";
import { getClient, getClients } from "./services/client.js";
import { mostrarAlerta } from "./utils/alert.js";
import { checkResoulution } from "./utils/resolution.js";
import { createInvoiceProduct } from "./services/invoice-products.js";
import { getProducts } from "./services/product.js"; 
import { createPayment } from "./services/payments.js"; 
import { calcPeriods } from "./utils/product.js";

let newInvoice = {
  items: []
};

document.addEventListener('DOMContentLoaded', () => {
  checkResoulution(1024, null, () => {
    location.href = "../pages/no-support.html";
  })
  mostrarPedidos();
  const nuevoPedido = document.getElementById("nuevo-pedido");
  nuevoPedido.addEventListener("click", async () => {
    // Fill Products Datalist
    const { data: products } = await getProducts();
    const itemlist = document.getElementById("item");
    itemlist.innerHTML = "";
    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.name;
      itemlist.appendChild(option);
    })
    const handleChangeItem = (e) => {
      const find = products.find((product) => product.name === e.currentTarget.value);
      if(!find) {
        return delete e.currentTarget.dataset.id;
      }
      e.currentTarget.dataset.id = find.id;
    }
    const itemInput = document.getElementById("item-input");
    itemInput.removeEventListener("change", handleChangeItem)
    itemInput.addEventListener("change", handleChangeItem)

    // Fill Clients Datalist
    const { data: clients } = await getClients();
    
    const clientlist = document.getElementById("client-list-options");
    clients.forEach((client) => {
      const option = document.createElement("option");
      option.value = client.name;
      clientlist.appendChild(option);
    })
    const handleChangeClient = (e) => {
      const find = clients.find((client) => client.name === e.currentTarget.value);
      if(!find) {
        return delete e.currentTarget.dataset.id;
      }
      e.currentTarget.dataset.id = find.id;
    }
    const clientInput = document.getElementById("invoice-client");
    clientInput.removeEventListener("change", handleChangeClient)
    clientInput.addEventListener("change", handleChangeClient)
  })

  // Delegación de eventos para abrir el modal al hacer clic en el botón de "Status"
  document.addEventListener('click', (event) => {
    if (event.target.matches('.status-button')) {
      const orderId = event.target.dataset["invoice-id"];
      obtenerInformacionFactura(orderId);
    }
  });
});

function eliminarItemPedido(nuevoItem) {
  const index = newInvoice.items.indexOf(nuevoItem);
  if (index !== -1) {
    newInvoice.items.splice(index, 1);
  }

  mostrarAlerta('success', '¡Item eliminado!');
}

async function mostrarPedidos() {
  try {
    const { data: invoices } = await getInvoices();
    const contenido = document.querySelector('#pedidos');
  
    const promises = invoices.map(async (invoice) => {
      const div = document.createElement('div');
      div.classList.add('invoice');
  
      const orderNumber = document.createElement('p');
      orderNumber.classList.add('order-number');
      orderNumber.textContent = '#' + invoice.id;
  
      const clientName = document.createElement('p');
      clientName.classList.add('client-name');
  
      const invoiceAddress = document.createElement('p');
      invoiceAddress.classList.add('invoice-address');
      invoiceAddress.textContent = invoice.address;
  
      let totalSum = 0;
      const ivaPercentage = 0.21; // El porcentaje de IVA es 21%
  
      invoice.products.forEach(item => {
        const date = new Date(item.deliveryDate);
        const difference = new Date().getTime() - date.getTime();
        const days = Math.floor(difference / 1000 / 60 / 60 / 24);
        const totalPeriods = Math.floor(days / item.period);
        const itemTotal = totalPeriods * item.price;

        totalSum += itemTotal;
      });
  
      if (invoice.IVA) {
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

      clientName.textContent = invoice.client.name;
      div.appendChild(orderNumber);
      div.appendChild(clientName);
      div.appendChild(invoiceAddress);
      div.appendChild(invoiceTotal);
      div.appendChild(infoPedidoBtn);
      contenido.appendChild(div);

      return infoPedidoBtn;
    });

  } catch (error) {
    console.error(error)
  }
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
  const itemInput = document.getElementById('item-input');
  const itemNumber = document.getElementById('item-number').value;
  const itemDate = document.getElementById('date-item').value;

  const listaItems = document.getElementById('lista-items');
  const itemAdded = itemInput + ` #${itemNumber}`;

  if (!itemInput.dataset.id || itemNumber === "" || itemDate === "") {
    mostrarAlerta('danger', '¡Completa todos los campos.');
    return;
  }

  const nuevoItem = {
    product: Number(itemInput.dataset.id),
    numberId: Number(itemNumber),
    deliveryDate: new Date(itemDate).toISOString(),
  };

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

async function guardarPedido() {
  const clientId = document.getElementById('invoice-client');
  const date = document.getElementById('InvoiceDate').value;
  const deliveryAddress = document.getElementById('deliveryAddress').value;
  const iva = document.getElementById('iva').value;

  if (clientId === "" || date === "" || deliveryAddress === "") {
    return;
  }

  newInvoice.client = Number(clientId.dataset.id);
  newInvoice.date = new Date(date).toISOString();
  newInvoice.address = deliveryAddress;
  newInvoice.IVA = iva === "on";
  newInvoice.city = "Bahia Blanca";
  newInvoice.postalCode = 8000;

  try {
    const { data: invoice } = await createInvoice(newInvoice);

    const promises = newInvoice.items.map(async (item) => {
      await createInvoiceProduct({
        ...item,
        invoice: invoice.id
      })
    })

    await Promise.all(promises);

    mostrarAlerta('success', '¡Pedido Guardado!');
  } catch (error) {
    console.error('Error:', error);    
  }

  const modal = document.getElementById('myModal');
  const modalBootstrap = new bootstrap.Modal(modal);
  modalBootstrap.hide();
}

async function obtenerInformacionFactura(orderId) {
  if (!orderId) {
    console.error('No se pudo obtener el ID del pedido');
    return;
  }

  try {
    const { data: pedido } = await getInvoice(orderId);
    console.log("PEDIDO:", pedido);
    document.getElementById('id').textContent = `#${pedido.id}`;
    document.getElementById('delivery_address').textContent = pedido.address;
    document.getElementById('date').textContent = pedido.deliveryDate;

    const finalizarPedidoBtn = document.querySelector('#finalizar-pedido');
    finalizarPedidoBtn.dataset.pedidoId = pedido.id;

    const editarPedidoBtn = document.querySelector('#editar-pedido');
    editarPedidoBtn.dataset.pedidoId = pedido.id;

    const { client: cliente } = pedido; 
    document.getElementById('client-name').textContent = cliente.name;
    document.getElementById('client-phone').textContent = cliente.phone;
    document.getElementById('client-email').textContent = cliente.email;
    console.error('Error al obtener los datos del cliente:', error);

    let totalSumEl = 0;
    let itemNamesAndNumbersEl = '';
    let totalPeriodsEl = '';
    let periodPricesEl = '';
    let itemTotalsEl = '';
    let deliveryDateEl = '';

    pedido.products.forEach(item => {

      itemNamesAndNumbersEl += `<p>${item.product.name} #${item.id}</p>`;
      const totalPeriods = calcPeriods(new Date(item.deliveryDate), item.period);
      totalPeriodsEl += `<p>${totalPeriods}</p>`;
      periodPricesEl += `<p>${item.price}</p>`;
      const total = totalPeriods * item.price;
      itemTotalsEl += `<p>$${total}</p>`;
      deliveryDateEl += `<p>${new Date(item.deliveryDate).toLocaleDateString(undefined, {
        dateStyle: "short"
      })}</p>`;

      totalSumEl += total;
    });

    document.getElementById('itemnameandnumber').innerHTML = itemNamesAndNumbersEl;
    document.getElementById('delivery_date').innerHTML = deliveryDateEl;
    document.getElementById('total_periods').innerHTML = totalPeriodsEl;
    document.getElementById('period_price').innerHTML = periodPricesEl;
    document.getElementById('total').innerHTML = itemTotalsEl;
    document.getElementById('invoiceTotal').textContent = `$${totalSumEl}`;

    const modal = document.getElementById('invoiceResumeModal');
    const modalBootstrap = new bootstrap.Modal(modal);
    modalBootstrap.show();
  } catch (error) { 
    console.error('Error al obtener los datos de la factura:', error);
  }
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




// EDITAR CLIENTE
const botonEditarPedido = document.querySelector('#editar-pedido');
botonEditarPedido.addEventListener('click', editarPedido);

function editarPedido(e) {
  const pedidoId = e.target.dataset["pedido-id"]; // Obtener el valor correcto del atributo "data-client-id"
  console.log(`Editando cliente... ${pedidoId}`);

  // Oculta el modal actual (resumeClientModal)
  const resumePedidoModal = document.getElementById('invoiceResumeModal');
  resumePedidoModal.classList.remove('show')

  // Obtén el modal de edición (editingClientModal)
  const editingInvoiceModal = document.getElementById('editingInvoiceModal');

  // Asigna el evento "shown.bs.modal" para mostrar el modal de edición cuando esté completamente cargado
  editingInvoiceModal.addEventListener('shown.bs.modal', function () {
    // Agregar manualmente la clase "show" al modal de edición
    editingInvoiceModal.classList.add('show');
  });

  // Muestra el modal de edición
  const editingClientModalInstance = new bootstrap.Modal(editingInvoiceModal);
  editingClientModalInstance.show();

  // Luego, puedes continuar con la lógica para obtener los datos del cliente y llenar el modal.
  const urlApi = `${url}clients`;

  // Realiza una solicitud a la API para obtener los datos del cliente
  fetch(`${urlApi}/${clienteId}`)
    .then(response => response.json())
    .then(data => {
      // Llena los campos del modal con los datos del cliente
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

      // Oculta el modal después de cargar los datos
      const modal = document.getElementById('editingClientModal');
      const modalBootstrap = new bootstrap.Modal(modal);
      modalBootstrap.hide();

      // Agregar un manejador de eventos al botón "patch-client-button"
      const patchClientButton = document.getElementById('patch-client-button');
      patchClientButton.dataset.clientId = clienteId; // Asignar el ID del cliente al botón
      patchClientButton.addEventListener('click', actualizarCliente);
    })
    .catch(error => {
      console.error('Error al obtener los datos del cliente:', error);
    });
}

// Función para actualizar al cliente
function actualizarCliente(e) {
  e.preventDefault(); // Evitar que el formulario se envíe si estás usando un formulario

  // Obtener el ID del cliente
  const clienteId = e.target.dataset.clientId;

  // Obtener los valores actualizados de los campos del modal
  const nuevoNombre = document.querySelector('#client-name').value;
  const nuevoPhone = document.querySelector('#client-phone').value;
  const nuevoCuit = document.querySelector('#client-cuit').value;
  const nuevoEmail = document.querySelector('#client-email').value;
  const nuevoAdress = document.querySelector('#client-adress').value;
  const nuevosExtras = document.querySelector('#client-extras').value;

  // Crear un objeto con los datos actualizados
  const datosActualizados = {
    name: nuevoNombre,
    phone: nuevoPhone,
    CUIT: nuevoCuit,
    email: nuevoEmail,
    address: nuevoAdress,
    extras: nuevosExtras
  };

  // Realizar una solicitud PATCH a la API para actualizar al cliente
  fetch(`${url}clients/${clienteId}`, {
    method: 'PATCH', // Usa el método PATCH para actualizar
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosActualizados)
  })
    .then(response => {
      if (response.ok) {
        // La actualización fue exitosa
        console.log('Cliente actualizado correctamente.');
        // Puedes realizar otras acciones aquí después de la actualización.
      } else {
        // Error al actualizar
        console.error('Error al actualizar el cliente.');
      }
    })
    .catch(error => {
      console.error('Error al enviar la solicitud de actualización:', error);
    });
}

const botonRegistarPago = document.getElementById('registrarPago')
botonRegistarPago.addEventListener('click', registrarPago )

async function registrarPago() {
  const invoiceProduct = document.getElementById('newclient-name').value;
  const value = document.getElementById('payment-amount').value;
  const method = document.getElementById('payment-method').value;
  const paymentDate = document.getElementById('payment-date').value;


  const nuevoPago = {
    invoiceProduct: invoiceProduct,
    paymentMethod: method,
    value: value,
    paymentDate: paymentDate,

  };

  try {
    const client = await createPayment(nuevoPago);
    console.log(client);
  } catch (error) {    
    console.error('Error:', error);
  }

  const modal = document.getElementById('newPaymentModal');
  const modalBootstrap = bootstrap.Modal.getInstance(modal);
  modalBootstrap.hide();
}