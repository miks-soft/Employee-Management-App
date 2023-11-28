import React, { useState, RefObject } from 'react';
import {
  TextInput as _TextInput,
  View,
  TextInputProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import { colors } from '#styles';

import { H3 } from './Text';

export type ITextInputOutline = 'error' | 'success' | 'focused' | 'default';

export interface ILineInput
  extends Pick<
    TextInputProps,
    | 'value'
    | 'maxLength'
    | 'secureTextEntry'
    | 'placeholder'
    | 'autoCapitalize'
    | 'multiline'
    | 'keyboardType'
    | 'returnKeyType'
    | 'blurOnSubmit'
    | 'autoFocus'
    | 'showSoftInputOnFocus'
    | 'onFocus'
    | 'onBlur'
    | 'onSubmitEditing'
    | 'onContentSizeChange'
    | 'onEndEditing'
    | 'enablesReturnKeyAutomatically'
  > {
  inputRef: RefObject<_TextInput>;
  outlineType: ITextInputOutline;
  disabled: boolean;
  label: string;
  onChange: TextInputProps['onChangeText'];
  style: StyleProp<ViewStyle>;
  containerStyle: StyleProp<ViewStyle>;
  haveBottomBorder: boolean;
  haveTopBorder: boolean;
}

const LineInput: React.FC<Partial<ILineInput>> = ({
  value = '',
  maxLength,
  inputRef,
  outlineType,
  label = '',
  secureTextEntry = false,
  enablesReturnKeyAutomatically = false,
  placeholder = '',
  autoCapitalize = 'none',
  keyboardType = 'default',
  returnKeyType = 'done',
  disabled = false,
  blurOnSubmit = false,
  autoFocus = false,
  showSoftInputOnFocus = true,
  onFocus = () => {},
  onBlur = () => {},
  onChange = () => {},
  onSubmitEditing = () => {},
  onContentSizeChange = () => {},
  onEndEditing = () => {},
  style = {},
  containerStyle = {},
}) => {
  const [isFocused, setIsFocused] = useState(autoFocus);
  const styles = getStyles({
    outlineType: outlineType ? outlineType : isFocused ? 'focused' : 'default',
    disabled,
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <H3 style={styles.label}>{label}</H3>
      <_TextInput
        ref={inputRef}
        autoCapitalize={autoCapitalize}
        autoFocus={autoFocus}
        blurOnSubmit={blurOnSubmit}
        editable={!disabled}
        enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
        keyboardType={keyboardType}
        maxLength={maxLength}
        numberOfLines={1}
        placeholder={placeholder}
        placeholderTextColor={colors.grayscale.__0}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        selectionColor={colors.main.normal}
        showSoftInputOnFocus={showSoftInputOnFocus}
        style={[styles.input, StyleSheet.flatten(style)]}
        value={value}
        onBlur={e => {
          onBlur(e);
          setIsFocused(false);
        }}
        onChangeText={onChange}
        onContentSizeChange={onContentSizeChange}
        onEndEditing={onEndEditing}
        onFocus={e => {
          onFocus(e);
          setIsFocused(true);
        }}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

const borderColors = {
  default: colors.grayscale.__60,
  focused: colors.main.mediumLight,
  error: colors.error,
  success: colors.success,
};

const getStyles = ({
  outlineType,
  disabled,
}: {
  outlineType: ITextInputOutline;
  disabled: boolean;
}) =>
  StyleSheet.create({
    container: {
      height: 46,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 20,
      borderColor: borderColors[outlineType],
      borderTopWidth: 1,
      backgroundColor: colors.grayscale.__100,
      borderBottomWidth: 1,
    },
    label: {
      minWidth: '25%',
      paddingRight: 16,
    },
    input: {
      flex: 1,
      height: 46,
      maxHeight: '100%',
      overflow: 'hidden',
      paddingVertical: 8,
      paddingLeft: 12,
      color: disabled ? colors.grayscale.__40 : colors.grayscale.__0,
      fontSize: 16,
      lineHeight: 20,
      borderColor: borderColors[outlineType],
      borderLeftWidth: 1,
    },
  });

export default LineInput;
