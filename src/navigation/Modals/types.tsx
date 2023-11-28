import { FlatListProps, ViewStyle } from 'react-native';

import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import DatePicker from 'react-native-date-picker';

import { ILineButton } from '#ui-kit/LineButton';

import { AppParamList } from '#navigation/types';

import { ModalController } from '#hooks/utils/useModal';

import { DTOTask } from '#generated/types';

export type UIActionModalButton = Partial<
  Omit<ILineButton, 'onPress'> & { bypassGoBackOnClose: boolean } & {
    onPress: (
      navigation: StackNavigationProp<AppParamList>,
      modal: ModalController,
    ) => void;
  }
>;

export enum ModalsRoutes {
  Logout = 'Logout',
  DeleteTask = 'DeleteTask',
  UpdateAvatar = 'UpdateAvatar',
  /* utils */
  Actions = 'Actions',
  Select = 'Select',
  Dialog = 'Dialog',
  'DateTimePicker' = 'DateTimePicker',
}

export type SelectModalParams<T> = {
  title: string;
  defaultValue?: any;
  checkedExtractor: (
    item: T,
    currentItem: T | undefined,
    index: number,
  ) => boolean;
  renderItem: (item: T, index: number) => JSX.Element;
  onSelectionEnd: (item?: T) => void;
  itemContainerStyle?: ViewStyle;
} & Pick<
  FlatListProps<T>,
  'ListEmptyComponent' | 'data' | 'keyExtractor' | 'keyExtractor'
>;

export type ModalsParamList = {
  [ModalsRoutes.Dialog]: {
    title: string;
    text: string;
    confirmButtonProps: UIActionModalButton;
    declineButtonProps: UIActionModalButton;
  };
  [ModalsRoutes.Actions]: {
    title: string;
    text: string;
    buttons: UIActionModalButton[];
  };
  [ModalsRoutes.DeleteTask]: { task: DTOTask };
  [ModalsRoutes.UpdateAvatar]: undefined;
  [ModalsRoutes.Logout]: undefined;
  [ModalsRoutes.DateTimePicker]: {
    pickerProps: DatePicker['props'];
    onConfirm: (date: Date) => void;
    title: string;
  };
  [ModalsRoutes.Select]: SelectModalParams<any>;
};

export type ModalsScreenProps<RouteName extends ModalsRoutes> =
  StackScreenProps<ModalsParamList, RouteName>;
