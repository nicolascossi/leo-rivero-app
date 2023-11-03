export const calcPeriods = (date, retirementDate, period) => {
  const difference = (retirementDate ? new Date(retirementDate) : new Date()).getTime() - date.getTime();
  const days = Math.floor(difference / 1000 / 60 / 60 / 24);

  const periodos = Math.floor(days / period);

  if (periodos % 1 >= 0.5) {
    // Redondear hacia arriba
    const resultadoRedondeado = Math.ceil(periodos);
    return resultadoRedondeado ;
  } else {
    return Math.floor(periodos);
  }


  


}