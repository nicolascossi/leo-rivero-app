import { createInvoice, getInvoice, getInvoicesByClient, getInvoices, archiveInvoice } from "./services/invoices.js";
import { getProducts } from "./services/product.js";
import { createPayment } from "./services/payments.js";
import { calcPeriods, calcPeriodsPrices } from "./utils/product.js";
import { getActualDate } from "./utils/date.js";

const imprimirResumen = document.getElementById('nuevo-pdf');

imprimirResumen.addEventListener('click', async () => {
    try {
        const numeroCliente = document.getElementById('numberId').value;
        console.log('Numero del cliente:', numeroCliente);

        const { data: clientInvoices } = await getInvoicesByClient(numeroCliente);

        if (clientInvoices) {
            console.log('Pedidos del cliente:', clientInvoices);
            await generarResumen(clientInvoices);
        } else {
            console.log('No se encontró la factura con el número de pedido especificado.');
        }
    } catch (error) {
        console.error('Error al obtener la factura:', error);
    }
});

let totalAdeudado = 0;

async function generarResumen(datos) {
    const container = document.getElementById('pdf');
    container.classList.add('PDF');
    container.innerHTML = '';

    /* HEADER */
    const header = document.createElement('DIV');
    header.classList.add('header-left');

    const subHeader = document.createElement('DIV');
    subHeader.classList.add('subHeader');

    const headerLeft = document.createElement('DIV');

    const logo = document.createElement('IMG');
    logo.classList.add('logo-header');
    logo.src = '../img/blacklogo.png';

    const titlePdf = document.createElement('H2');
    titlePdf.classList.add('titlePdf');
    titlePdf.textContent = 'Resumen de cliente';

    const headerRigth = document.createElement('DIV');
    headerRigth.classList.add('header-right');

    const pedidoId = document.createElement('P');
    pedidoId.classList.add('pedidoId');

    /* INFO CLIENTE */

    const primerDiv = document.createElement('DIV');
    primerDiv.classList.add('DIVS-RESUMEN');
    const titlePrimerDiv = document.createElement('P');

    const infoClienteNombre = document.createElement('P');
    infoClienteNombre.classList.add('infoPedido');
    infoClienteNombre.textContent = `Cliente: ${datos[0].client.name}`;

    const infoClienteMail = document.createElement('P');
    infoClienteMail.classList.add('infoPedido');
    var direccion = datos[0].client.address || "Sin direccion";
    infoClienteMail.textContent = `Direccion del cliente: ` + direccion;

    const infoClienteTelefono = document.createElement('P');
    infoClienteTelefono.classList.add('infoPedido');
    var telefono = datos[0].client.phone || "Sin telefono";
    infoClienteTelefono.textContent = `Telefono:` + telefono;

    const segundoDiv = document.createElement('DIV');
    segundoDiv.classList.add('DIVS-RESUMEN');
    const titlesegundoDiv = document.createElement('P');
    titlesegundoDiv.textContent = 'Cant. Items';

    const cantItems = document.createElement('P');
    cantItems.classList.add('infoPedido');
    cantItems.textContent = `Cant. pedidos activos: ${datos.length}`;

    console.log(infoClienteNombre);
    /* ACA SE IMPRIME LA LISTA DE PRODUCTOS */

    container.appendChild(header);
    container.appendChild(subHeader);

    const pedidosActivos = datos.filter((pedido) => !pedido.isArchived);

    pedidosActivos.forEach((pedido) => {
        const cajaPedido = document.createElement('DIV');
        cajaPedido.classList.add('cajaPedido');

        const numeroPedido = document.createElement('P');
        numeroPedido.classList.add('TITLE');
        numeroPedido.textContent = `#${pedido.id}`;

        const direccionObra = document.createElement('P');
        direccionObra.classList.add('TITLE');
        direccionObra.textContent = pedido.address;

        const cajaItems = document.createElement('DIV');
        cajaItems.classList.add('cajaItems');

        cajaPedido.appendChild(numeroPedido);
        cajaPedido.appendChild(direccionObra);
        cajaPedido.appendChild(cajaItems);

        const primeraColumna = document.createElement('DIV')
  primeraColumna.classList.add('MASANCHO')
  const titlePrimeraColumna = document.createElement('P')
  primeraColumna.appendChild(titlePrimeraColumna)
  titlePrimeraColumna.classList.add('title')
  titlePrimeraColumna.textContent = 'Producto'

  const segundaColumna = document.createElement('DIV')
  const titleSegundaColumna = document.createElement('P')
  segundaColumna.appendChild(titleSegundaColumna)
  titleSegundaColumna.classList.add('title' ,'text-center')
  titleSegundaColumna.textContent = 'Entrega'

  const terceraColumna = document.createElement('DIV')
  const titleTerceraColumna = document.createElement('P')
  terceraColumna.appendChild(titleTerceraColumna)
  terceraColumna.classList.add('MASANCHO')
  titleTerceraColumna.classList.add('title' ,'text-center')
  titleTerceraColumna.textContent = 'Retiro'

  const cuartaColumna = document.createElement('DIV')
  const titleCuartaColumna = document.createElement('P')
  cuartaColumna.appendChild(titleCuartaColumna)
  titleCuartaColumna.classList.add('title' ,'text-center')
  titleCuartaColumna.textContent = 'Precio'

  const quintaColumna = document.createElement('DIV')
  const titleQuintaColumna = document.createElement('P')
  quintaColumna.appendChild(titleQuintaColumna)
  titleQuintaColumna.classList.add('title' ,'text-center')
  titleQuintaColumna.textContent = 'Periodos'

  const sextaColumna = document.createElement('DIV')
  const titleSextaColumna = document.createElement('P')
  sextaColumna.appendChild(titleSextaColumna)
  titleSextaColumna.classList.add('title' ,'text-center')
  titleSextaColumna.textContent = 'Abonado'

  const septimaColumna = document.createElement('DIV')
  const titleSeptimaColumna = document.createElement('P')
  septimaColumna.appendChild(titleSeptimaColumna)
  titleSeptimaColumna.classList.add('title' ,'text-end')
  titleSeptimaColumna.textContent = 'Pendiente'

        pedido.products.forEach((item) => {
            const totalPeriods =
                item.product.manualPeriod ??
                calcPeriods(
                    new Date(item.deliveryDate),
                    item.retirementDate,
                    item.period
                );
            const periodsByPrices = calcPeriodsPrices(
                item.period,
                totalPeriods,
                item.deliveryDate,
                item.price
            );

            const producto = document.createElement('P');
            producto.textContent = `${item.product.name} #${item.numberId}`;

            const entrega = document.createElement('P');
            entrega.textContent = new Date(item.deliveryDate).toLocaleDateString();

            const retiro = document.createElement('P');
            retiro.classList.add('text-center')
            retiro.textContent = `${
                item.retirementDate
                    ? new Date(item.retirementDate).toLocaleDateString()
                    : "No se retiró"
            }`;

            const precio = document.createElement('P');
            precio.textContent = `$${item.price.at(-1).price}`;

            const periodos = document.createElement('P');
            periodos.textContent = totalPeriods;
            periodos.classList.add('text-center')

            const abonado = document.createElement('P');
            let paymentsTotal = 0;
            abonado.classList.add('text-center');
            item.payments?.forEach((payment) => {
                paymentsTotal += payment.value;
            });

            abonado.textContent = `$${paymentsTotal}`;

            const subtotal = Object.values(periodsByPrices).reduce(
                (total, { price }) => total + price,
                0
            );

            // Eliminar la redeclaración de totalAdeudado
            totalAdeudado += subtotal - paymentsTotal;

            const total = document.createElement('P');
            total.classList.add('text-end');
            total.textContent = `$${subtotal - paymentsTotal}`;
            cajaItems.appendChild(total);
            console.log(periodsByPrices);

            primeraColumna.appendChild(producto)
            segundaColumna.appendChild(entrega)
            terceraColumna.appendChild(retiro)
            cuartaColumna.appendChild(precio)
            quintaColumna.appendChild(periodos)
            sextaColumna.appendChild(abonado)
            septimaColumna.appendChild(total)

            cajaItems.appendChild(primeraColumna);
            cajaItems.appendChild(segundaColumna);
            cajaItems.appendChild(terceraColumna);
            cajaItems.appendChild(cuartaColumna);
            cajaItems.appendChild(quintaColumna);
            cajaItems.appendChild(sextaColumna);
            cajaItems.appendChild(septimaColumna);
        });

        container.appendChild(cajaPedido); // Añadir cajaPedido al contenedor fuera del bucle
    });

    /* ------------------------------------ */

    const divTotal = document.createElement('DIV');
    divTotal.classList.add('TOTAL-RESUMEN', 'totalxcliente');

    const totalMonto = document.createElement('P');
    totalMonto.textContent = 'Total Adeudado';

    const total = document.createElement('P');
    total.textContent = `$ ${totalAdeudado}`;

    divTotal.appendChild(totalMonto);
    divTotal.appendChild(total);

    /* itme y todal */

    header.appendChild(logo);
    header.appendChild(titlePdf);

    header.appendChild(headerLeft);

    /* CREAR DIV NUEVO */
    subHeader.appendChild(primerDiv);
    primerDiv.appendChild(titlePrimerDiv);
    primerDiv.appendChild(infoClienteNombre);
    primerDiv.appendChild(infoClienteTelefono);
    primerDiv.appendChild(infoClienteMail);
    primerDiv.appendChild(cantItems);

    header.appendChild(headerRigth);
    primerDiv.appendChild(pedidoId);

    /* CREAR DIV NUEVO */
    headerRigth.appendChild(segundoDiv);

    
    container.appendChild(divTotal);
}
