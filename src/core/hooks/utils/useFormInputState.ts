import { useRef, useState } from 'react';

import { TextInput } from 'react-native/types';

import { ITextInput } from '#ui-kit/TextInput';

import { animateLayout } from '#utils';

const useFormInputState = (
  initialValue?: string,
): {
  error: string;
  setError: SetState<string>;
} & Pick<ITextInput, 'value' | 'onChange' | 'inputRef'> => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const _setValue = (_value: SetStateArg<string | undefined>) => {
    setValue(_value);
    error !== '' && animateLayout();

    setError('');
  };

  const _setError = (_value: SetStateArg<string>) => {
    animateLayout();
    setError(_value);
  };

  return { value, onChange: _setValue, error, setError: _setError, inputRef };
};

export type FormInputState = ReturnType<typeof useFormInputState>;

export default useFormInputState;
