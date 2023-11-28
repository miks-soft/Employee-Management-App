import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { Divider, Header, Loader, NoDataError } from '#ui-kit';

import { ObjectRoutes } from '#navigation/Main/Objects/types';

import { ViewProps } from '.';
import Object from './components/Object';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <Header
        hideLeftIcon={true}
        isLoading={props.isLoading}
        title="Объекты"
      />

      <FlatList
        contentContainerStyle={styles.list}
        data={props.objects}
        ListEmptyComponent={
          props.isLoading ? (
            <Loader fullscreen />
          ) : (
            <NoDataError subtitle="На сегодня у вас нет объектов" />
          )
        }
        ListHeaderComponent={
          props.objects?.length ? <Divider style={styles.divider} /> : null
        }
        renderItem={({ item }) => (
          <Object
            item={item}
            onPress={() =>
              props.navigation.navigate(ObjectRoutes.Read, {
                id: item?.id!,
                defaultObject: item,
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
