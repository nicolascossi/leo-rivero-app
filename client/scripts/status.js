import { getPayments } from "./services/payments.js";

const boton = document.getElementById('sumar-pagos');

boton.addEventListener('click', sumarPagos);

async function sumarPagos() {
  try {
    // Obtener el valor de los elementos de fecha
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    // Verificar si los elementos existen y son de tipo fecha
    if (!startDateInput || !endDateInput || startDateInput.type !== 'date' || endDateInput.type !== 'date') {
      throw new Error("Los elementos de fecha no están configurados correctamente.");
    }

    // Obtener las fechas de los elementos de entrada
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    // Obtener los datos de pagos
    const response = await getPayments();
    const data = response.data; // Ajusta esto según la estructura de tu respuesta

    if (!Array.isArray(data)) {
      throw new Error("Los datos de pagos no son un array");
    }

    console.log("Datos de pagos:", data);

    // Filtrar pagos entre las fechas seleccionadas
    const pagosFiltrados = data.filter(pago => {
      const paymentDate = new Date(pago.paymentDate);
      // Comparar las fechas sin tener en cuenta la hora, minutos, segundos y milisegundos
      const isAfterStartDate = paymentDate >= startDate && paymentDate < endDate.setDate(endDate.getDate() + 1);
      return isAfterStartDate;
    });

    console.log("Pagos filtrados:", pagosFiltrados);

    // Sumar los valores de los pagos filtrados
    const totalValue = pagosFiltrados.reduce((total, pago) => total + pago.value, 0);

    const container = document.getElementById('payments')
    const total = document.createElement('P')
    total.textContent = `El total de los pagos registrados entre las fechas seleccionas es de $${totalValue}`

    container.appendChild(total)
  } catch (error) {
    console.error(error);
    // Manejar el error según sea necesario
  }
}
