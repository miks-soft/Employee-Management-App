import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import { Divider, Header, Icon, Loader, NoDataError } from '#ui-kit';

import { ChatsRoutes } from '#navigation/Main/Chats/types';
import { AppRoutes } from '#navigation/types';

import { ViewProps } from '.';
import Chat from './components/Сhat';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <Header
        hideLeftIcon={true}
        rightIcon={
          <TouchableOpacity
            onPress={() => props.navigation.navigate(ChatsRoutes.Search)}
          >
            <Icon name="new-message" />
          </TouchableOpacity>
        }
        title="Чаты"
      />

      <FlatList
        contentContainerStyle={styles.list}
        data={props.chats}
        ListEmptyComponent={
          props.isLoading ? (
            <Loader fullscreen />
          ) : (
            <NoDataError subtitle="Нет доступных чатов" />
          )
        }
        ListHeaderComponent={props.chats?.length ? <Divider /> : null}
        renderItem={({ item }) => (
          <Chat
            item={item}
            onPress={() =>
              props.navigation.navigate(AppRoutes.Chat, {
                id: item.recepient.id,
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
});

export default Layout;
