export const mostrarAlerta = (tipo, mensaje) => {
  const alertaDiv = document.createElement('div');
  alertaDiv.classList.add('alert', `alert-${tipo}`);
  alertaDiv.textContent = mensaje;
  const alertContainer = document.getElementById('alert-container');
  alertContainer.appendChild(alertaDiv);
  
  setTimeout(() => {
    alertContainer.removeChild(alertaDiv);
  }, 3000);
}