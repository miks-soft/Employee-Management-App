import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Button, H4, H5, Header, LineWrapper, Loader, Text } from '#ui-kit';
import moment from 'moment';

import { ScheduleRoutes } from '#navigation/Main/Schedule/types';
import { MainRoutes } from '#navigation/Main/types';
import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import DateFormatter, { DateTimeFormats } from '#services/formatters/Date';
import ToastManager from '#services/ToastManager';
import Tracker from '#services/Tracker';

import {
  EnumTrackerStatus,
  MapEnumTrackerStatusToColor,
  MapEnumTrackerStatusToText,
} from '#config/enums';

import { prettifyTime } from '#utils';

import { colors } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  if (!props.project) {
    return <Loader fullscreen />;
  }

  return (
    <View style={styles.container}>
      <Header
        title={props.project.title}
        onPressLeft={() => {
          if (EnumTrackerStatus.READY === props.status) {
            props.navigation.replace(ScheduleRoutes.List);
          } else {
            props.navigation.navigate(AppRoutes.StackModals, {
              screen: ModalsRoutes.Dialog,
              params: {
                title: 'Внимание!',
                text: 'Для переключения на другой проект, сначала остановите учет времени на данном проекте.',
                confirmButtonProps: {
                  children: 'Завершить работу',
                  async onPress(navigation, modal) {
                    try {
                      await Tracker.end();
                      modal.closeWithoutGoBack();
                      navigation.replace(AppRoutes.StackMain, {
                        screen: MainRoutes.Schedule,
                        params: {
                          screen: ScheduleRoutes.List,
                        },
                      });
                    } catch (e) {
                      //@ts-expect-error
                      ToastManager.error(e.error.data.errors);
                    }
                  },
                },
                declineButtonProps: {
                  children: 'Назад',
                  onPress(navigation, modal) {
                    modal.close();
                  },
                },
              },
            });
          }
        }}
      />
      <LineWrapper style={styles.main}>
        <H5
          color={colors.grayscale.__40}
          style={styles.today}
        >
          {DateFormatter.format(new Date(), DateTimeFormats.dateOnlyDots)}
        </H5>
        <View style={styles.schedule}>
          <View style={styles.row}>
            <H4 style={styles.col1}>График: </H4>
            <H4
              style={styles.col2}
              weight="600"
            >
              {props.project?.workday_start} - {props.project?.workday_end}
            </H4>
            <H4
              style={styles.col3}
              weight="600"
            >
              {prettifyTime(
                moment
                  .utc(
                    moment
                      .duration(props.project?.work_time, 'minutes')
                      .asMilliseconds(),
                  )
                  .format('HH:mm'),
              )}
            </H4>
          </View>

          <View style={styles.row}>
            <H4 style={styles.col1}>Перерыв: </H4>
            <H4
              style={styles.col2}
              weight="600"
            >
              {props.project?.dinner_start} - {props.project?.dinner_end}
            </H4>
            <H4
              style={styles.col3}
              weight="600"
            >
              {prettifyTime(
                moment
                  .utc(
                    moment
                      .duration(props.project.dinner_time, 'minutes')
                      .asMilliseconds(),
                  )
                  .format('HH:mm'),
              )}
            </H4>
          </View>
        </View>
        <View>
          <View style={styles.row}>
            <H4 style={styles.col4}>Общее время перерыва: </H4>
            <H4 weight="600">
              {moment.utc(props.pauseTimer || 0).format('HH:mm:ss')}
            </H4>
          </View>
        </View>

        <View>
          <View style={styles.row}>
            <H4 style={styles.col4}>Учет времени: </H4>
            <H4
              color={MapEnumTrackerStatusToColor[props.status]}
              style={styles.col3}
              weight="600"
            >
              {MapEnumTrackerStatusToText[props.status]}
            </H4>
          </View>
        </View>
      </LineWrapper>
      <LineWrapper style={styles.timerLine}>
        <View style={styles.timerTextContainer}>
          <Text
            color={MapEnumTrackerStatusToColor[props.status]}
            lineHeight={48}
            size={36}
            weight="600"
          >
            {moment.utc(props.timer || 0).format('HH:mm:ss')}
          </Text>
          <View style={styles.loaderWrapper}>
            <View style={styles.loaderContainer}>
              {props.isTimerLoading && <Loader />}
            </View>
          </View>
        </View>
      </LineWrapper>
      <View style={styles.footer}>
        {EnumTrackerStatus.READY === props.status ? (
          <Button
            isLoading={props.isStarting}
            onPress={props.onStart}
          >
            Начать работу
          </Button>
        ) : (
          <>
            <Button
              isLoading={props.isEnding}
              style={styles.button}
              type="secondary"
              onPress={props.onEnd}
            >
              Завершить работу
            </Button>

            <Button
              isLoading={
                props.status === EnumTrackerStatus.ACTIVE
                  ? props.isPausing
                  : props.isStarting
              }
              style={styles.button}
              onPress={
                props.status === EnumTrackerStatus.ACTIVE
                  ? props.onPause
                  : props.onStart
              }
            >
              {props.status === EnumTrackerStatus.ACTIVE
                ? 'Сделать перерыв'
                : 'Продолжить работу'}
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.grayscale.__100,
  },
  loaderWrapper: {
    position: 'absolute',
    right: -6,
  },
  loaderContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  today: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  col1: {
    minWidth: '17.5%',
  },
  col2: {
    minWidth: '25%',
  },
  col3: {
    minWidth: '20%',
  },
  col4: {
    minWidth: '31%',
  },
  main: {
    flexDirection: 'column',
    paddingVertical: 24,
    gap: 12,
  },
  schedule: {
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 16,
  },
  timerLine: {
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
  },
  timerTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
});

export default Layout;
