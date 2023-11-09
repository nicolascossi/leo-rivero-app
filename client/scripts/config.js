import { getProducts, getProduct, updateProduct, deleteProduct, createProduct } from "./services/product.js";

document.addEventListener('DOMContentLoaded', function () {
  getProducts().then(productos => mostrarProductos(productos));
});

const guardarProductoBtn = document.getElementById('newproduct-button');
guardarProductoBtn.addEventListener('click', guardarProducto);

async function guardarProducto() {
  const name = document.getElementById('newproduct-name').value;
  const days = Number(document.getElementById('newproduct-period').value);
  const price = Number(document.getElementById('newproduct-price').value);

  const nuevoProducto = {
    name: name,
    price: price,
    period: days
  };

  await createProduct(nuevoProducto);

  const modal = document.getElementById('newProductModal');
  const modalBootstrap = bootstrap.Modal.getOrCreateInstance(modal);
  modalBootstrap.hide();
}

async function mostrarProductos() {
  const { data: productos } = await getProducts();
  const container = document.getElementById('productos');
  container.innerHTML = ''; // Limpia el contenedor antes de agregar los nuevos productos

  productos.forEach(producto => {
    const divProducto = document.createElement('DIV');
    divProducto.classList.add('product');

    const nombre = document.createElement('P');
    nombre.classList.add('product-name');
    nombre.classList.add('fw-semibold');
    nombre.textContent = producto.name;


    console.log(producto)
    
    console.log(producto.price);

    const precio = document.createElement('P');
    precio.classList.add('product-price');
    precio.textContent = `$${producto.price[0].price}`;

    const periodo = document.createElement('P');
    periodo.classList.add('product-period');
    periodo.textContent = `${producto.period} dias`;

    const ultPrecio = document.createElement('P');
    ultPrecio.classList.add('product-period');
    ultPrecio.textContent = `Ult. Actualizacion: ${new Date(producto.price[0].createdAt).toLocaleDateString()}`;

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
    divProducto.appendChild(ultPrecio)
    divProducto.appendChild(precio);
    divProducto.appendChild(periodo);
    divBotones.appendChild(btnBorrarProducto);
    divBotones.appendChild(btnEditarProducto);
    divProducto.appendChild(divBotones);

    container.appendChild(divProducto);

    btnBorrarProducto.addEventListener('click', borrarProducto);
    btnEditarProducto.addEventListener('click', editarProducto);
  });
}

async function borrarProducto(e) {
  const productoId = e.target.dataset.productid;
  await deleteProduct(productoId);
}

async function editarProducto(e) {
  const productoId = e.target.dataset.productid;
  console.log(`Editando producto... ${productoId}`);
  const { data } = await getProduct(productoId);

  const editingProductModal = document.getElementById('editingProductModal');
  editingProductModal.addEventListener('shown.bs.modal', function () {
    editingProductModal.classList.add('show');
  });

  const editingProductModalInstance = bootstrap.Modal.getOrCreateInstance(editingProductModal);
  editingProductModalInstance.show();

  const nombreInput = document.querySelector('#product-name');
  const priceInput = document.querySelector('#product-price');
  const periodsInput = document.querySelector('#product-period');

  nombreInput.value = data.name;
  priceInput.value = data.price[0].price;
  periodsInput.value = data.period;

  const updateProductButton = document.getElementById('update-product-button');
  updateProductButton.dataset.productid = productoId;
  updateProductButton.addEventListener('click', actualizarProducto);

}

async function actualizarProducto(e) {
  e.preventDefault(); // Evitar que el formulario se envíe si estás usando un formulario

  // Obtener el ID del producto
  const productoId = e.target.dataset.productid;

  // Obtener los valores actualizados de los campos del modal
  const nuevoNombre = document.querySelector('#product-name').value;
  const nuevoPrecio = document.querySelector('#product-price').value;
  const nuevoPeriod = document.querySelector('#product-period').value;

  // Crear un objeto con los datos actualizados
  const datosActualizados = {
    name: nuevoNombre,
    price: Number(nuevoPrecio),
    period: Number(nuevoPeriod),
  };

  try {
    const response = await updateProduct(productoId, datosActualizados);
    // Realizar una solicitud PUT a la API para actualizar el producto
    if (response.status === 201) {
      // La actualización fue exitosa
      console.log('Producto actualizado correctamente.');
      // Puedes realizar otras acciones aquí después de la actualización.
    } else {
      // Error al actualizar
      console.error('Error al actualizar el producto. Código de estado:', response.status);
    }
  } catch (error) {    
    console.error('Error al enviar la solicitud de actualización:', error);
  }
}
