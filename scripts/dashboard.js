// mostrarAlerta('success', '¡Operación exitosa!');
// mostrarAlerta('danger', '¡Error! Algo salió mal.');
// mostrarAlerta('info', 'Información importante.');

const url = 'http://localhost:4000/'

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

function consultarResolucion() {
  if (screen.width < 1024) 
  location.href ="../pages/no-support.html"
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
    "charged_amount": 0, 
    "total_periods": 0, 
    "total_cost": 0,
    "period_price": itemInput === "Obrador" ? 15000 : 10000,
    "period_days": itemInput === "Obrador" ? 15 : 7,
    "quantity": 1 
  }

  nuevoItem.total_cost = (nuevoItem.period_price * nuevoItem.total_periods) - nuevoItem.charged_amount;

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

      const finalizarPedidoBtn = document.querySelector('#finalizar-pedido');
      finalizarPedidoBtn.dataset.pedidoId = pedido.id;

      const editarPedidoBtn = document.querySelector('#editar-pedido');
      editarPedidoBtn.dataset.pedidoId = pedido.id;

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
      let totalPeriods = '';
      let periodPrices = '';
      let itemTotals = '';

      pedido.items.forEach(item => {
        totalSum += item.total;

        // Concatenar la información de los items
        itemNamesAndNumbers += `<p>${item.name} #${item.item_number}</p>`;
        totalPeriods += `<p>${item.total_periods}</p>`;
        periodPrices += `<p>$${item.period_price}</p>`;
        itemTotals += `<p>$${item.total}</p>`;

        // Agregar botón "Cobrar" para cada elemento
        const controlesColumn = document.getElementById('controles');

        const controlesItem = document.createElement('DIV');
        controlesItem.classList.add('controlesDiv')

        const cobrarButton = document.createElement('button');
        cobrarButton.textContent = 'Cobre';
        cobrarButton.classList.add('btn', 'btn-success');
        cobrarButton.dataset.itemNumber = item.item_number;

        const retirarButton = document.createElement('button');
        retirarButton.textContent = 'Retire';
        retirarButton.classList.add('btn', 'btn-danger');
        retirarButton.dataset.itemNumber = item.item_number;

        cobrarButton.addEventListener('click', function () {
          // Acción a realizar cuando se hace clic en "Cobrar Button"
          console.log('Hiciste clic en "Cobrar Button" para el elemento con Item Number:', item.item_number);
          // Puedes personalizar esta acción según tus necesidades
        });

        retirarButton.addEventListener('click', function () {
          // Acción a realizar cuando se hace clic en "Retirar Button"
          console.log('Hiciste clic en "Retirar Button" para el elemento con Item Number:', item.item_number);
          // Puedes personalizar esta acción según tus necesidades
        });

        controlesItem.appendChild(cobrarButton);
        controlesItem.appendChild(retirarButton);
        controlesColumn.appendChild(controlesItem);
      });

      // Mostrar los datos de los items en las columnas correspondientes
      document.getElementById('itemnameandnumber').innerHTML = itemNamesAndNumbers;
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




const finalizarPedidoBtn = document.querySelector('#finalizar-pedido')
finalizarPedidoBtn.addEventListener('click', finalizarPedido)

function finalizarPedido(e) {
  const pedidoId = e.target.dataset.pedidoId;

  const confirmar = confirm('¿Deseas arhivar/eliminar este cliente?');
  if (confirmar) {
    eliminarPedido(pedidoId);
  }
}

function eliminarPedido(id) {
  try {
    const response = fetch(`${url}invoices/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log(`Pedido con ID ${id} eliminado correctamente.`);
      // Puedes realizar otras acciones aquí después de eliminar con éxito.
    } else {
      console.error(`Error al eliminar el pedido con ID ${id}.`);
    }
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
  }
}


// EDITAR PEDIDO
const botonEditarCliente = document.querySelector('#editar-cliente-modal');
botonEditarCliente.addEventListener('click', editarCliente);

function editarCliente(e) {
  const clienteId = e.target.dataset.clientId; // Obtener el valor correcto del atributo "data-client-id"
  console.log(`Editando cliente... ${clienteId}`);

  // Oculta el modal actual (resumeClientModal)
  const resumeClientModal = document.getElementById('resumeClientModal');
  resumeClientModal.classList.remove('show')

  // Obtén el modal de edición (editingClientModal)
  const editingClientModal = document.getElementById('editingClientModal');

  // Asigna el evento "shown.bs.modal" para mostrar el modal de edición cuando esté completamente cargado
  editingClientModal.addEventListener('shown.bs.modal', function () {
    // Agregar manualmente la clase "show" al modal de edición
    editingClientModal.classList.add('show');
  });

  // Muestra el modal de edición
  const editingClientModalInstance = new bootstrap.Modal(editingClientModal);
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
