/* ADD EVENT LISTENER */

document.addEventListener('DOMContentLoaded', consultarPedidos);


/*  FUNCION TRAER PEDIDOS DE LA API y CLIENTES */

function consultarPedidos() {
    const url = 'http://localhost:4000/invoices'

    fetch(url)
    .then (respuesta => respuesta.json())
    .then (resultado => mostrarPedidos(resultado))
    .catch (error => console.log(error))
}

function consultarClientes() {
    const url = 'http://localhost:4000/clients'

    fetch(url)
    .then (respuesta => respuesta.json())
    .then (resultado => mostrarPedidos(resultado))
    .catch (error => console.log(error))
}

function consultarClientesID(id) {
    const url = `http://localhost:4000/clients/${id}`

    return fetch(url)
    .then (respuesta => respuesta.json())
    .then (resultado => (resultado))
    .catch (error => console.log(error))
    
}


/* FUNCION MOSTRAR PEDIDOS EN EL HTML */

function mostrarPedidos(invoices) {

    const contenido = document.querySelector('#pedidos');
  
    invoices.forEach(invoice => {
      const div = document.createElement('div');
      div.classList.add("invoice");
  
      const orderNumber = document.createElement('p');
      orderNumber.classList.add("order-number");
      orderNumber.textContent = "#" + invoice.id;
  
      const clientName = document.createElement('p');
      clientName.classList.add("client-name");
    
      consultarClientesID(invoice.clientId)
      .then ( client => {
        clientName.textContent = client.name;
      })

      const invoiceAddress = document.createElement('p');
      invoiceAddress.classList.add("invoice-address");
      invoiceAddress.textContent = invoice.delivery_adress;
  
      let totalSum = 0;
      invoice.items.forEach(item => {
        const itemTotal = item.quantity * item.period_price;
        totalSum += itemTotal;
      });
  
      const invoiceTotal = document.createElement('p');
      invoiceTotal.classList.add("invoice-total");
      invoiceTotal.textContent = "$" + parseFloat(totalSum.toFixed(2));
  
      const statusButton = document.createElement('button');
      statusButton.classList.add("status-button");
      statusButton.textContent = "Pendiente";
  
      div.appendChild(orderNumber);
      div.appendChild(clientName);
      div.appendChild(invoiceAddress);
      div.appendChild(invoiceTotal);
      div.appendChild(statusButton);
      contenido.appendChild(div);
    });
  }
  




/* SELECCIONAMOS EL BOTON DE GUARDAR PEDIDO */ 

const guardarPedidoBtn = document.getElementById('guardar-pedido');


guardarPedidoBtn.addEventListener('click', guardarPedido);

function guardarPedido() {


  const nuevoId = generarIdUnico();

 
  const clientId = document.getElementById('invoice-client').value;
  const date = document.getElementById('InvoiceDate').value;
  const deliveryAddress = document.getElementById('deliveryAddress').value;

  const nuevoInvoice = {
    id: nuevoId,
    clientId: parseInt(clientId),
    date: date,
    delivery_address: deliveryAddress,
    items: [] 
  };

  const url = 'http://localhost:4000/invoices'

  // Realizar la solicitud POST utilizando fetch()
fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoInvoice)
  })
    .then(response => response.json())
    .then(result => {
      console.log('El post ha sido creado:', result);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  const modal = document.getElementById('newInvoiceModal');
  const modalBootstrap = bootstrap.Modal.getInstance(modal);
  modalBootstrap.hide();
}

function generarIdUnico() {
  const max = 9999;
  const min = 1000;
  return Math.floor(Math.random() * (max - min + 1)) + min;

}
