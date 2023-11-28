import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

import { Icon, LineWrapper, H3, Loader, Radio } from '#ui-kit';

import {
  useMarkTaskAsDoneMutation,
  useMarkTaskAsUndoneMutation,
} from '#api/controllers/Tasks';

import DateFormatter, { DateTimeFormats } from '#services/formatters/Date';

import { EnumTaskStatus } from '#config/enums';

import useErrorHandler from '#hooks/utils/useErrorHandler';

import { hitSlop } from '#styles';

import { DTOTask } from '#generated/types';

const Task: React.FC<
  Partial<{
    containerStyle: StyleProp<ViewStyle>;
    item: DTOTask;
    onPress: () => void;
  }>
> = ({ containerStyle, item, onPress }) => {
  const [markTaskAsDone, markTaskAsDoneMeta] = useMarkTaskAsDoneMutation();
  const [markTaskAsUndone, markTaskAsUndoneMeta] =
    useMarkTaskAsUndoneMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(item?.status as EnumTaskStatus);

  const onCheck = async () => {
    setIsLoading(true);
    try {
      if (status === EnumTaskStatus.UNDONE) {
        await markTaskAsDone({
          path: {
            id: item?.id!,
          },
        });
        setStatus(EnumTaskStatus.DONE);
      }

      if (status === EnumTaskStatus.DONE) {
        await markTaskAsUndone({
          path: {
            id: item?.id!,
          },
        });
        setStatus(EnumTaskStatus.UNDONE);
      }
    } catch {}
    setIsLoading(false);
  };

  useErrorHandler(() => {}, markTaskAsDoneMeta);
  useErrorHandler(() => {}, markTaskAsUndoneMeta);

  useEffect(() => {
    setStatus(item?.status!);
  }, [item?.status]);

  return (
    <LineWrapper
      style={[styles.container, StyleSheet.flatten(containerStyle)]}
      onPress={onPress}
    >
      <View style={styles.title}>
        <TouchableOpacity
          disabled={isLoading}
          onPress={onCheck}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <Radio
              hitSlop={hitSlop}
              value={status === EnumTaskStatus.DONE}
            />
          )}
        </TouchableOpacity>
        <H3
          style={
            status === EnumTaskStatus.DONE ? styles.doneTaskTitle : undefined
          }
          weight="400"
        >
          {DateFormatter.format(
            item?.start_date!,
            DateTimeFormats.timeOnlyShort,
          )}{' '}
          <H3>{item?.name}</H3>{' '}
        </H3>
      </View>
      <Icon
        height={12}
        name="chevron-right-marginless"
        width={6}
      />
    </LineWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doneTaskTitle: {
    textDecorationLine: 'line-through',
  },
});

export default React.memo(Task);
