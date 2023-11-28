import React, { useState } from 'react';

import moment from 'moment';

import { UserRoutes, UserScreenProps } from '#navigation/Main/User/types';

import { useGetCurrentUserQuery } from '#api/controllers/Auth';
import { useUpdateUserNotificationMutation } from '#api/controllers/User';

import DateFormatter, { DateTimeFormats } from '#services/formatters/Date';
import ToastManager from '#services/ToastManager';

import useErrorHandler from '#hooks/utils/useErrorHandler';

import { animateDecorator } from '#utils';

import Layout from './layout';
import { NotificationActivityTypes } from './types';

type NavigationProps = UserScreenProps<UserRoutes.NotificationSettings>;

const Container: React.FC<NavigationProps> = props => {
  const currentUserQuery = useGetCurrentUserQuery();
  const [updateUserNotification, updateUserNotificationMeta] =
    useUpdateUserNotificationMutation();

  const [notificationActivityStartTime, setNotificationActivityStartTime] =
    useState<Date | undefined>(
      moment(currentUserQuery.data?.notification_from, 'HH:mm:ss')
        .day(1)
        .month(1)
        .year(2022)
        .toDate(),
    );

  const [notificationActivityEndTime, setNotificationActivityEndTime] =
    useState<Date | undefined>(
      moment(currentUserQuery.data?.notification_to, 'HH:mm:ss')
        .day(1)
        .month(1)
        .year(2022)
        .toDate(),
    );

  const [notificationsActive, setNotificationsActive] = useState(
    !!currentUserQuery.data?.notification,
  );

  const [notificationsType, setNotifcationsType] = useState(
    currentUserQuery?.data?.notification_type as NotificationActivityTypes,
  );

  const onUpdateUserNotification = async () => {
    try {
      await updateUserNotification({
        data: {
          notification: notificationsActive,
          notification_from: DateFormatter.format(
            notificationActivityStartTime!,
            DateTimeFormats.timeOnlyFull,
          ),
          notification_to: DateFormatter.format(
            notificationActivityEndTime!,
            DateTimeFormats.timeOnlyFull,
          ),
          notification_type: notificationsType,
        },
      }).unwrap();

      ToastManager.success('Настройки уведомлений успешно изменены!');

      props.navigation.goBack();
    } catch {}
  };

  useErrorHandler(() => {}, updateUserNotificationMeta);

  return (
    <Layout
      /**
       *Options
       */
      isLoading={updateUserNotificationMeta.isLoading}
      notificationActivityEndTime={notificationActivityEndTime}
      notificationActivityStartTime={notificationActivityStartTime}
      notificationsActive={notificationsActive}
      notificationsType={notificationsType}
      /**
       *Methods
       */
      onUpdateUserNotification={onUpdateUserNotification}
      setNotificationActivityEndTime={setNotificationActivityEndTime}
      setNotificationActivityStartTime={setNotificationActivityStartTime}
      setNotificationsActive={animateDecorator(setNotificationsActive)}
      setNotificationsType={setNotifcationsType}
      {...props}
    />
  );
};

type PassingStates = {
  notificationActivityStartTime?: Date;
  notificationActivityEndTime?: Date;
  notificationsActive: boolean;
  notificationsType: NotificationActivityTypes;
};

type PassingProps = {
  isLoading: boolean;
  onUpdateUserNotification: () => {};
};

export type ViewProps = NavigationProps &
  PassingStates &
  getSetStateProps<PassingStates> &
  PassingProps;

export default Container;
