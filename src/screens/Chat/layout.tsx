import 'dayjs/locale/ru';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { GiftedChat, Send } from 'react-native-gifted-chat';

import { Header, Icon } from '#ui-kit';
import { Image } from 'expo-image';

import { BASE_URL } from '#env';

import { AvoidKeyboard } from '#components';

import { MainRoutes } from '#navigation/Main/types';
import { AppRoutes } from '#navigation/types';

import Images from '#config/images';

import { colors, IS_IOS, SAFE_ZONE_BOTTOM } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <Header
        leftIcon={
          <View style={styles.headerLeft}>
            <Icon
              color={colors.main.dark}
              height={12}
              name="chevron-left-marginless"
              width={6}
            />
            <Image
              source={
                props.chatRecepient?.image
                  ? `${BASE_URL}/${props.chatRecepient.image}`
                  : Images.ChatDefaultAvatar
              }
              style={styles.headerAvatar}
            />
            {props.isOnline && <View style={styles.onlineIndicator} />}
          </View>
        }
        title={props.chatRecepient?.name}
        onPressLeft={() =>
          props.navigation.replace(AppRoutes.StackMain, {
            screen: MainRoutes.Chats,
          })
        }
      />

      <GiftedChat
        alwaysShowSend
        bottomOffset={IS_IOS ? SAFE_ZONE_BOTTOM : 0}
        isKeyboardInternallyHandled={IS_IOS && true}
        isLoadingEarlier={true}
        locale="ru"
        messages={props.messages}
        placeholder="Введите сообщение..."
        renderSend={sendProps => (
          <Send
            {...sendProps}
            containerStyle={styles.sendContainer}
          >
            <Icon
              color={colors.grayscale.__40}
              name="send"
              size={20}
            />
          </Send>
        )}
        user={{
          _id: props.user?.id!,
          name: props.user?.name!,
          avatar: props.user?.image
            ? `${BASE_URL}/${props.user.image}`
            : Images.DefaultAvatar,
        }}
        onSend={messages => {
          if (messages[0]) {
            props.onSend(messages[0]);
          }
        }}
      />
      {!IS_IOS && <AvoidKeyboard mode="padding" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: SAFE_ZONE_BOTTOM,
    backgroundColor: colors.grayscale.__100,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    height: 24,
    width: 24,
    marginLeft: 8,
    borderRadius: 12,
  },
  onlineIndicator: {
    width: 12,
    aspectRatio: 1,
    position: 'absolute',
    right: -3,
    bottom: -1,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
});

export default Layout;
