const url = 'http://localhost:4000/'

document.addEventListener('DOMContentLoaded', () => {
  // Resto de tu código...
  consultarResolucion()
  // Inicializar el modal
  const resumeClientModal = document.getElementById('resumeClientModal');
  const modalBootstrap = new bootstrap.Modal(resumeClientModal);

  // Delegación de eventos para abrir el modal al hacer clic en el botón de "Status"
  document.addEventListener('click', (event) => {
    if (event.target.matches('.client-button')) {
      const clientId = event.target.dataset.clientId;
      obtenerInformacionCliente(clientId);
    }
  });
});

function consultarResolucion() {
  if (screen.width < 1024) 
  location.href ="../pages/no-support.html"
}

function generarIdUnico() {
  const max = 9999;
  const min = 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

const guardarClienteBtn = document.getElementById('newclient-button');

guardarClienteBtn.addEventListener('click', guardarCliente);

function guardarCliente() {
  const clientId = generarIdUnico();
  const name = document.getElementById('newclient-name').value;
  const phone = document.getElementById('newclient-phone').value;
  const cuit = document.getElementById('newclient-cuit').value;
  const email = document.getElementById('newclient-email').value;
  const address = document.getElementById('newclient-adress').value;
  const extras = document.getElementById('newclient-extras').value;

  const nuevoCliente = {
    id: clientId,
    name: name,
    email: email,
    phone: phone,
    address: address,
    CUIT: cuit,
    extras: extras
  };

  console.log('phone:', phone);
  console.log('cuit:', cuit);

  const urlApi = `${url}clients`;

  fetch(urlApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoCliente)
  })
    .then(response => response.json())
    .then(result => {
      console.error(result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
    

  const modal = document.getElementById('newClientModal');
  const modalBootstrap = bootstrap.Modal.getInstance(modal);
  modalBootstrap.hide();
}




function consultarClientes() {
  const urlApi = `${url}clients`;
  

  fetch(urlApi)
    .then(respuesta => respuesta.json())
    .then(resultado => mostrarClientes(resultado))
    .catch(error => console.log(error));
}

function mostrarClientes(clientes) {
  const container = document.querySelector('.clients-list');

  clientes.forEach(cliente => {
    const divCliente = document.createElement('DIV');
    divCliente.classList.add('client');

    const nombre = document.createElement('P');
    nombre.classList.add('client-name');
    nombre.textContent = cliente.name;

    const telefono = document.createElement('P');
    telefono.classList.add('celphone');
    telefono.textContent = cliente.phone;

    const email = document.createElement('P');
    email.classList.add('client-email');
    email.textContent = cliente.email;
    

    const btnInfoClient = document.createElement('BUTTON');
    btnInfoClient.classList.add('client-button');
    btnInfoClient.textContent = 'Informacion del Cliente';
    btnInfoClient.setAttribute('data-client-id', cliente.id);

    divCliente.appendChild(nombre);
    divCliente.appendChild(telefono);
    divCliente.appendChild(email);
    divCliente.appendChild(btnInfoClient);

    container.appendChild(divCliente);
  });
}

// Llamada a la función para obtener y mostrar los clientes
consultarClientes();

// Delegación de eventos para abrir el modal al hacer clic en el botón de "Status"
document.addEventListener('click', (event) => {
  if (event.target.matches('.client-button')) {
    const clientId = event.target.dataset.clientId;
    obtenerInformacionCliente(clientId);
  }
});

function obtenerInformacionCliente(clientId) {
  const urlApi = `${url}clients/${clientId}`;

  fetch(urlApi)
    .then(respuesta => respuesta.json())
    .then(cliente => {
      document.getElementById('name').textContent = cliente.name;
      document.getElementById('email').textContent = cliente.email;
      document.getElementById('phone').textContent = cliente.phone;
      document.getElementById('adress').textContent = cliente.address || cliente.adress;
      document.getElementById('CUIT').textContent = cliente.CUIT;
      document.getElementById('extras').textContent = cliente.extras;

      const editarClienteBtn = document.querySelector('#editar-cliente-modal');
      editarClienteBtn.dataset.clientId = cliente.id

      const borrarClientBtn = document.querySelector('#borrar-cliente-modal')
      borrarClientBtn.dataset.clientId = cliente.id


      // Mostrar el modal después de actualizar los datos
      const modal = document.getElementById('resumeClientModal');

      // Asignamos el evento shown.bs.modal para mostrar las facturas del cliente una vez que el modal esté completamente cargado
      modal.addEventListener('shown.bs.modal', function () {
        // Buscar invoices del cliente
        const invoicesUrl = `${url}invoices?clientId=${clientId}`;
        fetch(invoicesUrl)
          .then(respuesta => respuesta.json())
          .then(invoices => {
            // Crear los divs para los invoices y sus detalles
            const invoicesContainer = document.getElementById('invoices-container');
            invoicesContainer.innerHTML = ''; // Limpiar el contenido antes de agregar nuevos divs

            const columnsDiv = document.createElement('div');
      columnsDiv.classList.add('row-list-invoices');

      const titleColumnClient1 = document.createElement('p');
      titleColumnClient1.classList.add('title-column-client');
      titleColumnClient1.textContent = 'Pedido';

      const titleColumnClient2 = document.createElement('p');
      titleColumnClient2.classList.add('title-column-client');
      titleColumnClient2.textContent = 'Direccion';

      const titleColumnClient3 = document.createElement('p');
      titleColumnClient3.classList.add('title-column-client');
      titleColumnClient3.textContent = 'Total Items';

      columnsDiv.appendChild(titleColumnClient1);
      columnsDiv.appendChild(titleColumnClient2);
      columnsDiv.appendChild(titleColumnClient3);

      invoicesContainer.appendChild(columnsDiv);


            invoices.forEach(invoice => {
              const invoiceDiv = document.createElement('div');
              invoiceDiv.classList.add('row-list-invoices');

              const invoiceIdP = document.createElement('p');
              invoiceIdP.textContent = `#${invoice.id}`;

              const deliveryAddressP = document.createElement('p');
              deliveryAddressP.textContent = invoice.delivery_adress || invoice.delivery_address;

              const itemsP = document.createElement('p');
              itemsP.textContent = invoice.items.length;

              invoiceDiv.appendChild(invoiceIdP);
              invoiceDiv.appendChild(deliveryAddressP);
              invoiceDiv.appendChild(itemsP);

              invoicesContainer.appendChild(invoiceDiv);
            });
          })
          .catch(error => console.error('Error al obtener los datos de la factura:', error));
      });

      // Inicializar y mostrar el modal después de que se haya mostrado completamente
      const modalBootstrap = bootstrap.Modal.getInstance(modal);
      modalBootstrap.show();
    })
    .catch(error => console.error('Error al obtener los datos del cliente:', error));
}

// BORRAR CLIENTE

const botonBorrarCliente = document.querySelector('#borrar-cliente-modal')
botonBorrarCliente.addEventListener('click', borrarCliente)

function borrarCliente(e) {
  const clienteId = e.target.dataset.clientId;

  const confirmar = confirm('¿Deseas eliminar este cliente?');
  if (confirmar) {
    eliminarCliente(clienteId);
  }
}

async function eliminarCliente(id) {
  try {
    const response = await fetch(`${url}clients/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log(`Cliente con ID ${id} eliminado correctamente.`);
      // Puedes realizar otras acciones aquí después de eliminar con éxito.
    } else {
      console.error(`Error al eliminar el cliente con ID ${id}.`);
    }
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
  }
}

// EDITAR CLIENTE
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
