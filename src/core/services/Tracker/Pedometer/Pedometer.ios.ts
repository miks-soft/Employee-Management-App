import { Alert, Linking } from 'react-native';

import { Pedometer as ExpoPedometer } from 'expo-sensors';

import { axiosBaseQuery } from '#api';

import DateFormatter, { DateTimeFormats } from '#services/formatters/Date';

import Debug from '#utils/debug';

import { store } from '#store';
class Pedometer {
  static start() {}

  static end() {}

  static pause() {}

  static done() {}

  static async requestPermissionsWithFallbackAlert() {
    const permissions = await ExpoPedometer.requestPermissionsAsync();

    if (permissions.status !== 'granted') {
      Alert.alert(
        'Внимание',
        'Для работы корректной работы приложения необходимо разрешение на считывание физической активности.',
        [
          {
            text: 'В настройки',
            onPress: () => Linking.openSettings(),
          },
          {
            text: 'Назад',
            onPress: () => {},
          },
        ],
      );
    }

    return permissions.status as 'granted' | undefined;
  }

  static async requestPermissions() {
    return ExpoPedometer.requestPermissionsAsync() as unknown as
      | 'granted'
      | undefined;
  }

  static async collect(fromDateISO: string, toDateISO: string) {
    try {
      const { steps } = await ExpoPedometer.getStepCountAsync(
        new Date(fromDateISO),
        new Date(toDateISO),
      );

      Debug.notification(
        `Шагов за период с ${DateFormatter.format(
          new Date(fromDateISO),
          DateTimeFormats.timeOnlyShort,
        )} по ${DateFormatter.format(
          new Date(toDateISO),
          DateTimeFormats.timeOnlyShort,
        )}: ${steps}`,
      );

      const { project } = store.getState().tracker;

      axiosBaseQuery({
        url: '/steps',
        method: 'post',
        data: {
          data: [
            {
              date_from: new Date(fromDateISO).toISOString(),
              date_to: new Date(toDateISO).toISOString(),
              count: steps,
              //workaround for be
              vacancy_id: project?.id,
              latitude: project?.lat,
              longitude: project?.lng,
            },
          ],
        },
      });
    } catch {}
  }
}

export default Pedometer;
