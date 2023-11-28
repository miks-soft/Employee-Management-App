import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { Calendar } from 'react-native-calendars';

import { Divider, Header, Icon, NoDataError } from '#ui-kit';

import { TasksRoutes } from '#navigation/Main/Tasks/types';

import { colors } from '#styles';

import { ViewProps } from '.';
import Task from './components/Task';
import { initCalendar } from './config';

initCalendar();

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <Header
        hideLeftIcon={true}
        isLoading={props.isLoading}
        rightIcon={
          <TouchableOpacity
            onPress={() => props.navigation.navigate(TasksRoutes.CRUD, {})}
          >
            <Icon name="plus-outlined" />
          </TouchableOpacity>
        }
        title="Задачи"
      />

      <FlatList
        data={props.todayTasks}
        ListEmptyComponent={
          <NoDataError subtitle="У вас нет задач на выбранную дату" />
        }
        ListHeaderComponent={
          <>
            <Calendar
              displayLoadingIndicator={props.isLoading}
              markedDates={{
                ...props.markedDates,
                [props.selectedDate]: {
                  marked: true,
                  dotColor: colors.main.normal,
                  textColor: colors.grayscale.__100,
                  customContainerStyle: {
                    backgroundColor: colors.main.normal,
                  },
                },
              }}
              markingType="period"
              onDayPress={date => props.setSelectedDate(date.dateString)}
              onPressArrowLeft={cb => {
                cb();
                props.onShowPreviousMonth();
              }}
              onPressArrowRight={cb => {
                cb();
                props.onShowNextMonth();
              }}
            />
            <Divider />
          </>
        }
        renderItem={({ item }) => (
          <Task
            item={item}
            onPress={() =>
              props.navigation.navigate(TasksRoutes.CRUD, {
                editableTask: item,
              })
            }
          />
        )}
        keyExtractor={item => `${item?.id}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Layout;
