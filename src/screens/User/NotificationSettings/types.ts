export enum NotificationActivityTypes {
  DURING_WORK_TIME = 'all',
  ALWAYS = 'workday',
}

export const MapNotificationActivityTypesToText: {
  [key in NotificationActivityTypes]: string;
} = {
  [NotificationActivityTypes.ALWAYS]: 'Всегда',
  [NotificationActivityTypes.DURING_WORK_TIME]: 'В рабочее время',
};
