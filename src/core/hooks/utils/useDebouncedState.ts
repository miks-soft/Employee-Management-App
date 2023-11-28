import { useCallback, useEffect, useState } from 'react';

import { debounce } from 'lodash';

const useDebouncedState = <T>(
  param: T,
  debounceTimer = 250,
): [T, SetState<T>, T, SetState<T>] => {
  const [value, setValue] = useState(param);
  const [debouncedValue, setDebouncedValue] = useState(param);

  const debouncedSet = useCallback(
    debounce(setDebouncedValue, debounceTimer),
    [],
  );

  useEffect(() => {
    debouncedSet(value);
  }, [value]);

  return [value, setValue, debouncedValue, setDebouncedValue];
};

export default useDebouncedState;
