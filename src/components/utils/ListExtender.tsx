import React from 'react';
import { View, StyleSheet } from 'react-native';

const ListExtender: React.FC<Partial<{ height: number }>> = ({
  height = 14,
}) => {
  const styles = getStyles(height);
  return <View style={styles.container} />;
};

const getStyles = (height: number) =>
  StyleSheet.create({
    container: {
      minHeight: height,
    },
  });

export default ListExtender;
