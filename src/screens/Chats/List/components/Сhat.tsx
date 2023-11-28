import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { LineWrapper, H4, H3, H5 } from '#ui-kit';
import { Image } from 'expo-image';

import { BASE_URL } from '#env';

import { SocketEmitter } from '#services/SocketClient';

import Images from '#config/images';

import { colors } from '#styles';

import { UIChat } from '#store/slices/chats';

import { formatLastMessageTime } from '../utils';

const Chat: React.FC<{
  containerStyle?: StyleProp<ViewStyle>;
  item: UIChat;
  onPress?: () => void;
}> = ({ containerStyle, item, onPress }) => {
  const [isOnline, setIsOnline] = useState(false);

  const checkIsUserOnline = async () => {
    const res = await SocketEmitter.isOnline(item.recepient.id);
    setIsOnline(res);
  };

  useEffect(() => {
    checkIsUserOnline();
    const intervalId = setInterval(checkIsUserOnline, 10000);

    return () => clearInterval(intervalId);
  }, []);

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
            item.recepient.image
              ? { uri: `${BASE_URL}/${item?.recepient.image}` }
              : Images.ChatDefaultAvatar
          }
          style={styles.avatar}
        />
        {isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.text}>
        <H3 numberOfLines={1}>{item.recepient.name}</H3>
        <H4 numberOfLines={1}>{item.text}</H4>
      </View>
      <View style={styles.meta}>
        <H5>{formatLastMessageTime(item.updated_at)}</H5>
        {!!item.count_unread && (
          <View style={styles.unreadIndicator}>
            <H4
              color={colors.grayscale.__100}
              lineHeight={20}
            >
              {Math.min(item.count_unread, 99)}
            </H4>
          </View>
        )}
      </View>
    </LineWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  meta: {
    paddingTop: 4,
    gap: 6,
  },
  avatar: {
    width: 48,
    aspectRatio: 1,
    borderRadius: 24,
  },
  text: {
    flex: 1,
    marginRight: 16,
    marginLeft: 10,
    gap: 4,
  },
  onlineIndicator: {
    width: 12,
    aspectRatio: 1,
    position: 'absolute',
    right: 1,
    bottom: 1,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
  unreadIndicator: {
    width: 22,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: 11,
    backgroundColor: colors.main.normal,
  },
});

export default React.memo(Chat);
