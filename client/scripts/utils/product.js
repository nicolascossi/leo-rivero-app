export const calcPeriods = (date, retirementDate, period, manualPeriod) => {
  const difference = (retirementDate ? new Date(retirementDate) : new Date()).getTime() - date.getTime();
  const days = Math.floor(difference / 1000 / 60 / 60 / 24);
  const periodos = days / period;
  return Math.floor(periodos)
}