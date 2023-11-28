import { Alert, NativeModules } from 'react-native';

import { axiosBaseQuery } from '#api';

import Crashlytics from '#services/Crashlytics';
import DateFormatter, { DateTimeFormats } from '#services/formatters/Date';

import { IS_IOS } from '#styles';

import { whiteList, blackList, AppType, EventType } from './config';

const UsageStats = NativeModules.UsageStats;

interface IEvent {
  packageName: string;
  appName: string;
  appType: string;
  timeStamp: number;
  eventType: number;
}

interface IAppActivity {
  count: number;
  name: string;
  package: string;
  pendingLaunchEvent?: IEvent;
}

class AppActivity {
  static _getUsageEventList = (beginTime: number, endTime: number) => {
    return new Promise<IEvent[]>((resolve, reject) => {
      UsageStats.getUsageEventList(
        beginTime,
        endTime,
        (usageEvent: { success: boolean; events: IEvent[] }) => {
          if (usageEvent.success) {
            resolve(usageEvent.events);
          } else {
            reject(null);
          }
        },
      );
    });
  };

  static reduceEvents = (events: IEvent[]) => {
    let aggregatedEventsMap: { [key in string]: IAppActivity } = {};

    events.forEach(event => {
      const aggregatedEvent = aggregatedEventsMap[event.packageName];

      const isLaunchEvent = event.eventType === EventType.RESUMED;
      const isStopEvent = [EventType.PAUSED, EventType.STOPPED].includes(
        event.eventType,
      );

      if (!aggregatedEvent) {
        if (isLaunchEvent) {
          aggregatedEventsMap[event.packageName] = {
            package: event.packageName,
            name: event.appName,
            count: 0,
            pendingLaunchEvent: event,
          };
        }
        return;
      }

      if (isLaunchEvent) {
        aggregatedEvent.pendingLaunchEvent = event;
      }

      if (isStopEvent && aggregatedEvent.pendingLaunchEvent) {
        aggregatedEvent.count +=
          Math.round(
            event.timeStamp - aggregatedEvent.pendingLaunchEvent.timeStamp,
          ) / 1000;
        aggregatedEvent.pendingLaunchEvent = undefined;
      }
    });

    Object.values(aggregatedEventsMap).forEach(el => {
      const aggregatedEvent = aggregatedEventsMap[el.package];

      if (aggregatedEvent.pendingLaunchEvent) {
        aggregatedEvent.count =
          (Date.now() - aggregatedEvent.pendingLaunchEvent.timeStamp) / 1000;
        aggregatedEvent.pendingLaunchEvent = undefined;
      }

      aggregatedEvent.count = Math.round(aggregatedEvent.count);
    });

    return Object.values(aggregatedEventsMap);
  };

  static async getEvents(
    startDateISO: string | number,
    endDateISO: string | number,
  ) {
    const beginApproximateDate = new Date(startDateISO);
    beginApproximateDate.setHours(0);
    beginApproximateDate.setMinutes(0);

    const endApproximateTime = new Date(endDateISO);
    endApproximateTime.setFullYear(endApproximateTime.getFullYear() + 1);

    Crashlytics.log(
      '[APP_ACtivity] start',
      `${beginApproximateDate.getTime()}`,
      `${endApproximateTime.getTime()}`,
    );
    const events = await this._getUsageEventList(
      beginApproximateDate.getTime(),
      endApproximateTime.getTime(),
    );
    const startDateTimestamp = new Date(startDateISO).getTime();
    const endDateTimestamp = new Date(endDateISO).getTime();

    Crashlytics.log(
      '[APP-ACITIVTY] filtered events',
      `${startDateTimestamp}`,
      `${endDateTimestamp}`,
    );

    Crashlytics.log(
      'All events',
      `${JSON.stringify(
        events.map(el => ({
          timestamp: DateFormatter.format(
            new Date(el.timeStamp).toISOString(),
            DateTimeFormats.timeOnlyShort,
          ),
          appName: el.appName,
        })),
      )}`,
    );

    Crashlytics.log(
      'filtered',
      `${JSON.stringify(
        events
          .filter(
            event =>
              event.timeStamp >= startDateTimestamp &&
              event.timeStamp <= endDateTimestamp,
          )
          .map(el => ({
            timestamp: DateFormatter.format(
              new Date(el.timeStamp).toISOString(),
              DateTimeFormats.timeOnlyShort,
            ),
            appName: el.appName,
          })),
      )}`,
    );

    return this.reduceEvents(
      events.filter(
        event =>
          event.timeStamp >= startDateTimestamp &&
          event.timeStamp <= endDateTimestamp &&
          (event.appType === AppType.UserInstalled ||
            whiteList.includes(event.packageName)) &&
          !blackList.includes(event.packageName),
      ),
    );
  }

  static async requestPermissionsWithAlertFallback() {
    if (IS_IOS) {
      return true;
    }

    return new Promise(async resolve => {
      const havePermissions = await UsageStats.checkPermission();

      if (!havePermissions) {
        Alert.alert(
          'Внимание',
          'Для работы приложения необходимо специальное разрешение. Перейти в настройки?',
          [
            {
              text: 'В настройки',
              onPress: () => {
                resolve('');
                UsageStats.requestPermission();
              },
            },
            {
              text: 'Назад',
              onPress: () => resolve(''),
            },
          ],
        );
      }

      resolve(havePermissions);
    });
  }

  static async collect(
    fromDateISO: string | number,
    toDateISO = new Date().toISOString() as string | number,
  ) {
    const events = await this.getEvents(fromDateISO, toDateISO);

    Crashlytics.log(
      '[APP-ACITIVTY] payload,',
      `${fromDateISO}`,
      `${toDateISO}`,
      `${JSON.stringify(events)}`,
    );
    await axiosBaseQuery({
      url: '/activity-times',
      method: 'post',
      data: {
        activities: [
          {
            date: DateFormatter.format(
              fromDateISO as string,
              DateTimeFormats.dateOnlyHyphen,
            ),
            apps: events,
          },
        ],
      },
    });
  }
}

export default AppActivity;
