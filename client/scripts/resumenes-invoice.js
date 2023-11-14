

import { createInvoice, getInvoice,getInvoicesByClient, getInvoices,archiveInvoice } from "./services/invoices.js";
import { getProducts } from "./services/product.js";
import { createPayment } from "./services/payments.js";
import { calcPeriods, calcPeriodsPrices } from "./utils/product.js";
import { getActualDate } from "./utils/date.js";



async function generarResumen(datos) {
  const container = document.getElementById('pdf')
  container.classList.add('PDF')

  container.innerHTML = ''
  
  /* HEADER */
  const header = document.createElement('DIV')
  header.classList.add('header-left')

  const subHeader = document.createElement('DIV')
  subHeader.classList.add('subHeader')

  const headerLeft = document.createElement('DIV')

  const logo = document.createElement('IMG')
  logo.classList.add('logo-header')
  logo.src = '../img/blacklogo.png'

  const titlePdf = document.createElement('H2')
  titlePdf.classList.add('titlePdf')
  titlePdf.textContent = 'Resumen de pedido'

  const headerRigth = document.createElement('DIV')
  headerRigth.classList.add('header-right')

  const pedidoId = document.createElement('P')
  pedidoId.classList.add('pedidoId')

  /* INFO CLIENTE */

  const primerDiv = document.createElement('DIV')
  primerDiv.classList.add('DIVS-RESUMEN')
  const titlePrimerDiv = document.createElement('P')

  const infoClienteNombre = document.createElement('P')
  infoClienteNombre.classList.add('infoPedido')
  infoClienteNombre.textContent = `Cliente: ${datos.client.name}`

  const infoClienteMail = document.createElement('P')
  infoClienteMail.classList.add('infoPedido')
  infoClienteMail.textContent = `Direccion del pedido: ${datos.address}`

  const infoClienteTelefono = document.createElement('P')
  infoClienteTelefono.classList.add('infoPedido')
  infoClienteTelefono.textContent = datos.client.phone


  const segundoDiv = document.createElement('DIV')
  segundoDiv.classList.add('DIVS-RESUMEN')
  const titlesegundoDiv = document.createElement('P')
  titlesegundoDiv.textContent = 'Cant. Items'

  const cantItems = document.createElement('P')
  cantItems.classList.add('infoPedido')
  cantItems.textContent = `Numero de items: ${datos.products.length}`

  /* ACA SE IMPRIME LA LISTA DE PRODUCTOS */

  const listaItems = document.createElement('DIV')
  listaItems.classList.add('itemList')

  const primeraColumna = document.createElement('DIV')
  primeraColumna.classList.add('MASANCHO')
  const titlePrimeraColumna = document.createElement('P')
  titlePrimeraColumna.classList.add('title')
  titlePrimeraColumna.textContent = 'Producto'

  const segundaColumna = document.createElement('DIV')
  const titleSegundaColumna = document.createElement('P')
  titleSegundaColumna.classList.add('title' ,'text-center')
  titleSegundaColumna.textContent = 'Entrega'

  const terceraColumna = document.createElement('DIV')
  const titleTerceraColumna = document.createElement('P')
  terceraColumna.classList.add('MASANCHO')
  titleTerceraColumna.classList.add('title' ,'text-center')
  titleTerceraColumna.textContent = 'Retiro'

  const cuartaColumna = document.createElement('DIV')
  const titleCuartaColumna = document.createElement('P')
  titleCuartaColumna.classList.add('title' ,'text-center')
  titleCuartaColumna.textContent = 'Precio'

  const quintaColumna = document.createElement('DIV')
  const titleQuintaColumna = document.createElement('P')
  titleQuintaColumna.classList.add('title' ,'text-center')
  titleQuintaColumna.textContent = 'Periodos'

  const sextaColumna = document.createElement('DIV')
  const titleSextaColumna = document.createElement('P')
  titleSextaColumna.classList.add('title' ,'text-center')
  titleSextaColumna.textContent = 'Abonado'

  const septimaColumna = document.createElement('DIV')
  const titleSeptimaColumna = document.createElement('P')
  titleSeptimaColumna.classList.add('title' ,'text-end')
  titleSeptimaColumna.textContent = 'Pendiente'

  primeraColumna.appendChild(titlePrimeraColumna)
  
  segundaColumna.appendChild(titleSegundaColumna)
  
  terceraColumna.appendChild(titleTerceraColumna)
  
  cuartaColumna.appendChild(titleCuartaColumna)
  
  quintaColumna.appendChild(titleQuintaColumna)
  
  sextaColumna.appendChild(titleSextaColumna)
  
  septimaColumna.appendChild(titleSeptimaColumna)

  let totalAdeudado = 0

  datos.products.forEach((item) => {

    const totalPeriods =
      item.manualPeriod ??
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
    )


    const itemInfo = document.createElement('P')
    itemInfo.textContent = `${item.product.name} #${item.numberId}`
    primeraColumna.appendChild(itemInfo)
    
    const entrega = document.createElement('P')
    entrega.textContent = new Date(item.deliveryDate).toLocaleDateString()
    segundaColumna.appendChild(entrega)

    const retiro = document.createElement('P')
    retiro.classList.add('text-center')
    retiro.textContent = `${
      item.retirementDate
        ? new Date(item.retirementDate).toLocaleDateString()
        : "No se retiró"
    }`
    terceraColumna.appendChild(retiro)

    const precio = document.createElement('P')
    precio.textContent = `$${item.price.at(-1).price}`
    precio.classList.add('text-center')
    cuartaColumna.appendChild(precio)

    const periodos = document.createElement('P')
    periodos.textContent = totalPeriods
    periodos.classList.add('text-center')
    quintaColumna.appendChild(periodos)

    const abonado = document.createElement('P')
    let paymentsTotal = 0
    abonado.classList.add('text-center')
    item.payments?. forEach((payment) => {
      paymentsTotal += payment.value
    })
    abonado.textContent =  `$${paymentsTotal}`
    sextaColumna.appendChild(abonado)

    
    const subtotal = Object.values(periodsByPrices).reduce(
      (total, { price }) => total + price,
      0
    );

    const total = document.createElement('P')
    total.classList.add('text-end')
    total.textContent = `$${subtotal - paymentsTotal}`
    septimaColumna.appendChild(total)
    console.log(periodsByPrices);

    totalAdeudado += subtotal - paymentsTotal

  })

  const divTotal = document.createElement('DIV')
  divTotal.classList.add('TOTAL-RESUMEN')
  
  const totalMonto = document.createElement('P')
  totalMonto.textContent = 'Total Adeudado'

  const total = document.createElement('P')
  total.textContent = `$${totalAdeudado}`

  divTotal.appendChild(totalMonto)
  divTotal.appendChild(total)

  /* COSITO TOTAL */
  container.appendChild(header)
  container.appendChild(subHeader)

  header.appendChild(logo)
  header.appendChild(titlePdf)

  header.appendChild(headerLeft)
  
  /* CREAR DIV NUEVO */
  subHeader.appendChild(primerDiv)
  primerDiv.appendChild(titlePrimerDiv)
  primerDiv.appendChild(infoClienteNombre)
  primerDiv.appendChild(infoClienteTelefono)
  primerDiv.appendChild(infoClienteMail)
  primerDiv.appendChild(cantItems)
  

  header.appendChild(headerRigth)
  primerDiv.appendChild(pedidoId)

  /* CREAR DIV NUEVO */
  headerRigth.appendChild(segundoDiv)
  

  container.appendChild(listaItems)

  container.appendChild(divTotal)

  

  listaItems.appendChild(primeraColumna)
  listaItems.appendChild(segundaColumna)
  listaItems.appendChild(terceraColumna)
  listaItems.appendChild(cuartaColumna)
  listaItems.appendChild(quintaColumna)
  listaItems.appendChild(sextaColumna)
  listaItems.appendChild(septimaColumna)

  


}


const imprimirResumen = document.getElementById('nuevo-pdf');

imprimirResumen.addEventListener('click', async () => {
    try {
        const numeroPedido = document.getElementById('numberId').value;
        console.log('Número de Pedido:', numeroPedido);

        const { data: invoiceData } = await getInvoice(numeroPedido);

        if (invoiceData) {
            console.log('Data de la factura:', invoiceData);
;
            await generarResumen(invoiceData)
            /* await exportarPDF(invoiceData); */
        } else {
            console.log('No se encontró la factura con el número de pedido especificado.');
        }
    } catch (error) {
        console.error('Error al obtener la factura:', error);
    }
});
