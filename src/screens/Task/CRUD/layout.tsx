import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import {
  H3,
  H4,
  Header,
  Icon,
  LineButton,
  LineWrapper,
  Loader,
  NoDataError,
  Radio,
} from '#ui-kit';

import { TapKeyboardDismissArea } from '#components';

import { ModalsRoutes, SelectModalParams } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import DateFormatter, { DateTimeFormats } from '#services/formatters/Date';

import { EnumTaskStatus } from '#config/enums';

import { colors } from '#styles';

import { DTOProject } from '#generated/types';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const isEdit = !!props.route.params.editableTask?.id;
  const isSaveEnabled = props.taskName && props.selectedProject?.project_id;

  return (
    <View style={styles.container}>
      <TapKeyboardDismissArea />
      <Header
        rightIcon={
          props.isCreating || props.isUpdating ? (
            <Loader />
          ) : (
            <TouchableOpacity
              disabled={!isSaveEnabled}
              onPress={isEdit ? props.onUpdate : props.onCreate}
            >
              <H3
                color={
                  isSaveEnabled ? colors.main.normal : colors.grayscale.__60
                }
              >
                {isEdit ? 'Редактировать' : 'Сохранить'}
              </H3>
            </TouchableOpacity>
          )
        }
        title="Задачи"
        onPressLeft={() => props.navigation.goBack()}
      />

      <LineWrapper style={styles.row}>
        {isEdit && (
          <Radio
            disabled={!isEdit}
            value={props.status === EnumTaskStatus.DONE}
            onChange={() =>
              props.setStatus(old =>
                old === EnumTaskStatus.DONE
                  ? EnumTaskStatus.UNDONE
                  : EnumTaskStatus.DONE,
              )
            }
          />
        )}
        <TextInput
          multiline={true}
          placeholder="Введите название задачи"
          placeholderTextColor={colors.grayscale.__20}
          style={styles.taskNameInput}
          value={props.taskName}
          onChangeText={props.setTaskName}
        />
      </LineWrapper>

      <LineWrapper
        style={styles.row}
        onPress={() =>
          props.navigation.navigate(AppRoutes.StackModals, {
            screen: ModalsRoutes.Select,
            params: {
              title: 'Выберите проект',
              data: props.projects!,
              keyExtractor: item => item.project_id,
              checkedExtractor: (item, currentItem) =>
                item.project_id === currentItem?.project_id,
              renderItem: item => (
                <H3 style={styles.project}>{item.project_title}</H3>
              ),
              onSelectionEnd: props.setSelectedProject,
              defaultValue: props.selectedProject,
              ListEmptyComponent: (
                <NoDataError subtitle="Сейчас у вас нет проектов." />
              ),
            } as SelectModalParams<DTOProject>,
          })
        }
      >
        <View style={styles.iconContainer}>
          <Icon
            name="home"
            size={16}
          />
        </View>
        <H4>Проект:</H4>
        <H4
          color={
            props.selectedProject?.project_title
              ? undefined
              : colors.grayscale.__20
          }
          weight="600"
        >
          {props.selectedProject?.project_title || 'Выберите проект'}
        </H4>
      </LineWrapper>

      <LineWrapper
        style={styles.row}
        onPress={() => {
          props.navigation.navigate(AppRoutes.StackModals, {
            screen: ModalsRoutes.DateTimePicker,
            params: {
              pickerProps: {
                date: props.startDate,
                mode: 'date',
                maximumDate: props.endDate,
              },
              onConfirm: props.setStartDate,
              title: 'Выберите дату начала',
            },
          });
        }}
      >
        <View style={styles.iconContainer}>
          <Icon
            name="calendar-event"
            size={16}
          />
        </View>
        <H4>Дата начала:</H4>
        <H4 weight="600">
          {DateFormatter.format(props.startDate, DateTimeFormats.dateOnlyDots)}
        </H4>
      </LineWrapper>

      <LineWrapper
        style={styles.row}
        onPress={() => {
          props.navigation.navigate(AppRoutes.StackModals, {
            screen: ModalsRoutes.DateTimePicker,
            params: {
              pickerProps: {
                date: props.endDate,
                mode: 'date',
                minimumDate: props.startDate,
              },
              onConfirm: props.setEndDate,
              title: 'Выберите дату окончания',
            },
          });
        }}
      >
        <View style={styles.iconContainer}>
          <Icon
            name="calendar-event-check"
            size={16}
          />
        </View>
        <H4>Дата окончания:</H4>
        <H4 weight="600">
          {DateFormatter.format(props.endDate, DateTimeFormats.dateOnlyDots)}
        </H4>
      </LineWrapper>

      <LineWrapper
        style={styles.row}
        onPress={() => {
          const timeOnlyEndDate = new Date(props.endDate);

          timeOnlyEndDate.setFullYear(
            props.startDate.getFullYear(),
            props.startDate.getMonth(),
            props.startDate.getDate(),
          );

          props.navigation.navigate(AppRoutes.StackModals, {
            screen: ModalsRoutes.DateTimePicker,
            params: {
              pickerProps: {
                date: props.startDate,
                mode: 'time',
                maximumDate: timeOnlyEndDate,
              },
              onConfirm: props.setStartDate,
              title: 'Выберите время начала',
            },
          });
        }}
      >
        <View style={styles.iconContainer}>
          <Icon
            name="time"
            size={16}
          />
        </View>
        <H4>Время начала:</H4>
        <H4 weight="600">
          {DateFormatter.format(props.startDate, DateTimeFormats.timeOnlyShort)}
        </H4>
      </LineWrapper>

      <LineWrapper
        style={styles.row}
        onPress={() => {
          const timeOnlyStartDate = new Date(props.startDate);

          timeOnlyStartDate.setFullYear(
            props.endDate.getFullYear(),
            props.endDate.getMonth(),
            props.endDate.getDate(),
          );

          props.navigation.navigate(AppRoutes.StackModals, {
            screen: ModalsRoutes.DateTimePicker,
            params: {
              pickerProps: {
                date: props.endDate,
                mode: 'time',
                minimumDate: timeOnlyStartDate,
              },
              onConfirm: props.setEndDate,
              title: 'Выберите время окончания',
            },
          });
        }}
      >
        <View style={styles.iconContainer}>
          <Icon
            name="alarm-clock"
            size={16}
          />
        </View>
        <H4>Время окончания:</H4>
        <H4 weight="600">
          {DateFormatter.format(props.endDate, DateTimeFormats.timeOnlyShort)}
        </H4>
      </LineWrapper>

      {isEdit && (
        <LineButton
          haveTopBorder
          containerStyle={styles.button}
          type="reject"
          onPress={() =>
            props.navigation.navigate(AppRoutes.StackModals, {
              screen: ModalsRoutes.DeleteTask,
              params: {
                task: props.route.params.editableTask!,
              },
            })
          }
        >
          Удалить задачу
        </LineButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    gap: 6,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 'auto',
    marginBottom: 34,
  },
  project: {
    paddingVertical: 12,
  },
  taskNameInput: {
    maxHeight: 300,
    paddingTop: 0,
    paddingRight: 16,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Layout;
