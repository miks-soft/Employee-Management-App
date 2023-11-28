import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { Divider, Header, Loader, NoDataError } from '#ui-kit';

import { ViewProps } from '.';
import ObjectTimeTrack from './components/ObjectTimeTrack';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <Header
        title="Учет времени"
        onPressLeft={props.navigation.goBack}
      />

      <FlatList
        contentContainerStyle={styles.list}
        data={props.timeTracks}
        ListEmptyComponent={
          props.isLoading ? (
            <Loader fullscreen />
          ) : (
            <NoDataError subtitle="Нет данных по учету времени" />
          )
        }
        ListHeaderComponent={
          props.timeTracks?.length ? <Divider style={styles.divider} /> : null
        }
        renderItem={({ item }) => <ObjectTimeTrack item={item} />}
        keyExtractor={item => `${item?.date}`}
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
