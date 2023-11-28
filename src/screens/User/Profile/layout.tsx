import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';

import {
  LineButton,
  H3,
  H4,
  Header,
  Icon,
  Loader,
  LineWrapper,
  H5,
} from '#ui-kit';
import { Image } from 'expo-image';

import { BASE_URL } from '#env';

import { UserRoutes } from '#navigation/Main/User/types';
import { ModalsRoutes } from '#navigation/Modals/types';
import { AppRoutes } from '#navigation/types';

import Images from '#config/images';

import { colors } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <>
      <Header
        hideLeftIcon={true}
        title="Профиль"
      />
      <ScrollView style={styles.container}>
        {props.isLoading && !props.user ? (
          <Loader fullscreen />
        ) : (
          <>
            <View style={styles.header}>
              <Image
                placeholder={colors.grayscale.__60}
                source={
                  props.user?.image
                    ? `${BASE_URL}/${props.user.image}`
                    : Images.DefaultAvatar
                }
                style={styles.headerAvatarImage}
              />
              <H3>{props.user?.name}</H3>
            </View>

            <View style={styles.avatarLine}>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() => {
                  props.navigation.navigate(AppRoutes.StackModals, {
                    screen: ModalsRoutes.UpdateAvatar,
                  });
                }}
              >
                <Image
                  placeholder={colors.grayscale.__60}
                  source={
                    props.user?.image
                      ? `${BASE_URL}/${props.user.image}`
                      : Images.DefaultAvatar
                  }
                  style={styles.avatarImage}
                />
                <View style={styles.changeAvatarButtonContainer}>
                  <View style={styles.changeAvatarButton}>
                    <H3
                      color="white"
                      size={16}
                      textAlign="center"
                    >
                      +
                    </H3>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <LineWrapper
              haveTopBorder
              style={styles.line}
              onPress={() =>
                props.navigation.navigate(UserRoutes.UpdateName, {
                  defaultName: props.user?.name || '',
                })
              }
            >
              <H3 style={styles.optionTitle}>Имя</H3>
              <H4 style={styles.optionValue}>{props.user?.name}</H4>
              <Icon
                height={12}
                name="chevron-right-marginless"
                width={6}
              />
            </LineWrapper>
            <LineWrapper
              style={styles.line}
              onPress={() =>
                props.navigation.navigate(UserRoutes.UpdatePhone, {
                  defaultPhone: props.user?.phone!,
                })
              }
            >
              <H3 style={styles.optionTitle}>Телефон</H3>
              <H4 style={styles.optionValue}>{props.user?.phone}</H4>
              <Icon
                height={12}
                name="chevron-right-marginless"
                width={6}
              />
            </LineWrapper>
            <LineWrapper
              style={styles.line}
              onPress={() =>
                props.navigation.navigate(UserRoutes.UpdateEmail, {
                  defaultEmail: props.user?.email!,
                })
              }
            >
              <H3 style={styles.optionTitle}>Email</H3>
              <H4 style={styles.optionValue}>{props.user?.email}</H4>
              <Icon
                height={12}
                name="chevron-right-marginless"
                width={6}
              />
            </LineWrapper>
            <LineWrapper
              style={styles.line}
              onPress={() =>
                props.navigation.navigate(UserRoutes.UpdatePassword)
              }
            >
              <H3 style={styles.optionTitle}>Пароль</H3>
              <H4 style={styles.optionValue}>******</H4>
              <Icon
                height={12}
                name="chevron-right-marginless"
                width={6}
              />
            </LineWrapper>

            <View style={styles.links}>
              {!props.user?.hide_statistic && (
                <LineWrapper
                  haveTopBorder
                  style={styles.line}
                  onPress={() =>
                    props.navigation.navigate(UserRoutes.Statistics)
                  }
                >
                  <H3 style={styles.linkTitle}>Моя статистика</H3>
                  <Icon
                    height={12}
                    name="chevron-right-marginless"
                    width={6}
                  />
                </LineWrapper>
              )}
              <LineWrapper
                style={styles.line}
                onPress={() =>
                  props.navigation.navigate(UserRoutes.NotificationSettings)
                }
              >
                <H3 style={styles.linkTitle}>Настройки приложения</H3>
                <Icon
                  height={12}
                  name="chevron-right-marginless"
                  width={6}
                />
              </LineWrapper>
            </View>

            <LineButton
              haveTopBorder
              containerStyle={styles.button}
              onPress={() => {
                props.navigation.navigate(AppRoutes.StackModals, {
                  screen: ModalsRoutes.Logout,
                });
              }}
            >
              Выйти
            </LineButton>
            <H5
              size={11}
              style={styles.privacyText}
              textAlign="center"
            >
              Используя приложение, вы соглашаетесь с условиями
              <H5
                size={11}
                style={styles.privacyLink}
                onPress={() => Linking.openURL('https://Employee Management App.ru/agreement')}
              >
                {'\n'}
                политики конфиденциальности
              </H5>
            </H5>
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    alignItems: 'center',
  },
  button: {
    marginTop: 'auto',
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale.__60,
  },
  avatarLine: {
    width: '100%',
    overflow: 'visible',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: {
    width: 72,
    aspectRatio: 1,
  },
  headerAvatarImage: {
    width: 24,
    aspectRatio: 1,
    borderRadius: 12,
  },
  changeAvatarButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  changeAvatarButton: {
    width: 22,
    aspectRatio: 1,
    position: 'absolute',
    right: -10,
    textAlign: 'center',
    borderRadius: 12,
    backgroundColor: colors.main.normal,
  },
  avatarImage: {
    flex: 1,
    borderRadius: 36,
  },
  optionTitle: {
    width: '30%',
  },
  optionValue: {
    flex: 1,
  },
  linkTitle: {
    flex: 1,
  },
  links: {
    marginTop: 24,
    marginBottom: 16,
  },
  privacyText: {
    marginTop: 16,
    marginBottom: 16,
  },
  privacyLink: {
    color: colors.main.normal,
    textDecorationLine: 'underline',
  },
});

export default Layout;
