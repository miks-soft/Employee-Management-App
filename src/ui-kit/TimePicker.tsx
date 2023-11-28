import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { NavigationProp, useNavigation } from '@react-navigation/native';

import { DatePickerProps } from 'react-native-date-picker';

import { ModalsRoutes } from '#navigation/Modals/types';
import { AppParamList, AppRoutes } from '#navigation/types';

import DateFormatter, { DateTimeFormats } from '#services/formatters/Date';

import { colors } from '#styles';

import { H4 } from './Text';

export interface ITimePicker {
  onSet: (value?: Date) => void;
  date: Date;
  style: StyleProp<ViewStyle>;
  disabled: boolean;
  pickerProps: Omit<DatePickerProps, 'date'>;
  modalTitle: string;
}

const TimePicker: React.FC<Partial<ITimePicker>> = ({
  date,
  onSet = () => {},
  style,
  disabled = false,
  modalTitle = 'Выберите время',
  pickerProps = {},
}) => {
  const navigation = useNavigation<NavigationProp<AppParamList>>();

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, StyleSheet.flatten(style)]}
      onPress={() => {
        navigation.navigate(AppRoutes.StackModals, {
          screen: ModalsRoutes.DateTimePicker,
          params: {
            pickerProps: {
              date: date ?? new Date(),
              mode: 'time',
              ...pickerProps,
            },
            onConfirm: onSet,
            title: modalTitle,
          },
        });
      }}
    >
      <H4>
        {date ? DateFormatter.format(date, DateTimeFormats.timeOnlyShort) : ''}
      </H4>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 30,
    minWidth: 46,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.main.normal,
    borderRadius: 4,
    backgroundColor: colors.grayscale.__100,
  },
});

export default TimePicker;
