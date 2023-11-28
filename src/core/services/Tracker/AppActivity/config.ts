export enum EventType {
  RESUMED = 1,
  PAUSED = 2,
  STOPPED = 23,
}

export enum AppType {
  UpdatedSystem = 'updated-system',
  System = 'system',
  UserInstalled = 'user-installed',
}

export const whiteList = [
  'com.android.chrome', // Browser Chrome
  'com.google.android.youtube', // Youtube
  'com.google.android.apps.messaging', // Messages
  'com.android.dialer', // Phone
  'com.android.camera', // Camera
  'com.android.camera2', // Camera
  'com.android.vending', // Google Play Store
  'com.google.android.gm', // Gmail
];

export const blackList = ['com.Employee Management App'];
