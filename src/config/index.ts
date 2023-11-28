export const __DEVELOPER__ = true;

export enum BackgroundTasks {
  GEOFENCING = 'GEOFENCING',
}

export enum SpecialNotificationIds {
  FOREGROUND_SERVICE = 'foreground-service',
  TRACKER_OUT_OF_ZONE = 'tracker-out-of-zone',
}

export enum SilentPushTypes {
  START_GEOLOCATION = 'service-start',
  STOP_GEOLOCATION = 'service-stop',
  COLLECT_SERVICES_DATA = 'get-steps',
}
