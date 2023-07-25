function generarIdUnico() {
    const max = 9999;
    const min = 1000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const guardarClienteBtn = document.getElementById('newclient-button');

guardarClienteBtn.addEventListener('click', guardarCliente);

function guardarCliente() {
    const clientId = generarIdUnico();
    const name = document.getElementById('newclient-name').value;
    const phone = document.getElementById('newclient-celphone').value;
    const cuit = document.getElementById('newclient-cuit-dni').value;
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

        divCliente.appendChild(nombre);
        divCliente.appendChild(telefono);
        divCliente.appendChild(email);
        divCliente.appendChild(btnInfoClient);

        container.appendChild(divCliente);
    });
}

// Llamada a la función para obtener y mostrar los clientes
consultarClientes();
