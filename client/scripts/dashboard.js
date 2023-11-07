// mostrarAlerta('success', '¡Operación exitosa!');
// mostrarAlerta('danger', '¡Error! Algo salió mal.');
// mostrarAlerta('info', 'Información importante.');

import { createInvoice, getInvoice, getInvoices } from "./services/invoices.js";
import { getClient, getClients } from "./services/client.js";
import { mostrarAlerta } from "./utils/alert.js";
import { checkResoulution } from "./utils/resolution.js";
import { createInvoiceProduct, updateInvoiceProduct} from "./services/invoice-products.js";
import { getProducts } from "./services/product.js"; 
import { createPayment } from "./services/payments.js"; 
import { calcPeriods } from "./utils/product.js";
import { getActualDate } from "./utils/date.js";


let newInvoice = {
  items: []
};

document.addEventListener('DOMContentLoaded', () => {
  
  checkResoulution(1024, null, () => {
    location.href = "../pages/no-support.html";
  })
  mostrarPedidos()
  .then(contarPedidosPorCobrar)
  .then(contarPedidosActivos);
  
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
      const orderId = event.target.dataset.invoiceId;
      obtenerInformacionFactura(orderId);
    }
  });
  
});
function contarPedidosPorCobrar() {
  // Selecciona todos los elementos con la clase "mi-clase"
  var elementos = document.querySelectorAll('.PorCobrar');

  // Cuenta la cantidad de elementos encontrados
  var cantidad = elementos.length;
  console.log(cantidad)

  const contarPedidosPorCobrar = document.getElementById('pedidos-por-cobrar')
  contarPedidosPorCobrar.innerText = `${cantidad}`
}

function contarPedidosActivos() {
  // Selecciona todos los elementos con la clase "mi-clase"
  var elementos = document.querySelectorAll('.status-button');

  // Cuenta la cantidad de elementos encontrados
  var cantidad = elementos.length;
  console.log(cantidad)

  const contarPedidosActivos = document.getElementById('pedidos-activos')
  contarPedidosActivos.innerText = `${cantidad}`
}
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
  
    invoices.map(async (invoice) => {
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
      const ivaPercentage = 1.21; // El porcentaje de IVA es 21%
  
      invoice.products.forEach(item => {
        const totalPeriods = item.manualPeriod ?? calcPeriods(new Date(item.deliveryDate), item.retirementDate, item.period);
        const subtotal = totalPeriods * item.price;
        const payed = item.payments?.reduce((total, { value }) => total + value, 0) ?? 0;
        const total = subtotal - payed;

        totalSum += total;
      });
  
      console.log(totalSum);

      const invoiceTotal = document.createElement('p');
      invoiceTotal.classList.add('invoice-total');
      invoiceTotal.textContent = '$' + parseFloat(totalSum.toFixed(2));
  
      const infoPedidoBtn = document.createElement('button');
      infoPedidoBtn.classList.add('status-button');
      infoPedidoBtn.setAttribute('data-invoice-id', invoice.id);
      infoPedidoBtn.textContent = 'Ver Pedido';
      if(totalSum > 0) {
        infoPedidoBtn.classList.add("bg-primary")
        infoPedidoBtn.classList.add("PorCobrar")
        infoPedidoBtn.textContent = "A Cobrar"
      }

      clientName.textContent = invoice.client.name;
      div.appendChild(orderNumber);
      div.appendChild(clientName);
      div.appendChild(invoiceAddress);
      div.appendChild(invoiceTotal);
      div.appendChild(infoPedidoBtn);
      contenido.appendChild(div);
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
  const itemAdded = itemInput.value + ` #${itemNumber}`;

  if (!itemInput.dataset.id || itemNumber === "" || itemDate === "") {
    mostrarAlerta('danger', '¡Completa todos los campos.');
    return;
  }

  const nuevoItem = {
    product: Number(itemInput.dataset.id),
    numberId: Number(itemNumber),
    deliveryDate: getActualDate(itemDate)
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

  if (clientId === "" || date === "" || deliveryAddress === "") {
    return;
  }

  newInvoice.client = Number(clientId.dataset.id);
  newInvoice.date = getActualDate(date);
  newInvoice.address = deliveryAddress;
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
  const modalBootstrap = bootstrap.Modal.getOrCreateInstance(modal);
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
    document.getElementById('date').textContent = new Date (pedido.createdAt).toLocaleDateString()

   

    const editarPedidoBtn = document.querySelector('#editar-pedido');
    editarPedidoBtn.dataset.pedidoId = pedido.id;

    const archivarPedidoBtn = document.querySelector('#finalizar-pedido');
    archivarPedidoBtn.dataset.pedidoId = pedido.id;

    const { client: cliente } = pedido; 
    document.getElementById('client-name').textContent = cliente.name;
    document.getElementById('client-phone').textContent = cliente.phone;
    document.getElementById('client-email').textContent = cliente.email;
    document.getElementById('client-cuit').textContent = cliente.CUIT;
    

    let totalSumEl = 0;

    const head = `<div class="parent-items-resume--head parent-items-row">
    <p class="text-start">Item</p>
    <p class="text-center">Entrega</p>
    <p class="text-center">Retiro</p>
    <p class="text-center">Periodos</p>
    <p class="text-center">Precio/Periodo</p>
    <p class="text-end">Total</p>
  </div>`

    let rows = ""

    pedido.products.forEach(item => {
      const totalPeriods = item.manualPeriod ?? calcPeriods(new Date(item.deliveryDate), item.retirementDate, item.period);
      const subtotal = totalPeriods * item.price;
      const payed = item.payments?.reduce((total, { value }) => total + value, 0) ?? 0;
      const total = subtotal - payed;
      totalSumEl += total;

      rows += `
      <div class="parent-items-row">
        <p class="text-start">${item.product.name} #${item.numberId}</p>
        <p class="text-center">${new Date(item.deliveryDate).toLocaleDateString()}</p>
        <p class="text-center">${item.retirementDate ? new Date(item.retirementDate).toLocaleDateString() : "No se retiró"}</p>
        <p class="text-center">${totalPeriods}</p>
        <p class="text-center">$${item.price}</p>
        <p class="text-end">$${total}</p>
      </div>
      `
    });

    document.getElementById('parent-items-table').innerHTML = `${head}${rows}`;
    document.getElementById('invoiceTotal').textContent = `$${totalSumEl}`;

    const modal = document.getElementById('invoiceResumeModal');
    const modalBootstrap = bootstrap.Modal.getOrCreateInstance(modal);
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

const archivarPedidoBtn = document.querySelector('#finalizar-pedido');
archivarPedidoBtn.addEventListener('click', archivarPedido);

function archivarPedido () {
  const orderId = e.target.dataset.pedidoId;
  console.log(orderId)
}


// EDITAR pedido
const botonEditarPedido = document.querySelector('#editar-pedido');
botonEditarPedido.addEventListener('click', editarPedido);

async function editarPedido(e) {
  const pedidoId = e.target.dataset.pedidoId; // Obtener el valor correcto del atributo "data-client-id"

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
  const editingClientModalInstance = bootstrap.Modal.getOrCreateInstance(editingInvoiceModal);
  editingClientModalInstance.show();
  
  const {data: InfoPedido} = await getInvoice(pedidoId)


  document.getElementById('date-ed').textContent = new Date (InfoPedido.createdAt).toLocaleDateString()
  document.getElementById('client-name-ed').textContent = InfoPedido.client.name
  document.getElementById('client-phone-ed').textContent = InfoPedido.client.phone
  document.getElementById('client-cuit-ed').textContent = InfoPedido.client.CUIT
  document.getElementById('client-email-ed').textContent = InfoPedido.client.email

  document.getElementById('date-ed').textContent = new Date (InfoPedido.createdAt).toLocaleDateString()

  let totalSumEl = 0;

  const head = `<div class="parent-items-resume--head parent-items-row">
  <p class="text-start">Item</p>
  <p class="text-center">Entrega</p>
  <p class="text-center">Retiro</p>
  <p class="text-center">Periodos</p>
  <p class="text-center">Controles</p>
  <p class="text-end">Total</p>
</div>`
  let rows = "";

  InfoPedido.products.forEach(item => {
    const name = `${item.product.name} #${item.numberId}`;
    const totalPeriods = item.manualPeriod ?? calcPeriods(new Date(item.deliveryDate), item.retirementDate, item.period);
    const subtotal = totalPeriods * item.price;
    const payed = item.payments?.reduce((total, { value }) => total + value, 0) ?? 0;
    const total = subtotal - payed;
    totalSumEl += total;

    rows += `
    <div class="parent-items-row">
      <p class="text-start">${name}</p>
      <p class="text-center">${new Date(item.deliveryDate).toLocaleDateString()}</p>
      <p class="text-center">${item.retirementDate ? new Date(item.retirementDate).toLocaleDateString() : "No se retiró"}</p>
      <p class="text-center">${totalPeriods}</p>
      <p class="text-center">
        <button class="control add-payment-button" data-invoice-product-id="${item.id}">
          <i class="bx bx-money-withdraw icon-control"></i>
        </button>
        <button class="control retire-button" data-invoice-product-id="${item.id}">
          <i class="bx bxs-caret-up-circle icon-control"></i>
        </button>
        <button class="control  period-button" data-invoice-product-id="${item.id}">
        <i class='bx bx-calendar-exclamation icon-control'></i>
        </button>
        <button class="control  pagos-button" data-invoice-product-id="${item.id}">
        <i class='bx bx-history icon-control' ></i>
        </button>
      </p>
      <p class="text-end">$${total}</p>
    </div>
    `
  });

    document.getElementById("invoice-add-item").dataset.invoiceId = pedidoId;
    const totalElement = document.getElementById("editar-invoice-confirmado");
    if(totalElement) totalElement.innerText = `$${totalSumEl}`; 
    const table = document.getElementById('parent-items-table-ed');
    table.innerHTML = `${head}${rows}`;

    const paymentButton = table.querySelectorAll(".add-payment-button");
    paymentButton.forEach((button) => {
      button.addEventListener("click", (e) => addPayment(InfoPedido.products.find((product) => {
        return product.id === Number(e.currentTarget.dataset.invoiceProductId)
      })))
    })

    const retireButton = table.querySelectorAll(".retire-button");

    retireButton.forEach((button) => {
      button.addEventListener("click", (e) => retireInvoiceProduct(InfoPedido.products.find((product) => {
        return product.id === Number(e.currentTarget.dataset.invoiceProductId)
      })))
      
    })

    const periodosManualButton = table.querySelectorAll(".period-button");

    periodosManualButton.forEach((button) => {
      button.addEventListener("click", (e) => PeriodosManual(InfoPedido.products.find((product) => {
        return product.id === Number(e.currentTarget.dataset.invoiceProductId)
      })))
      
    })

    const HistorialPagosButton = table.querySelectorAll(".pagos-button");

    HistorialPagosButton.forEach((button) => {
      button.addEventListener("click", (e) => VerHistorialPagos(InfoPedido.products.find((product) => {
        return product.id === Number(e.currentTarget.dataset.invoiceProductId)
      })))
      
    })
    
    
}



async function PeriodosManual(invoiceProduct) {
  const modal = bootstrap.Modal.getOrCreateInstance("#PeriodosManual");
  const registrarPeriodosManualBtn = document.getElementById('registrarPeriodos')
  console.log(invoiceProduct)
  registrarPeriodosManualBtn.dataset.invoiceProductId = invoiceProduct.id
  const spanData1 = document.getElementById('item-periodos')
  spanData1.textContent = `${invoiceProduct.product.name} #${invoiceProduct.numberId}`
  modal.show();
}

const registrarPeriodosBtn = document.getElementById('registrarPeriodos')
registrarPeriodosBtn.addEventListener('click', async ()=>{

  const modal = bootstrap.Modal.getOrCreateInstance("#PeriodosManual");
  const invoiceProductId = registrarPeriodosBtn.dataset.invoiceProductId
  console.log(invoiceProductId)
  const periodosInput = document.getElementById('periodos-manual').value


  const periodoManual = {

    manualPeriod: Number(periodosInput),

  }

  await updateInvoiceProduct(invoiceProductId, periodoManual) /* NO ESTA HECHO ASI LOS PERIODOS SE CUENTA EN EL FRONTEND */
  modal.hide()
})

async function VerHistorialPagos(invoiceProduct) {
  const modal = bootstrap.Modal.getOrCreateInstance("#HistorialPagos");
  console.log(invoiceProduct)
  const spanData1 = document.getElementById('ITEMANDNUMBER')
  spanData1.textContent = ` ${invoiceProduct.product.name} #${invoiceProduct.numberId}`

  const div1 = document.getElementById('div1-pagos')
  const div2 = document.getElementById('div2-pagos')
  const div3 = document.getElementById('div3-pagos')

    div1.innerHTML = ''
    div2.innerHTML = ''
    div3.innerHTML = ''
    const titleColum1 = document.createElement('P')
    titleColum1.textContent = 'Fecha de Pago'
    const titleColum2 = document.createElement('P')
    titleColum2.textContent = 'Metodo de Pago'
    const titleColum3 = document.createElement('P')
    titleColum3.textContent = 'Monto abonado'
    div1.append(titleColum1)
    div2.append(titleColum2)
    div3.append(titleColum3)

    
    let total = 0

  invoiceProduct.payments.forEach ((payment) =>  {
    const container = document.getElementById('parent-payments-table')


  total += payment.value

    const payDate = document.createElement('P')
    payDate.textContent = new Date(payment.createdAt).toLocaleDateString()

    const payMethod = document.createElement('P')
    payMethod.textContent = `${payment.method}`

    const payAmount = document.createElement('P')
    payAmount.textContent = `$${payment.value}`

    container.appendChild(div1)
   
    div1.appendChild(payDate)
    container.appendChild(div2)
    
    div2.appendChild(payMethod)
    container.appendChild(div3)
    
    div3.appendChild(payAmount)


  }
  
  )

  pagosTotales.textContent = `$${total}`

    
  
  
  

  modal.show();
}


  const addItemToInvoiceButton = document.getElementById("invoice-add-item");
addItemToInvoiceButton.addEventListener("click", (e) => {
  addNewItem(e.currentTarget.dataset.invoiceId);
})


async function addPayment(invoiceProduct) {
  const modal = bootstrap.Modal.getOrCreateInstance("#invoiceNewPaymentModal");
  const registrarPagoBtn = document.getElementById('registrarPago')
  registrarPagoBtn.dataset.invoiceProductId = invoiceProduct.id
  const spanData1 = document.getElementById('ItemData')
  spanData1.textContent = `${invoiceProduct.product.name} #${invoiceProduct.numberId}`
  console.log(registrarPagoBtn)
  modal.show();
}

const registrarPagoBtn = document.getElementById('registrarPago')
registrarPagoBtn.addEventListener('click', async ()=>{

  const modal = bootstrap.Modal.getOrCreateInstance("#invoiceNewPaymentModal");

  const metodo = document.getElementById('payment-options-input').value
  const paymentValue = Number(document.getElementById('item-value-amount').value)
  const date = document.getElementById('date-payment-item').value

  const pago = {
    method: metodo,
    paymentDate: getActualDate(date),
    value: paymentValue,
    invoiceProduct: Number(registrarPagoBtn.dataset.invoiceProductId),

  }

  await createPayment(pago)
  modal.hide()
})


const fechaRetiroBtn = document.getElementById('FechaRetiroConfirmar')
fechaRetiroBtn.addEventListener('click', async () =>{

  const modal = bootstrap.Modal.getOrCreateInstance("#invoiceRetire");
  
  const fechaInput = document.getElementById('RetiroFecha').value

  const retiro = {
    retirementDate: getActualDate(fechaInput)
  }

  await updateInvoiceProduct(fechaRetiroBtn.dataset.invoiceProductId ,retiro)
  modal.hide()
} )


async function retireInvoiceProduct(invoiceProduct) {
  const modal = bootstrap.Modal.getOrCreateInstance("#invoiceRetire");
  fechaRetiroBtn.dataset.invoiceProductId = invoiceProduct.id
  const spanData2 = document.getElementById('ItemData2')
  spanData2.textContent = `${invoiceProduct.product.name} #${invoiceProduct.numberId}`
  
  modal.show();
}

const addNewItemButton = document.getElementById("AgregarNuevoItem");
addNewItemButton.addEventListener("click", async (e) => {
  const itemInput = document.getElementById("item-input-new-item");
  const numberInput = document.getElementById("item-number-new-item");
  const dateInput = document.getElementById("date-item-new-item");
  const datalist = [...document.querySelectorAll("#item-new-item > option")];


  const newItem = {
    numberId: Number(numberInput.value),
    product: Number(datalist.find((option) => option.value === itemInput.value)?.dataset?.id),
    invoice: Number(addNewItemButton.dataset.invoiceId),
    deliveryDate: getActualDate(dateInput.value)
  }

  await createInvoiceProduct(newItem);
})

async function addNewItem(invoiceId) {
  const modal = bootstrap.Modal.getOrCreateInstance("#invoiceNewItemModal");

  const { data: products } = await getProducts();

  const datalistNewItems = document.getElementById("item-new-item");
  datalistNewItems.innerHTML = products.map((product) => `<option value="${product.name}" data-id="${product.id}">${product.name}</option>`).join("")

  const button = document.getElementById("AgregarNuevoItem");
  button.dataset.invoiceId = invoiceId
  
  modal.show();
}