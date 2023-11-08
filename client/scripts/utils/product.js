export const calcPeriods = (date, retirementDate, period) => {
  const difference = (retirementDate ? new Date(retirementDate) : new Date()).getTime() - date.getTime();
  const days = difference / 1000 / 60 / 60 / 24;
  const periodos = days / period;
  return Math.ceil(periodos)
}

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