/* ADD EVENT LISTENER */

document.addEventListener('DOMContentLoaded', consultarAPI());


/*  FUNCION TRAER PEDIDOS DE LA API */

function consultarAPI() {
    const url = 'http://localhost:4000/invoices?_expand=client'

    fetch(url)
    .then (respuesta => respuesta.json())
    .then (resultado => mostrarPedidos(resultado))
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
      clientName.textContent = invoice.client.name;
  
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
  