import DateFormatter, { DateTimeFormats } from '#services/formatters/Date';

const currentDate = new Date();
const yesterdayDate = new Date();
yesterdayDate.setDate(currentDate.getDate() - 1);

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const formatLastMessageTime = (messageDateISO: string) => {
  const messageDate = new Date(messageDateISO);

  if (isSameDay(messageDate, currentDate)) {
    return DateFormatter.format(messageDateISO, DateTimeFormats.timeOnlyShort);
  }

  if (isSameDay(messageDate, yesterdayDate)) {
    return 'вчера';
  }

  return DateFormatter.format(messageDateISO, DateTimeFormats.dateOnlyShort);
};
