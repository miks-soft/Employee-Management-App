import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { Icon, LineWrapper, H4, H3 } from '#ui-kit';
import moment from 'moment';

import { prettifyTime } from '#utils';

import { DTOProjectSchedule } from '#generated/types';

const _ProjectSchedule: React.FC<
  Partial<{
    containerStyle: StyleProp<ViewStyle>;
    item: DTOProjectSchedule;
    onPress: () => void;
  }>
> = ({ containerStyle, item, onPress }) => {
  return (
    <LineWrapper
      style={[styles.container, StyleSheet.flatten(containerStyle)]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <H3>{item?.title}</H3>
        <Icon
          height={12}
          name="chevron-right-marginless"
          width={6}
        />
      </View>

      <View style={styles.main}>
        <View style={styles.row}>
          <H4 style={styles.col1}>График: </H4>
          <H4
            style={styles.col2}
            weight="600"
          >
            {item?.workday_start} - {item?.workday_end}
          </H4>
          <H4
            style={styles.col3}
            weight="600"
          >
            {prettifyTime(
              moment
                .utc(
                  moment.duration(item?.work_time, 'minutes').asMilliseconds(),
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
            {item?.dinner_end} - {item?.dinner_start}
          </H4>
          <H4
            style={styles.col3}
            weight="600"
          >
            {prettifyTime(
              moment
                .utc(
                  moment
                    .duration(item?.dinner_time, 'minutes')
                    .asMilliseconds(),
                )
                .format('HH:mm'),
            )}
          </H4>
        </View>
      </View>
    </LineWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
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
  main: {
    marginTop: 12,
    gap: 4,
  },
});

export default React.memo(_ProjectSchedule);
