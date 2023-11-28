import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { H1, H4 } from '#ui-kit';

export interface INoDataError {
  title: string;
  subtitle: string;
  onPress: () => void;
  fillSpace: boolean;
}

const NoDataError: React.FC<Partial<INoDataError>> = ({
  title = '',
  subtitle,
  onPress,
  fillSpace = true,
}) => {
  return (
    <View style={[styles.container, fillSpace ? styles.fillspace : {}]}>
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
      >
        {title && <H1 textAlign="center">{title}</H1>}

        {subtitle && (
          <H4
            style={styles.subtitle}
            textAlign="center"
          >
            {subtitle}
          </H4>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  subtitle: {
    marginTop: 8,
  },
  fillspace: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NoDataError;
