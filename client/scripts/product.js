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
    .catch(error => console.error(error));
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
    divProducto.classList.add('product');

    const nombre = document.createElement('P');
    nombre.classList.add('product-name');
    nombre.textContent = producto.name;

    const precio = document.createElement('P');
    precio.classList.add('product-price');
    precio.textContent = producto.price;

    const periodo = document.createElement('P');
    periodo.classList.add('product-period');
    periodo.textContent = producto.period;

    const divBotones = document.createElement('DIV');
    divBotones.classList.add('product-botones');

    const btnEditarProducto = document.createElement('BUTTON');
    btnEditarProducto.classList.add('product-button');
    btnEditarProducto.textContent = 'Editar Producto';
    btnEditarProducto.setAttribute('data-productid', producto.id);

    const btnBorrarProducto = document.createElement('BUTTON');
    btnBorrarProducto.classList.add('product-button2');
    btnBorrarProducto.textContent = 'X';
    btnBorrarProducto.setAttribute('data-productid', producto.id);

    divProducto.appendChild(nombre);
    divProducto.appendChild(precio);
    divProducto.appendChild(periodo);
    divBotones.appendChild(btnBorrarProducto);
    divBotones.appendChild(btnEditarProducto);
    divProducto.appendChild(divBotones);

    container.appendChild(divProducto);

    // Agregar el evento click para borrar productos y editar productos
    btnBorrarProducto.addEventListener('click', borrarProducto);
    btnEditarProducto.addEventListener('click', editarProducto);
  });
}

function borrarProducto(e) {
  const productoId = e.target.dataset.productid;

  const confirmar = confirm('¿Deseas eliminar este producto?');
  if (confirmar) {
    eliminarProducto(productoId);
  }
}

async function eliminarProducto(id) {
  try {
    const response = await fetch(`${url}productos/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log(`Producto con ID ${id} eliminado correctamente.`);
      // Puedes realizar otras acciones aquí después de eliminar con éxito.
    } else {
      console.error(`Error al eliminar el producto con ID ${id}.`);
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
}

function editarProducto(e) {
  const productoId = e.target.dataset.productid; // Obtener el valor correcto del atributo "data-productid"
  console.log(`Editando producto... ${productoId}`);

  // Obtén el modal de edición (editingProductModal)
  const editingProductModal = document.getElementById('editingProductModal');

  // Asigna el evento "shown.bs.modal" para mostrar el modal de edición cuando esté completamente cargado
  editingProductModal.addEventListener('shown.bs.modal', function () {
    // Agregar manualmente la clase "show" al modal de edición
    editingProductModal.classList.add('show');
  });

  // Muestra el modal de edición
  const editingProductModalInstance = new bootstrap.Modal(editingProductModal);
  editingProductModalInstance.show();

  // Luego, puedes continuar con la lógica para obtener los datos del producto y llenar el modal.
  const urlApi = `${url}productos`;

  // Realiza una solicitud a la API para obtener los datos del producto
  fetch(`${urlApi}/${productoId}`)
    .then(response => response.json())
    .then(data => {
      // Llena los campos del modal con los datos del producto
      const nombreProducto = document.querySelector('#product-name');
      const precioProducto = document.querySelector('#period-price');
      const periodosProducto = document.querySelector('#period-days');

      nombreProducto.value = data.name;
      precioProducto.value = data.price;
      periodosProducto.value = data.period;

      // Oculta el modal después de cargar los datos
      const modal = document.getElementById('editingProductModal');
      const modalBootstrap = new bootstrap.Modal(modal);
      modalBootstrap.hide();

      // Agregar un manejador de eventos al botón "patch-product-button"
      const patchProductButton = document.getElementById('patch-product-button');
      patchProductButton.dataset.productid = productoId; // Asignar el ID del producto al botón
      patchProductButton.addEventListener('click', actualizarProducto);
    })
    .catch(error => {
      console.error('Error al obtener los datos del producto:', error);
    });
}

// Función para actualizar el producto
function actualizarProducto(e) {
  e.preventDefault(); // Evitar que el formulario se envíe si estás usando un formulario

  // Obtener el ID del producto
  const productoId = e.target.dataset.productid;

  // Obtener los valores actualizados de los campos del modal
  const nuevoNombre = document.querySelector('#product-name').value;
  const nuevoPrecio = document.querySelector('#period-price').value;
  const nuevoPeriodo = document.querySelector('#period-days').value;

  // Crear un objeto con los datos actualizados
  const datosActualizados = {
    name: nuevoNombre,
    price: nuevoPrecio,
    period: nuevoPeriodo,
  };

  // Realizar una solicitud PATCH a la API para actualizar el producto
  fetch(`${url}productos/${productoId}`, {
    method: 'PATCH', // Usa el método PATCH para actualizar
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosActualizados)
  })
    .then(response => {
      if (response.ok) {
        // La actualización fue exitosa
        console.log('Producto actualizado correctamente.');
        // Puedes realizar otras acciones aquí después de la actualización.
      } else {
        // Error al actualizar
        console.error('Error al actualizar el producto.');
      }
    })
    .catch(error => {
      console.error('Error al enviar la solicitud de actualización:', error);
    });
}
