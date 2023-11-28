import { useEffect } from 'react';

import * as NavigationBar from 'expo-navigation-bar';

import { IS_IOS, colors } from '#styles';

import { useSelector } from '#store';

const useWatchUIBarsColors = () => {
  const isSignedIn = useSelector(store => store.app.isSignedIn);

  useEffect(() => {
    !IS_IOS &&
      NavigationBar.setBackgroundColorAsync(
        isSignedIn ? colors.grayscale.__100 : colors.main.dark,
      );
    !IS_IOS && NavigationBar.setButtonStyleAsync(isSignedIn ? 'dark' : 'light');
  }, [isSignedIn]);
};

export default useWatchUIBarsColors;
