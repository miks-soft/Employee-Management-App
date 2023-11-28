import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { LineWrapper, H3 } from '#ui-kit';
import { Image } from 'expo-image';

import { BASE_URL } from '#env';

import { RequestsSearch } from '#api/controllers/Search/types';

import Images from '#config/images';

import { colors } from '#styles';

const SearchResult: React.FC<{
  containerStyle?: StyleProp<ViewStyle>;
  item: ArrayElement<NonNullable<RequestsSearch['searchChat']['response']>>;
  onPress?: () => void;
}> = ({ containerStyle, item, onPress }) => {
  return (
    <LineWrapper
      style={[styles.container, StyleSheet.flatten(containerStyle)]}
      onPress={onPress}
    >
      <View style={styles.avatar}>
        <Image
          contentFit="cover"
          placeholder={colors.grayscale.__60}
          source={
            item.image
              ? { uri: `${BASE_URL}/${item?.image}` }
              : Images.ChatDefaultAvatar
          }
          style={styles.avatar}
        />
      </View>
      <View style={styles.text}>
        <H3 numberOfLines={1}>{item.name}</H3>
      </View>
    </LineWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 32,
    aspectRatio: 1,
    borderRadius: 24,
  },
  text: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 16,
    marginLeft: 10,
  },
});

export default React.memo(SearchResult);
