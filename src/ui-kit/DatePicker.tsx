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

import Icon from './Icon';
import { H4 } from './Text';

export interface IDatePicker {
  onSet?: (value?: Date) => void;
  date?: Date;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  pickerProps: Omit<DatePickerProps, 'date'>;
  modalTitle?: string;
}

const DatePicker: React.FC<IDatePicker> = ({
  date,
  onSet = () => {},
  style,
  disabled = false,
  modalTitle = 'Выберите дату',
  pickerProps,
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
              mode: 'date',
              ...pickerProps,
            },
            onConfirm: onSet,
            title: modalTitle,
          },
        });
      }}
    >
      <H4 style={styles.text}>
        {date ? DateFormatter.format(date, DateTimeFormats.dateOnlyDots) : ''}
      </H4>
      <Icon
        name="calendar"
        size={20}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 34,
    minWidth: 110,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.main.normal,
    borderRadius: 4,
    backgroundColor: colors.grayscale.__100,
  },
  text: {
    paddingRight: 28,
  },
  icon: {
    position: 'absolute',
    right: 8,
  },
});

export default DatePicker;
