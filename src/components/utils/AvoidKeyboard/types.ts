import { ReactNode } from 'react';

import { StyleProp, ViewStyle } from 'react-native/types';

export interface IAvoidKeyboard {
  children: ReactNode;
  style: StyleProp<ViewStyle>;
  offset: number;
  mode: 'translate' | 'padding';
}
