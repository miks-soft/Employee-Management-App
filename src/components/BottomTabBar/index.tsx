import React from 'react';
import { StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, shadow } from '#styles';

import BottomTab, { Tab } from './BottomTab';

export interface IBottomBar {
  focusIndex: number;
  tabs: Tab[];
}

const BottomBar: React.FC<Partial<IBottomBar>> = ({
  focusIndex = 0,
  tabs = [],
}) => {
  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, shadow]}
    >
      {tabs.map((tab, index) => (
        <BottomTab
          key={tab.screenName}
          amount={tab.amount}
          iconName={tab.iconName}
          isFocus={focusIndex === index}
          label={tab.label}
          onPress={tab.onPress}
        />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    backgroundColor: colors.grayscale.__100,
  },
});

export default BottomBar;
