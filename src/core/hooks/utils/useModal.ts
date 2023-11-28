import { useEffect, useState } from 'react';

import { useIsFocused, useNavigation } from '@react-navigation/native';

const useModal = (initial = true) => {
  const [state, setState] = useState(initial);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const _setState = (value: boolean) => {
    setState(value);

    if (!value) {
      navigation.canGoBack() && navigation.goBack();
    }
  };

  useEffect(() => {
    setState(isFocused);
  }, [isFocused]);

  return {
    closeWithoutGoBack: () => setState(false),
    close: () => _setState(false),
    open: () => _setState(true),
    visible: state,
    setVisible: _setState,
  };
};

export type ModalController = ReturnType<typeof useModal>;

export default useModal;
