const url = 'https://json-server-rivero.onrender.com/'

document.addEventListener('DOMContentLoaded', () => {
  // Resto de tu código...

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

