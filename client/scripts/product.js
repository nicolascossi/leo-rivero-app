const url = 'http://localhost:4000/';

    const guardarProductoBtn = document.getElementById('newproduct-button');

    guardarProductoBtn.addEventListener('click', guardarProducto);

    document.addEventListener('DOMContentLoaded', function() {
      consultarProductos().then(productos => mostrarProductos(productos));
    });

    function consultarProductos() {
      const urlApi = `${url}productos`;

      return fetch(urlApi)
        .then(respuesta => respuesta.json())
        .catch(error => console.log(error));
    }

    function guardarProducto() {
      const name = document.getElementById('newproduct-name').value;
      const days = document.getElementById('newproduct-period').value;
      const price = document.getElementById('newproduct-price').value;

      const nuevoProducto = {
        name: name,
        price: price,
        period: days
      };

      const urlApi = `${url}productos`;

      fetch(urlApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
      })
        .then(response => response.json())
        .then(result => {
          console.error(result);
          // Actualiza la lista de productos después de agregar uno nuevo
          consultarProductos().then(productos => mostrarProductos(productos));
        })
        .catch(error => {
          console.error('Error:', error);
        });

      const modal = document.getElementById('newProductModal');
      const modalBootstrap = new bootstrap.Modal(modal);
      modalBootstrap.hide();
    }

    function mostrarProductos(productos) {
      const container = document.getElementById('productos');
      container.innerHTML = ''; // Limpia el contenedor antes de agregar los nuevos productos

      productos.forEach(producto => {
        const divProducto = document.createElement('DIV');
        divProducto.classList.add('client');

        const nombre = document.createElement('P');
        nombre.classList.add('client-name');
        nombre.textContent = producto.name;

        const precio = document.createElement('P');
        precio.classList.add('client-price');
        precio.textContent = producto.price;

        const periodo = document.createElement('P');
        periodo.classList.add('client-period');
        periodo.textContent = producto.period;

        const btnEditarProducto = document.createElement('BUTTON');
        btnEditarProducto.classList.add('client-button');
        btnEditarProducto.textContent = 'Editar Producto';
        btnEditarProducto.setAttribute('data-product-id', producto.id);

        divProducto.appendChild(nombre);
        divProducto.appendChild(precio);
        divProducto.appendChild(periodo);
        divProducto.appendChild(btnEditarProducto);

        container.appendChild(divProducto);
      });
    }