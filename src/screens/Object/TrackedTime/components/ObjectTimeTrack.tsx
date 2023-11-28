import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { Icon, LineWrapper, H4, H3 } from '#ui-kit';

import { prettifyTime } from '#utils';

import { colors } from '#styles';

import { DTOObjectTimeTrack } from '#generated/types';

const _Object: React.FC<
  Partial<{
    containerStyle: StyleProp<ViewStyle>;
    item: DTOObjectTimeTrack;
    haveTopBorder: boolean;
    onPress: () => void;
  }>
> = ({ containerStyle, item, onPress }) => {
  return (
    <LineWrapper
      style={[styles.container, StyleSheet.flatten(containerStyle)]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <H3>{item?.date}</H3>
      </View>
      <View style={styles.main}>
        <H4>
          План: <H4 weight="600">{prettifyTime(item?.planned_time)}</H4>
        </H4>
        <View style={styles.trackedTimeLine}>
          <H4>
            Факт:{' '}
            <H4 weight="600">
              {prettifyTime(item?.tracked_time) || '0 минут'}
            </H4>
          </H4>
          {prettifyTime(item?.tracked_time) && (
            <Icon
              color={
                item?.tracked_time! < item?.planned_time!
                  ? colors.error
                  : colors.success
              }
              name="timer"
            />
          )}
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
  main: {
    marginTop: 12,
    gap: 4,
  },
  trackedTimeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

export default React.memo(_Object);
