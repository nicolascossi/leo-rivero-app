export const calcPeriods = (date, period) => {
  const difference = new Date().getTime() - date.getTime();
  const days = Math.floor(difference / 1000 / 60 / 60 / 24);
  return Math.floor(days / period);
}