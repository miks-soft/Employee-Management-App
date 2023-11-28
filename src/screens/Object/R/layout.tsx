import React from 'react';
import { View, StyleSheet } from 'react-native';

import { H3, H4, Header, Icon, LineWrapper, Loader } from '#ui-kit';

import { ObjectRoutes } from '#navigation/Main/Objects/types';

import {
  MapEnumObjectPossibleWorkaysToShortText,
  EnumObjectPossibleWorkdays,
} from '#config/enums';

import { prettifyTime } from '#utils';

import { colors } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <Header
        title={props.object?.title}
        onPressLeft={props.navigation.goBack}
      />

      {props.isLoading ? (
        <Loader fullscreen />
      ) : (
        <>
          <LineWrapper
            haveTopBorder
            style={styles.info}
          >
            <H4>
              Ставка: <H4 weight="600">{props.object?.payment}</H4>
            </H4>
            <H4>
              Период:{' '}
              <H4 weight="600">
                {props.object?.start_work} - {props.object?.end_work}
              </H4>
            </H4>
            <H4>
              Период:{' '}
              <H4 weight="600">
                {props.object?.workday_start} - {props.object?.workday_end}
              </H4>
            </H4>

            <View style={styles.schedule}>
              <H4 weight="400">Чет.: </H4>
              <View style={styles.scheduleDays}>
                {Object.values(EnumObjectPossibleWorkdays).map(dayKey => (
                  <H4
                    key={dayKey}
                    color={
                      props.object?.even_week[dayKey]
                        ? colors.grayscale.__0
                        : colors.grayscale.__20
                    }
                    weight={props.object?.even_week[dayKey] ? '600' : '400'}
                  >
                    {MapEnumObjectPossibleWorkaysToShortText[dayKey]}
                  </H4>
                ))}
              </View>
            </View>

            <View style={styles.schedule}>
              <H4 weight="400">Нечет.: </H4>
              <View style={styles.scheduleDays}>
                {Object.values(EnumObjectPossibleWorkdays).map(dayKey => (
                  <H4
                    key={dayKey}
                    color={
                      props.object?.odd_week[dayKey]
                        ? colors.grayscale.__0
                        : colors.grayscale.__20
                    }
                    weight={props.object?.odd_week[dayKey] ? '600' : '400'}
                  >
                    {MapEnumObjectPossibleWorkaysToShortText[dayKey]}
                  </H4>
                ))}
              </View>
            </View>

            {props.object && 'description' in props.object && (
              <View style={styles.description}>
                <H4 weight="400">Описание:</H4>
                <H4 weight="600">{props.object?.description}</H4>
              </View>
            )}
          </LineWrapper>

          {props.object &&
            'average_time' in props.object &&
            prettifyTime(props.object?.average_time) && (
              <LineWrapper
                haveTopBorder
                containerStyle={styles.timeTrackingContainer}
                style={styles.timeTracking}
                onPress={() =>
                  props.navigation.navigate(ObjectRoutes.TrackedTime, {
                    id: props.object?.id!,
                  })
                }
              >
                <View style={styles.timeTrackingHeader}>
                  <H3 weight="600">Учет времени</H3>
                  <Icon
                    height={12}
                    name="chevron-right-marginless"
                    width={6}
                  />
                </View>
                <View style={styles.timeTrackingMain}>
                  <H4>Среднее время работы за день: </H4>
                  <View style={styles.timeTrackingTimeLine}>
                    <H4 weight="600">
                      {prettifyTime(props.object?.average_time)}
                    </H4>
                    {!props.object?.disable_time_check && (
                      <Icon
                        color={
                          props.object?.average_time! <
                          props.object?.planned_time!
                            ? colors.error
                            : colors.success
                        }
                        name="timer"
                      />
                    )}
                  </View>
                </View>
              </LineWrapper>
            )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeTracking: {
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  timeTrackingContainer: {
    marginTop: 24,
  },
  timeTrackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeTrackingMain: {
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 4,
  },
  timeTrackingTimeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  info: {
    flexDirection: 'column',
    gap: 4,
  },
  description: {
    marginTop: 12,
  },
  schedule: {
    flexDirection: 'row',
  },
  scheduleDays: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default Layout;
