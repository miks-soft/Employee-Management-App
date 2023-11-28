import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import {
  Button,
  Checkbox,
  FieldError,
  H5,
  Icon,
  Text,
  TextInput,
} from '#ui-kit';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { AvoidKeyboard, FocusAwareStatusBar } from '#components';

import { AppRoutes } from '#navigation/types';

import Images from '#config/images';

import { colors, shadow } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.main.mediumDark, colors.main.dark]}
        style={StyleSheet.absoluteFill}
      />
      <FocusAwareStatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <AvoidKeyboard
        mode="padding"
        offset={32}
        style={styles.avoid}
      >
        <View style={[styles.formContainer, shadow]}>
          <Image
            source={Images.BrandedLogo}
            style={styles.logo}
          />

          <TextInput
            {...props.emailInputState}
            label="Логин"
            returnKeyType="next"
            onBlur={() => {
              props.validateEmail();
            }}
            onSubmitEditing={() => {
              props.passwordInputState.inputRef.current?.focus();
            }}
          />
          <FieldError>{props.emailInputState.error}</FieldError>

          <TextInput
            {...props.passwordInputState}
            containerStyle={styles.passwordInput}
            IconRight={
              <TouchableOpacity
                onPress={() => props.setIsPasswordMasked(old => !old)}
              >
                <Icon
                  color={colors.grayscale.__0}
                  name={props.isPasswordMasked ? 'eye' : 'eye-closed'}
                />
              </TouchableOpacity>
            }
            label="Пароль"
            secureTextEntry={props.isPasswordMasked}
            onSubmitEditing={props.onLogin}
          />
          <FieldError>{props.passwordInputState.error}</FieldError>

          <View style={styles.privacyContainer}>
            {props.isFirstAppSignIn && (
              <Checkbox
                value={props.isPrivacyAgreed}
                onChange={props.setIsPrivacyAgreed}
              />
            )}
            <H5
              size={11}
              style={styles.privacyText}
              textAlign={props.isFirstAppSignIn ? 'left' : 'center'}
            >
              Используя приложение, вы соглашаетесь с условиями{' '}
              <H5
                size={11}
                style={styles.privacyLink}
                onPress={() => Linking.openURL('https://Employee Management App.ru/agreement')}
              >
                политики конфиденциальности
              </H5>
            </H5>
          </View>
          <Button
            disabled={!props.isPrivacyAgreed}
            isLoading={props.isLoading}
            style={styles.actionButton}
            onPress={props.onLogin}
          >
            <Text
              color={
                !props.isPrivacyAgreed
                  ? colors.grayscale.__20
                  : colors.grayscale.__100
              }
            >
              Войти
            </Text>
            <Icon
              color={
                !props.isPrivacyAgreed
                  ? colors.grayscale.__20
                  : colors.grayscale.__100
              }
              height={7}
              name="arrow-right"
              width={8}
            />
          </Button>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate(AppRoutes.RestorePasswordByEmail)
            }
          >
            <Text
              color="#1199F0"
              underlined={true}
            >
              Забыли пароль?
            </Text>
          </TouchableOpacity>
        </View>
      </AvoidKeyboard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avoid: {
    width: '100%',
  },
  passwordInput: {
    marginTop: 12,
  },
  formContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.grayscale.__100,
  },
  logo: {
    height: 50,
    aspectRatio: 1499 / 300,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 24,
    gap: 8,
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  privacyText: {
    flex: 1,
  },
  privacyLink: {
    color: colors.main.normal,
    textDecorationLine: 'underline',
  },
});

export default Layout;
