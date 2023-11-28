import { colors } from '#styles';

export enum EnumObjectPossibleWorkdays {
  'MONDAY' = 'mon',
  'TUESDAY' = 'tue',
  'WEDNESDAY' = 'wed',
  'THURSDAY' = 'thu',
  'FRIDAY' = 'fri',
  'SUNDAY' = 'sun',
  'SATURDAY' = 'sat',
}

export const MapEnumObjectPossibleWorkaysToShortText: {
  [key in EnumObjectPossibleWorkdays]: string;
} = {
  [EnumObjectPossibleWorkdays.MONDAY]: 'Пн',
  [EnumObjectPossibleWorkdays.TUESDAY]: 'Вт',
  [EnumObjectPossibleWorkdays.WEDNESDAY]: 'Ср',
  [EnumObjectPossibleWorkdays.THURSDAY]: 'Чт',
  [EnumObjectPossibleWorkdays.FRIDAY]: 'Пт',
  [EnumObjectPossibleWorkdays.SUNDAY]: 'Сб',
  [EnumObjectPossibleWorkdays.SATURDAY]: 'Вс',
};

export enum EnumTaskStatus {
  'DONE' = 20,
  'UNDONE' = 10,
}

export enum EnumChatRecepient {
  'USER' = 'user',
  'PROJECT' = 'project',
}

export enum EnumTrackerStatus {
  'PAUSED' = 'pause',
  'ACTIVE' = 'active',
  'READY' = 'end',
}

export const MapEnumTrackerStatusToColor: {
  [key in EnumTrackerStatus]: string;
} = {
  [EnumTrackerStatus.ACTIVE]: colors.success,
  [EnumTrackerStatus.PAUSED]: colors.error,
  [EnumTrackerStatus.READY]: colors.grayscale.__20,
};

export const MapEnumTrackerStatusToText: {
  [key in EnumTrackerStatus]: string;
} = {
  [EnumTrackerStatus.ACTIVE]: 'Идет',
  [EnumTrackerStatus.PAUSED]: 'Идет перерыв',
  [EnumTrackerStatus.READY]: 'Не идёт',
};
