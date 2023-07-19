
function generarIdUnico() {
    const max = 9999;
    const min = 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const guardarClienteBtn = document.getElementById('newclient-button');

guardarClienteBtn.addEventListener('click' , guardarCliente)

function guardarCliente() {

    const clientId = generarIdUnico();
    const name = document.getElementById('newclient-name').value;
    const phone = document.getElementById('newclient-phone').value;
    const cuit = document.getElementById('newclient-cuit').value;
    const email = document.getElementById('newclient-email').value;
    const adress = document.getElementById('newclient-adress').value;
    const extras = document.getElementById('newclient-extras').value;
    

    const nuevoCliente = {
        id: clientId,
        name: name,
        email: email,
        phone: phone,
        adress: adress,
        CUIT: cuit,
        extras: extras
    };

    const url = 'http://localhost:4000/clients';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCliente)
    })
        .then(response => response.json())
        .then(result => {
            console.log('El post ha sido creado:', result);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    const modal = document.getElementById('newClientModal');
    const modalBootstrap = bootstrap.Modal.getInstance(modal);
    modalBootstrap.hide();
}

function consultarClientes() {
    const url = 'http://localhost:4000/clients';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarClientes(resultado))
        .catch(error => console.log(error));
}

function mostrarClientes(clientes) {
    const container = document.getElementById('clientes-container');

    clientes.forEach(cliente => {
        const divCliente = document.createElement('div');
        divCliente.classList.add('cliente');

        const nombre = document.createElement('p');
        nombre.classList.add('client-name');
        nombre.textContent = cliente.n;

        const telefono = document.createElement('p');
        telefono.classList.add('client-phone');
        telefono.textContent = cliente.phone;

        const cantidadPedido = document.createElement('p');
        cantidadPedido.classList.add('client-order-amount');
        cantidadPedido.textContent = cliente.email;

        const btnMostrarInfo = document.createElement('button');
        btnMostrarInfo.classList.add('client-button')
        btnMostrarInfo.textContent = 'Informacion del cliente';
        

        divCliente.appendChild(nombre);
        divCliente.appendChild(telefono);
        divCliente.appendChild(cantidadPedido);
        divCliente.appendChild(btnMostrarInfo);

        container.appendChild(divCliente);
    });
}

