
import {getInvoice, getInvoices } from "./services/invoices.js";
import { getClient, getClients } from "./services/client.js";
import { mostrarAlerta } from "./utils/alert.js";
import { checkResoulution } from "./utils/resolution.js";
import { createInvoiceProduct, updateInvoiceProduct } from "./services/invoice-products.js";
import { getProducts } from "./services/product.js"; 
import { createPayment } from "./services/payments.js"; 
import { calcPeriods } from "./utils/product.js";
import { getActualDate } from "./utils/date.js";

document.addEventListener('DOMContentLoaded', () => {
  consultarResolucion();
  ImprimirMapa()

});










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
        .setPopup(new mapboxgl.Popup().setHTML("Hello world"))
        .addTo(map);

  
      fetch('${url}invoices')
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
  