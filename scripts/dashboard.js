// mostrarAlerta('success', '¡Operación exitosa!');
// mostrarAlerta('danger', '¡Error! Algo salió mal.');
// mostrarAlerta('info', 'Información importante.');

const url = 'http://localhost:3000/'

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

function mostrarAlerta(tipo, mensaje) {
  // Crea un elemento div para la alerta
  const alertaDiv = document.createElement('div');

  // Asigna las clases de Bootstrap para el estilo
  alertaDiv.classList.add('alert', `alert-${tipo}`);

  // Agrega el mensaje al contenido de la alerta
  alertaDiv.textContent = mensaje;

  // Obtén el contenedor de las alertas
  const alertContainer = document.getElementById('alert-container');

  // Agrega la alerta al contenedor
  alertContainer.appendChild(alertaDiv);

  // Remueve la alerta después de un tiempo (3 segundos en este ejemplo)
  setTimeout(() => {
    alertContainer.removeChild(alertaDiv);
  }, 3000);
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

  const listaItems = document.getElementById('lista-items')
  const itemAdded = itemInput + ` #${itemNumber}` 
  


  if (itemInput === "" || itemNumber === "" || itemDate === "") {
    mostrarAlerta('danger', '¡Completa todos los campos.');;
  }

  const nuevoItem = {
    "id": itemInput === "Obrador" ? 1 : 2,
    "name": itemInput,
    "item_number": itemNumber,
    "delivery_date": itemDate,
    "total_cost": (period_price * total_periods) - charged_amount,
    "charged_amount": 0,
    "total_periods": (delivery_date - actualDate) = total-de-dias / period_days,
    "period_price": itemInput === "Obrador" ? 15000 : 10000,
    "period_days": itemInput === "Obrador" ? 15 : 7,
    "quantity": 1 // Agregamos la propiedad quantity con valor 1
  };

  newInvoice.items.push(nuevoItem);

  const div = document.createElement('div');
    div.classList.add('item-added');

    const deleteItemBtn = document.createElement('BUTTON')
    deleteItemBtn.classList.add('buttonModalNewInvoice')
    deleteItemBtn.textContent = "X"
    deleteItemBtn.addEventListener( 'click' , () => {
      eliminarItemPedido(nuevoItem)
      listaItems.removeChild(div)
    })

    const itemType = document.createElement('p');
    itemType.textContent = itemAdded

    const dateItem = document.createElement('p');
    dateItem.textContent = itemDate

    div.appendChild(itemType);
    div.appendChild(dateItem);
    div.appendChild(deleteItemBtn)
    listaItems.appendChild(div);



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

  

  if (newInvoice.id === "" || clientId === "" || date === "" || deliveryAddress === "") {
    return;
  }

  newInvoice.id = nuevoId;
  newInvoice.clientId = clientId;
  newInvoice.date = date;
  newInvoice.delivery_address = deliveryAddress;
  newInvoice.iva = iva;
  newInvoice.city = "Bahia Blanca"
  newInvoice.postalCode = 8000
 
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

function obtenerInformacionFactura(orderId) {
  const urlApi = `${url}invoices/${orderId}`;

  fetch(urlApi)
    .then(respuesta => respuesta.json())
    .then(pedido => {
      document.getElementById('id').textContent = `#${pedido.id}`;
      document.getElementById('delivery_address').textContent = pedido.delivery_address;
      document.getElementById('date').textContent = pedido.date;

      // Obtener y mostrar los datos del cliente utilizando el clientId
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
      let quantities = '';
      let totalPeriods = '';
      let periodPrices = '';
      let itemTotals = '';

      pedido.items.forEach(item => {
        totalSum += item.total;

        // Concatenar la información de los items
        itemNamesAndNumbers += `<p>${item.name} #${item.item_number}</p>`;
        quantities += `<p>${item.quantity}</p>`;
        totalPeriods += `<p>${item.total_periods}</p>`;
        periodPrices += `<p>$${item.period_price}</p>`;
        itemTotals += `<p>$${item.total}</p>`;

      
        const itemsAlquiladosPedido = document.querySelector('.items-alquilados');
        const itemsPedidosTitle = document.createElement('p');
        itemsPedidosTitle.classList.add('subtitle-payment');
        itemsPedidosTitle.textContent = 'Items Alquilados';
        itemsAlquiladosPedido.innerHTML = '';
        itemsAlquiladosPedido.appendChild(itemsPedidosTitle);

        // Create a div element to wrap all the concatenated item information
        const itemInfoDiv = document.createElement('div');
        itemInfoDiv.innerHTML = `${itemNamesAndNumbers}`;

      // Append the div element to the itemsAlquiladosPedido container
        itemsAlquiladosPedido.appendChild(itemInfoDiv);
      });

      
      // Mostrar los datos de los items en las columnas correspondientes
      document.getElementById('itemnameandnumber').innerHTML = itemNamesAndNumbers;
      document.getElementById('quantity').innerHTML = quantities;
      document.getElementById('total_periods').innerHTML = totalPeriods;
      document.getElementById('period_price').innerHTML = periodPrices;
      document.getElementById('total').innerHTML = itemTotals;
      document.getElementById('invoiceTotal').textContent = `$${totalSum}`;

      // Mostrar el modal después de actualizar los datos
      const modal = document.getElementById('invoiceResumeModal');
      const modalBootstrap = new bootstrap.Modal(modal);
      modalBootstrap.show();
    })
    .catch(error => console.error('Error al obtener los datos de la factura:', error));
}

