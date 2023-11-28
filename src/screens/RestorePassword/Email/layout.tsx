import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { Button, FieldError, H5, Icon, Text, TextInput } from '#ui-kit';
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

          <H5
            style={styles.description}
            textAlign="center"
          >
            Введите email, указанный при регистрации. {'\n'} Мы отправим
            инструкцию по восстановлению.
          </H5>
          <TextInput
            {...props.emailInputState}
            label="Логин"
            returnKeyType="next"
            onBlur={() => {
              props.validateEmail();
            }}
            onSubmitEditing={props.onSendResetPasswordCode}
          />
          <FieldError>{props.emailInputState.error}</FieldError>

          <Button
            isLoading={props.isLoading}
            style={styles.actionButton}
            onPress={props.onSendResetPasswordCode}
          >
            <Text color={colors.grayscale.__100}>Восстановить пароль</Text>
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
  description: {
    marginBottom: 12,
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
});

export default Layout;
