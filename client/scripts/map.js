const url = 'http://localhost:4000/'

document.addEventListener('DOMContentLoaded', () => {
  consultarResolucion();
  ImprimirMapa()
 


  
});

function consultarPedidos() {
  const urlApi = `${url}invoices`;

  fetch(urlApi)
    .then(respuesta => respuesta.json())
    .then(resultado => mostrarPedidos(resultado))
    .catch(error => console.log(error));
}
function consultarClientesID(id) {
  const urlApi = `${url}clients/${id}`;

  return fetch(urlApi)
    .then(respuesta => respuesta.json())
    .then(resultado => resultado)
    .catch(error => console.log(error));
}


function obtenerInformacionFactura(event) {

  const orderId = event.getAttribute('data-invoiceId');

  if (!orderId) {
    console.error('No se pudo obtener el ID del pedido');
    return;
  }

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

        itemNamesAndNumbers += `<p>${item.name} #${item.item_number}</p>`;
        totalPeriods += `<p>${item.total_periods}</p>`;
        periodPrices += `<p>$${item.period_price}</p>`;
        itemTotals += `<p>$${item.total}</p>`;
      });

      document.getElementById('itemnameandnumber').innerHTML = itemNamesAndNumbers;
      document.getElementById('total_periods').innerHTML = totalPeriods;
      document.getElementById('period_price').innerHTML = periodPrices;
      document.getElementById('total').innerHTML = itemTotals;
      document.getElementById('invoiceTotal').textContent = `$${totalSum}`;

      const modal = document.getElementById('invoiceResumeModal');
      const modalBootstrap = new bootstrap.Modal(modal);
      modalBootstrap.show();
    })
    .catch(error => console.error('Error al obtener los datos de la factura:', error));
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

function consultarResolucion() {
  if (screen.width < 1024) 
  location.href ="../pages/no-support.html"
}


function ImprimirMapa() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29zc2lkZXZlbG9wIiwiYSI6ImNsaWNmcHh2bzBmNXkzdG56Yzd4N3R6NW4ifQ.VwKn5MbLV8Gg4SSEiC4qmQ';
  
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/cossidevelop/clicg9rta000901p18yeod5gb',
      center: [-62.25, -38.72],
      zoom: 12
    });
  
    map.on('load', function() {
      var marker = new mapboxgl.Marker()
        .setLngLat([-62.235690, -38.689509])
        .setPopUp(new mapboxgl.Popup().setHTML("Hello world"))
        .addTo(map);

  
      fetch('http://localhost:4000/invoices')
        .then(response => response.json())
        .then(data => {
          data.forEach(invoice => {
            const { delivery_address, id } = invoice;
            const fullAddress = `${delivery_address}, ${invoice.city}, ${invoice.postalCode}`;
  
            // Use Mapbox Geocoding API to convert address to coordinates
            const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${mapboxgl.accessToken}`;
  
            fetch(geocodingUrl)
              .then(response => response.json())
              .then(geoData => {
                if (geoData.features.length > 0) {
                  const [longitude, latitude] = geoData.features[0].center;
  
                  // Create a new marker for each invoice
                  var newMarker = new mapboxgl.Marker()
                    .setLngLat([longitude, latitude])
                    .addTo(map);
                    newMarker.setPopup(new mapboxgl.Popup().setHTML(`<button onclick="obtenerInformacionFactura(this)" data-invoiceId='${invoice.id}'>Ver Pedido</button>`));
                  

                  // Add data-invoice-id attribute to the marker
                  newMarker.getElement().setAttribute('data-invoice-id', id);
                }
              })
              .catch(error => {
                console.error('Error fetching geocoding data:', error);
              });
          });
        })
        .catch(error => {
          console.error('Error fetching invoice data:', error);
        });
    });
  };
  