import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { LineButton, Radio } from '#ui-kit';
import { H2 } from '#ui-kit/Text';

import { ListExtender, ModalWrapper } from '#components';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const renderItemWrapper = ({
    item,
    index,
  }: {
    item: unknown;
    index: number;
  }) => (
    <TouchableOpacity
      style={[styles.itemContainer, props.route.params.itemContainerStyle]}
      onPress={() =>
        props.setSelectedItem(() =>
          props.route.params.checkedExtractor(item, props.selectedItem, index)
            ? undefined
            : item,
        )
      }
    >
      {props.route.params.renderItem(item, index)}

      <Radio
        value={props.route.params.checkedExtractor(
          item,
          props.selectedItem,
          index,
        )}
      />
    </TouchableOpacity>
  );

  return (
    <ModalWrapper
      visible={props.modal.visible}
      setVisible={props.modal.setVisible}
    >
      <H2>{props.route.params?.title}</H2>

      <FlatList
        data={props.route.params.data}
        initialNumToRender={20}
        ListEmptyComponent={props.route.params.ListEmptyComponent}
        ListFooterComponent={<ListExtender />}
        ListHeaderComponent={<ListExtender />}
        renderItem={renderItemWrapper}
        keyExtractor={props.route.params.keyExtractor}
      />
      <LineButton
        haveTopBorder
        onPress={() => {
          props.modal.close();

          props.route.params.onSelectionEnd(props.selectedItem);
        }}
      >
        Готово
      </LineButton>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Layout;
