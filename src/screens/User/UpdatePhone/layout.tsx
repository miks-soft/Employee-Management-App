import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { H3, Header, LineInput, Loader } from '#ui-kit';

import { TapKeyboardDismissArea } from '#components';

import { colors } from '#styles';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  const isSaveDisabled =
    props.route.params.defaultPhone !== props.phoneInputState.value &&
    props.phoneInputState.value?.length &&
    props.phoneInputState.value.length > 11 &&
    props.phoneInputState.value?.includes('+');
  return (
    <View style={styles.container}>
      <TapKeyboardDismissArea />
      <Header
        containerStyle={styles.header}
        rightIcon={
          props.isLoading ? (
            <Loader />
          ) : (
            <TouchableOpacity
              disabled={!isSaveDisabled}
              onPress={props.onUpdateUser}
            >
              <H3
                color={
                  isSaveDisabled ? colors.main.normal : colors.grayscale.__60
                }
              >
                Сохранить
              </H3>
            </TouchableOpacity>
          )
        }
        title="Телефон"
        onPressLeft={() => props.navigation.goBack()}
      />
      <LineInput
        {...props.phoneInputState}
        label="Телефон"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
});

export default Layout;
