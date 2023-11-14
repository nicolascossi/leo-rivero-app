export const calcPeriods = (date, retirementDate, period) => {
  const difference = (retirementDate ? new Date(retirementDate) : new Date()).getTime() - date.getTime();
  const days = difference / 1000 / 60 / 60 / 24;
  const periodos = days / period;
  
  if (periodos <= 1 ){
    return 1
  }
  
  // Comparar el valor fraccional de periodos con 0.5 para redondear
  if (periodos - Math.floor(periodos) > 0.5) {
    // Redondear hacia arriba
    return Math.ceil(periodos);
  } else {
    // Redondear hacia abajo
    return Math.floor(periodos);
  }
};


export function calcPeriodsPrices(periods, totalPeriods, start, prices) {
  const pricesByPeriods = {};
  const sortedPricesByDate = prices.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  for (let i = 0; i < totalPeriods; i++) {
    const offsetDays = i * periods;
    const date = new Date(start);
    date.setDate(date.getDate() + offsetDays);
    let priceMoreAssociated = null;

    for (let j = 0; j < sortedPricesByDate.length; j++) {
      if (date >= new Date(sortedPricesByDate[j].createdAt)) {
        priceMoreAssociated = sortedPricesByDate[j].price;
      }
    }

    pricesByPeriods[i + 1] = {
      price: priceMoreAssociated,
      date
    }
  }

  return pricesByPeriods;
}