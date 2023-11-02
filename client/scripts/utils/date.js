export const getActualDate = (UTCdatestring) => {
  const actualDate = new Date();
  const date = new Date(UTCdatestring)
  date.setTime(date.getTime() + Math.abs(actualDate.getTimezoneOffset() * 60000))
  return date;
}