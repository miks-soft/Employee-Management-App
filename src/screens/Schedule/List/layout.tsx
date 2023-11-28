import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { Divider, Header, Loader, NoDataError } from '#ui-kit';

import { ScheduleRoutes } from '#navigation/Main/Schedule/types';

import DateFormatter, { DateTimeFormats } from '#services/formatters/Date';

import { ViewProps } from '.';
import ProjectSchedule from './components/ProjectSchedule';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <Header
        hideLeftIcon={true}
        isLoading={props.isLoading}
        title={`График ${DateFormatter.format(
          new Date(),
          DateTimeFormats.dateOnlyDots,
        )}`}
      />

      <FlatList
        contentContainerStyle={styles.list}
        data={props.projectSchedules}
        ListEmptyComponent={
          props.isLoading ? (
            <Loader fullscreen />
          ) : (
            <NoDataError subtitle="На сегодня у вас нет проектов по которым возможен учет времени." />
          )
        }
        ListHeaderComponent={
          props.projectSchedules?.length ? (
            <Divider style={styles.divider} />
          ) : null
        }
        renderItem={({ item }) => (
          <ProjectSchedule
            item={item}
            onPress={() =>
              props.navigation.navigate(ScheduleRoutes.TimeTracking, {
                id: item.id,
                default: item,
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
  list: {
    flexGrow: 1,
  },
  divider: {
    marginTop: 16,
  },
});

export default Layout;
