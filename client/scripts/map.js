import { getInvoice, getInvoices } from "./services/invoices.js";
import { getClient, getClients } from "./services/client.js";
import { mostrarAlerta } from "./utils/alert.js";
import { checkResoulution } from "./utils/resolution.js";
import {
  createInvoiceProduct,
  updateInvoiceProduct,
} from "./services/invoice-products.js";
import { getProducts } from "./services/product.js";
import { createPayment } from "./services/payments.js";
import { calcPeriods } from "./utils/product.js";
import { getActualDate } from "./utils/date.js";

document.addEventListener("DOMContentLoaded", () => {
  checkResoulution(1024, null, () => {
    location.href = "../pages/no-support.html";
  });
  ImprimirMapa();
});

async function obtenerInformacionFactura(invoiceId) {
  if (!invoiceId) {
    console.error('No se pudo obtener el ID del pedido');
    return;
  }

  try {
    const { data: pedido } = await getInvoice(invoiceId);
    console.log("PEDIDO:", pedido);
    document.getElementById('id').textContent = `#${pedido.id}`;
    document.getElementById('delivery_address').textContent = pedido.address;
    document.getElementById('date').textContent = new Date (pedido.createdAt).toLocaleDateString()

    const finalizarPedidoBtn = document.querySelector('#finalizar-pedido');
    finalizarPedidoBtn.dataset.pedidoId = pedido.id;

    const editarPedidoBtn = document.querySelector('#editar-pedido');
    editarPedidoBtn.dataset.pedidoId = pedido.id;

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
      const totalPeriods = calcPeriods(new Date(item.deliveryDate), item.retirementDate, item.period);
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
    const modalBootstrap = new bootstrap.Modal(modal);
    modalBootstrap.show();
  } catch (error) { 
    console.error('Error al obtener los datos de la factura:', error);
  }
}

async function ImprimirMapa() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiY29zc2lkZXZlbG9wIiwiYSI6ImNsaWNmcHh2bzBmNXkzdG56Yzd4N3R6NW4ifQ.VwKn5MbLV8Gg4SSEiC4qmQ";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/cossidevelop/clicg9rta000901p18yeod5gb",
    center: [-62.25, -38.72],
    zoom: 12,
  });

  map.on("load", async function () {
    var marker = new mapboxgl.Marker()
      .setLngLat([-62.23569, -38.689509])
      .setPopup(new mapboxgl.Popup().setHTML("Deposito"))
      .addTo(map);

    const { data: invoices } = await getInvoices();

    invoices
      .forEach(async (invoice) => {
        const { address, id } = invoice;
        const fullAddress = `${address}, Bahia blanca, 8000`;

        // Use Mapbox Geocoding API to convert address to coordinates
        const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          fullAddress
        )}.json?access_token=${mapboxgl.accessToken}`;

        const response = await fetch(geocodingUrl);
        const data = await response.json();

        if (data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;

          // Create a new marker for each invoice
    // `<button onclick="obtenerInformacionFactura(${invoice.id})" id="popup-${invoice.id}" data-invoiceId='${invoice.id}'>Ver Pedido</button>`
          const button = document.createElement("button");
          button.innerText = "Ver Pedido";
          button.dataset.invoiceId = invoice.id;
          button.onclick = (e) => {
            obtenerInformacionFactura(e.currentTarget.dataset.invoiceId);
          }
          var newMarker = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map);
          newMarker.setPopup(
            new mapboxgl.Popup().setDOMContent(
              button
            )
          );
              

          // Add data-invoice-id attribute to the marker
          newMarker.getElement().setAttribute("data-invoice-id", id);
        }
      })
  });
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
  const editingClientModalInstance = new bootstrap.Modal(editingInvoiceModal);
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
    const totalPeriods = calcPeriods(new Date(item.deliveryDate), item.retirementDate, item.period);
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
    const retireButton = table.querySelectorAll(".retire-button");
    paymentButton.forEach((button) => {
      button.addEventListener("click", (e) => addPayment(InfoPedido.products.find((product) => {
        return product.id === Number(e.currentTarget.dataset.invoiceProductId)
      })))
    })
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


const addItemToInvoiceButton = document.getElementById("invoice-add-item");
addItemToInvoiceButton.addEventListener("click", (e) => {
  addNewItem(e.currentTarget.dataset.invoiceId);
})



async function addPayment(invoiceProduct) {
  const modal = new bootstrap.Modal("#invoiceNewPaymentModal");
  const registrarPagoBtn = document.getElementById('registrarPago')
  registrarPagoBtn.dataset.invoiceProductId = invoiceProduct.id
  const spanData1 = document.getElementById('ItemData')
  spanData1.textContent = `${invoiceProduct.product.name} #${invoiceProduct.numberId}`
  modal.show();
}

const registrarPagoBtn = document.getElementById('registrarPago')
registrarPagoBtn.addEventListener('click', async ()=>{

  const modal = new bootstrap.Modal("#invoiceNewPaymentModal");

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

  const modal = new bootstrap.Modal("#invoiceRetire");
  
  const fechaInput = document.getElementById('RetiroFecha').value

  const retiro = {
    retirementDate: getActualDate(fechaInput)
  }

  await updateInvoiceProduct(fechaRetiroBtn.dataset.invoiceProductId ,retiro)
  modal.hide()
} )


async function retireInvoiceProduct(invoiceProduct) {
  const modal = new bootstrap.Modal("#invoiceRetire");
  fechaRetiroBtn.dataset.invoiceProductId = invoiceProduct.id
  const spanData2 = document.getElementById('ItemData2')
  spanData2.textContent = `${invoiceProduct.product.name} #${invoiceProduct.numberId}`
  
  modal.show();
}


async function PeriodosManual(invoiceProduct) {
  const modal = new bootstrap.Modal("#PeriodosManual");
  const registrarPeriodosManualBtn = document.getElementById('registrarPeriodos')
  console.log(invoiceProduct)
  registrarPeriodosManualBtn.dataset.invoiceProductId = invoiceProduct.id
  const spanData1 = document.getElementById('item-periodos')
  spanData1.textContent = `${invoiceProduct.product.name} #${invoiceProduct.numberId}`
  modal.show();
}

const registrarPeriodosBtn = document.getElementById('registrarPeriodos')
registrarPeriodosBtn.addEventListener('click', async ()=>{

  const modal = new bootstrap.Modal("#PeriodosManual");
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
  const modal = new bootstrap.Modal("#HistorialPagos");
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