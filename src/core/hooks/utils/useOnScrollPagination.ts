import { useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { SCREEN_HEIGHT } from '#styles';

export const useOnScrollPagination = () => {
  const previousEventRef = useRef({
    contentOffset: {
      x: 0,
      y: 0,
    },
  });

  return (cb = () => {}) =>
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      let previousOffsetY = 0;

      if (previousEventRef?.current?.contentOffset.y) {
        previousOffsetY = previousEventRef.current.contentOffset.y;
      }

      const offsetY = event.nativeEvent.contentOffset.y;

      if (
        offsetY - previousOffsetY > 0 &&
        offsetY >=
          event.nativeEvent.contentSize.height +
            event.nativeEvent.contentInset.bottom -
            event.nativeEvent.layoutMeasurement.height -
            SCREEN_HEIGHT / 2
      ) {
        cb();
      }

      previousEventRef.current!.contentOffset = event.nativeEvent.contentOffset;
    };
};
