import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { Icon, LineWrapper, H4, H3 } from '#ui-kit';

import {
  EnumObjectPossibleWorkdays,
  MapEnumObjectPossibleWorkaysToShortText,
} from '#config/enums';

import { colors } from '#styles';

import { DTOObject } from '#generated/types';

const _Object: React.FC<
  Partial<{
    containerStyle: StyleProp<ViewStyle>;
    item: DTOObject;
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
        <H4>
          Ставка: <H4 weight="600">{item?.payment}</H4>
        </H4>
        <H4>
          Период:{' '}
          <H4 weight="600">
            {item?.start_work} - {item?.end_work}
          </H4>
        </H4>
        <H4>
          Период:{' '}
          <H4 weight="600">
            {item?.workday_start} - {item?.workday_end}
          </H4>
        </H4>

        <View style={styles.schedule}>
          <H4 weight="400">Чет.: </H4>
          <View style={styles.scheduleDays}>
            {Object.values(EnumObjectPossibleWorkdays).map(dayKey => (
              <H4
                key={dayKey}
                color={
                  item?.even_week[dayKey]
                    ? colors.grayscale.__0
                    : colors.grayscale.__20
                }
                weight={item?.even_week[dayKey] ? '600' : '400'}
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
                  item?.odd_week[dayKey]
                    ? colors.grayscale.__0
                    : colors.grayscale.__20
                }
                weight={item?.odd_week[dayKey] ? '600' : '400'}
              >
                {MapEnumObjectPossibleWorkaysToShortText[dayKey]}
              </H4>
            ))}
          </View>
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
  schedule: {
    flexDirection: 'row',
  },
  scheduleDays: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default React.memo(_Object);
