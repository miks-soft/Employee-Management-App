import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import {
  Checkbox,
  H3,
  H4,
  Header,
  LineWrapper,
  Loader,
  TimePicker,
} from '#ui-kit';
import Switch from '#ui-kit/Switch';

import { colors } from '#styles';

import { ViewProps } from '.';
import {
  MapNotificationActivityTypesToText,
  NotificationActivityTypes,
} from './types';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <Header
        containerStyle={styles.header}
        rightIcon={
          props.isLoading ? (
            <Loader />
          ) : (
            <TouchableOpacity onPress={props.onUpdateUserNotification}>
              <H3 color={colors.main.normal}>Сохранить</H3>
            </TouchableOpacity>
          )
        }
        title="Изменение уведомлений"
        onPressLeft={() => props.navigation.goBack()}
      />
      <LineWrapper
        haveTopBorder
        style={styles.block}
      >
        <View style={styles.blockHeader}>
          <H3>Уведомления</H3>
          <Switch
            value={props.notificationsActive}
            onChange={props.setNotificationsActive}
          />
        </View>
        {props.notificationsActive && (
          <>
            <View style={styles.main}>
              <H4>Получать уведомления с</H4>
              <TimePicker
                date={props.notificationActivityStartTime}
                pickerProps={{
                  maximumDate: props.notificationActivityEndTime,
                }}
                onSet={props.setNotificationActivityStartTime}
              />
              <H4>до</H4>
              <TimePicker
                date={props.notificationActivityEndTime}
                pickerProps={{
                  minimumDate: props.notificationActivityStartTime,
                }}
                onSet={props.setNotificationActivityEndTime}
              />
            </View>
            <View style={styles.options}>
              {Object.values(NotificationActivityTypes).map(type => (
                <TouchableOpacity
                  key={type}
                  style={styles.option}
                  onPress={() => props.setNotificationsType(type)}
                >
                  <Checkbox value={props.notificationsType === type} />
                  <H4>{MapNotificationActivityTypesToText[type]}</H4>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </LineWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  block: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  main: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  header: {
    marginBottom: 16,
  },
  blockHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  options: {
    marginTop: 8,
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default Layout;
