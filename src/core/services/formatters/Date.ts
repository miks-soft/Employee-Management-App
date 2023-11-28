import moment from 'moment';

export enum DateTimeFormats {
  regular = 'D MMM HH:mm:ss',

  dateOnly = 'DD MMM YYYY',
  dateOnlyShort = 'DD MMM',
  dateOnlyDots = 'DD.MM.YYYY',
  dateOnlyHyphen = 'YYYY-MM-DD',

  timeOnlyShort = 'HH:mm',
  timeOnlyFull = 'HH:mm:ss',
}
class DateFormatter {
  static format(date: Date | string | number, format: DateTimeFormats) {
    return moment(date).format(format);
  }

  static resetTime(date: Date | string) {
    return moment(date).hours(0).minutes(0).toISOString();
  }

  static trimDateWithoutTimezoneISO(date: Date | string) {
    return moment(date).utcOffset(0, true).format();
  }
}

export default DateFormatter;
