import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { Button, FieldError, Icon, Text, TextInput } from '#ui-kit';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { AvoidKeyboard, FocusAwareStatusBar } from '#components';

import { AppRoutes } from '#navigation/types';

import Images from '#config/images';

import { colors, hitSlop, shadow } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.main.mediumDark, colors.main.dark]}
        style={StyleSheet.absoluteFill}
      />
      <FocusAwareStatusBar barStyle="light-content" />
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
            {...props.codeInputState}
            label="Код"
            returnKeyType="next"
            onBlur={() => {
              props.validateCode();
            }}
            onSubmitEditing={() => {
              props.passwordInputState.inputRef.current?.focus();
            }}
          />
          <FieldError>{props.codeInputState.error}</FieldError>

          <TextInput
            {...props.passwordInputState}
            containerStyle={styles.input}
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
            onBlur={() => {
              props.validatePassword();
              props.validateRepeatedPassword();
            }}
            onSubmitEditing={() => {
              props.passwordInputState.inputRef.current?.focus();
            }}
          />
          <FieldError>{props.passwordInputState.error}</FieldError>

          <TextInput
            {...props.repeatedPasswordInputState}
            containerStyle={styles.input}
            IconRight={
              <TouchableOpacity
                onPress={() => props.setIsRepeatedPasswordMasked(old => !old)}
              >
                <Icon
                  color={colors.grayscale.__0}
                  name={props.isRepeatedPasswordMasked ? 'eye' : 'eye-closed'}
                />
              </TouchableOpacity>
            }
            label="Подтверждение пароля"
            secureTextEntry={props.isRepeatedPasswordMasked}
            onBlur={() => {
              props.validateRepeatedPassword();
            }}
            onSubmitEditing={() => {
              props.repeatedPasswordInputState.inputRef.current?.focus();
            }}
          />
          <FieldError>{props.repeatedPasswordInputState.error}</FieldError>

          <Button
            isLoading={props.isLoading}
            style={styles.actionButton}
            onPress={props.onResetPassword}
          >
            <Text color={colors.grayscale.__100}>Сменить пароль</Text>
            <Icon
              height={7}
              name="arrow-right"
              width={8}
            />
          </Button>
          <TouchableOpacity
            hitSlop={hitSlop}
            onPress={() => props.navigation.navigate(AppRoutes.SignIn)}
          >
            <Text
              color="#1199F0"
              underlined={true}
            >
              Войти
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
  input: {
    marginTop: 12,
  },
});

export default Layout;
