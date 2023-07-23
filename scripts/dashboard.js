let newInvoice = { 
    items: []
  };

  document.addEventListener('DOMContentLoaded', () => {
    consultarClientes();
    consultarPedidos();
  });
  
  function consultarPedidos() {
    const url = 'http://localhost:4000/invoices';
  
    fetch(url)
      .then(respuesta => respuesta.json())
      .then(resultado => mostrarPedidos(resultado))
      .catch(error => console.log(error));
  }
  
  function consultarClientes() {
    const url = 'http://localhost:4000/clients';
  
    fetch(url)
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
  
  function consultarClientesID(id) {
    const url = `http://localhost:4000/clients/${id}`;
  
    return fetch(url)
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
      button.addEventListener('click', imprimirModal);
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
  
    if (itemInput === "" || itemNumber === "" || itemDate === ""){
      return alert("Completa todos los campos");
    }
  
    const nuevoItem = {
      "id": itemInput === "Obrador" ? 1 : 2,
      "name": itemInput,
      "item_number": itemNumber,
      "delivery_date": itemDate,
      "withdraw_date": 0,
      "total_periods": 0,
      "period_price": itemInput === "Obrador" ? 15000 : 10000,
    };
  
    newInvoice.items.push(nuevoItem);
    console.log("Nuevo item agregado:", nuevoItem);
  }
  
  const guardarPedidoBtn = document.getElementById('guardar-pedido');
  guardarPedidoBtn.addEventListener('click', guardarPedido);
  
  function guardarPedido() {
    const nuevoId = generarIdUnico();
    const clientId = document.getElementById('invoice-client').value;
    const date = document.getElementById('InvoiceDate').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    const iva = document.getElementById('iva').value;
  
    if (newInvoice.id === "" || newInvoice.clientId === "" || newInvoice.date === "" || newInvoice.delivery_address === "") {
      return;
    }
  
    newInvoice.id = nuevoId;
    newInvoice.clientId = clientId;
    newInvoice.date = date;
    newInvoice.delivery_address = deliveryAddress;
    newInvoice.iva = iva;
  
    const url = 'http://localhost:4000/invoices';
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newInvoice)
    })
      .then(response => response.json())
      .then(result => {
        console.log('El post ha sido creado:', result);
        newInvoice = {
          items: []
        };
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


document.getElementById('btnAbrirModal').addEventListener('click', imprimirModal);

function imprimirModal() {
    const orderId = this.dataset.invoiceId;
    const url = `http://localhost:4000/invoices/${orderId}`;

    console.log(`Imprimiendo modal del pedido con ID: ${orderId}`);
    console.log(url);
    fetch(url)
      .then(respuesta => respuesta.json())
      .then(pedido => {
        console.log(pedido); 
        
        pedido.items.forEach(item => {
          console.log(`Item ID: ${item.id}`);
          console.log(`Nombre del artículo: ${item.name}`);
          console.log(`Precio por período: $${item.period_price}`);
          console.log('----------------------------------');
        });
        
      })
      .catch(error => console.log(error));
  }
  



