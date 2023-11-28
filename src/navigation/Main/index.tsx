import React, { useEffect } from 'react';

import notifee from '@notifee/react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { BottomTabBar } from '#components';
import { Tab } from '#components/BottomTabBar/BottomTab';

import { DEFAULT_STACK_OPTIONS } from '#navigation/config';
import { ModalsRoutes } from '#navigation/Modals/types';
import { AppParamList, AppRoutes } from '#navigation/types';

import { useGetChatsQuery } from '#api/controllers/Messages';

import ToastManager from '#services/ToastManager';
import Tracker from '#services/Tracker';

import { useSelector } from '#store';
import { ChatsSelectors } from '#store/slices/chats';

import StackChats from './Chats';
import StackObject from './Objects';
import StackSchedule from './Schedule';
import StackTasks from './Tasks';
import { MainParamList, MainRoutes } from './types';
import StackUser from './User';

const Main = createBottomTabNavigator<MainParamList>();

const StackMain = (): React.ReactElement => {
  useGetChatsQuery();

  const navigation =
    useNavigation<NavigationProp<AppParamList & MainParamList>>();
  const chats = useSelector(ChatsSelectors.selectAll);
  const permissionRequested = useSelector(
    store => store.app.permissionsRequested,
  );

  const unreadMessages = chats.reduce(
    (acc, el) => acc + (el?.count_unread || 0),
    0,
  );

  const tabs: Tab[] = [
    {
      onPress: () => {
        navigation.navigate(MainRoutes.User);
      },
      label: 'Профиль',
      screenName: MainRoutes.User,
      iconName: 'profile',
    },
    {
      onPress: () => {
        navigation.navigate(MainRoutes.Objects);
      },
      label: 'Объекты',
      screenName: MainRoutes.Objects,
      iconName: 'objects',
    },
    {
      onPress: () => {
        navigation.navigate(MainRoutes.Schedule);
      },
      label: 'График',
      screenName: MainRoutes.Schedule,
      iconName: 'timer',
    },
    {
      onPress: () => {
        navigation.navigate(MainRoutes.Tasks);
      },
      label: 'Задачи',
      screenName: MainRoutes.Tasks,
      iconName: 'tasks',
    },
    {
      onPress: () => {
        navigation.navigate(MainRoutes.Chats);
      },
      label: 'Чаты',
      screenName: MainRoutes.Chats,
      iconName: 'chat',
      amount: unreadMessages,
    },
  ];

  useEffect(() => {
    notifee.setBadgeCount(unreadMessages);
  }, [unreadMessages]);

  useEffect(() => {
    !permissionRequested &&
      setTimeout(
        () =>
          navigation.navigate(AppRoutes.StackModals, {
            screen: ModalsRoutes.Dialog,
            params: {
              declineButtonProps: {
                children: 'нет',
                onPress: _navigation => _navigation.goBack(),
              },
              confirmButtonProps: {
                children: 'Да',
                onPress: async _navigation => {
                  try {
                    const res = await Tracker.requestPermissions();

                    if (res) {
                      ToastManager.success('Все разрешения успешно получены!');
                      navigation.goBack();
                    }
                  } catch (e) {}
                },
              },
              title: 'Выдача разрешений',
              text: 'Для функционала автоматического запуска и остановки рабочего дня нужно разрешение для доступа к местоположению в фоновом режиме. Так же необходимо разрешение на отслеживание физической активности для учета шагов. Запросить разрешения?',
            },
          }),
        1000,
      );
  }, []);
  return (
    <Main.Navigator
      initialRouteName={MainRoutes.Schedule}
      screenOptions={DEFAULT_STACK_OPTIONS}
      tabBar={({ state }) => (
        <BottomTabBar
          focusIndex={state.index}
          tabs={tabs}
        />
      )}
    >
      <Main.Screen
        component={StackUser}
        name={MainRoutes.User}
      />
      <Main.Screen
        component={StackObject}
        name={MainRoutes.Objects}
      />
      <Main.Screen
        component={StackSchedule}
        name={MainRoutes.Schedule}
      />
      <Main.Screen
        component={StackTasks}
        name={MainRoutes.Tasks}
      />
      <Main.Screen
        component={StackChats}
        name={MainRoutes.Chats}
      />
    </Main.Navigator>
  );
};

export default StackMain;
