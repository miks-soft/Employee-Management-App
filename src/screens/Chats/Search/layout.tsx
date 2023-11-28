import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { H3, Header, Icon, LineWrapper, TextInput } from '#ui-kit';

import { AppRoutes } from '#navigation/types';

import { EnumChatRecepient } from '#config/enums';

import { colors } from '#styles';

import { ViewProps } from '.';
import SearchResult from './components/SearchResult';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <Header
        hideLeftIcon={true}
        rightIcon={
          <TouchableOpacity onPress={props.navigation.goBack}>
            <H3 color={colors.main.normal}>Отмена</H3>
          </TouchableOpacity>
        }
        title="Новый чат"
      />
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={props.chatsFound}
        ListHeaderComponent={
          <LineWrapper
            haveTopBorder
            style={styles.searchBarContainer}
          >
            <TextInput
              IconLeft={<Icon name="search" />}
              placeholder="Поиск"
              size="small"
              value={props.searchFor}
              onChange={props.setSearchFor}
            />
          </LineWrapper>
        }
        renderItem={({ item }) => (
          <SearchResult
            item={item}
            onPress={() => {
              props.navigation.navigate(AppRoutes.Chat, {
                id: item.id!,
                default: {
                  recepient: {
                    type: (item.tablename = 'users'
                      ? EnumChatRecepient.USER
                      : EnumChatRecepient.PROJECT),
                    id: item.id!,
                    name: item.name!,
                    image: item.image,
                  },
                },
              });
            }}
          />
        )}
        keyExtractor={item => `${item.id}`}
      />
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.grayscale.__100,
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default Layout;
