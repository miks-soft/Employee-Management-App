import React, { useEffect, useState, RefObject, ReactNode } from 'react';
import {
  TextInput as _TextInput,
  TouchableOpacity,
  View,
  TextInputProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

// eslint-disable-next-line no-restricted-imports
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  FadeIn,
  FadeOut,
  interpolateColor,
} from 'react-native-reanimated';

import { colors, withCustomAnimation, IS_IOS } from '#styles';

import Icon from './Icon';

const LABEL_TRANSLATE_Y = -12;

export type ITextInputOutline = 'error' | 'success' | 'focused' | 'default';

export interface ITextInput
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
  size: 'default' | 'small';
  inputRef: RefObject<_TextInput>;
  IconRight: ReactNode;
  IconLeft: ReactNode;
  pointerEvents: TextInputProps['pointerEvents'];
  outlineType: ITextInputOutline;
  disabled: boolean;
  androidFixScrollMultiline: boolean;
  label: string;
  onChange: TextInputProps['onChangeText'];
  style: StyleProp<ViewStyle>;
  containerStyle: StyleProp<ViewStyle>;
}

const TextInput: React.FC<Partial<ITextInput>> = ({
  value = '',
  maxLength,
  multiline = false,
  pointerEvents = undefined,
  size = 'default',
  inputRef,
  outlineType,
  label = '',
  androidFixScrollMultiline = false,
  secureTextEntry = false,
  enablesReturnKeyAutomatically = false,
  IconRight,
  IconLeft,
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
  const _multiline = multiline || (!IS_IOS && androidFixScrollMultiline);
  const [isFocused, setIsFocused] = useState(autoFocus);
  const styles = getStyles({
    outlineType: outlineType ? outlineType : isFocused ? 'focused' : 'default',
    label,
    disabled,
    size,
    multiline: _multiline,
  });

  const hasDisplayableValue = value || placeholder;

  const labelProgress = useSharedValue(hasDisplayableValue ? 1 : 0);

  const animatePlaceholder = (focus = false) => {
    if (hasDisplayableValue && !focus) {
      return;
    }

    labelProgress.value = withCustomAnimation(focus ? 1 : 0);
  };

  const rLabelStyles = useAnimatedStyle(() => ({
    color: interpolateColor(
      labelProgress.value,
      [0, 1],
      [colors.grayscale.__10, colors.grayscale.__0],
    ),
    transform: [
      {
        translateY: interpolate(
          labelProgress.value,
          [0, 1],
          [0, LABEL_TRANSLATE_Y],
        ),
      },
    ],
  }));

  const rLabelWrapperStyles = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(labelProgress.value, [0, 1], [1, 0.9]),
      },
    ],
  }));

  const renderNoPointerEventsWrapperAndroid = (children: ReactNode) =>
    !IS_IOS && pointerEvents === 'none' ? (
      <View
        pointerEvents="none"
        style={styles.wrapper}
      >
        {children}
      </View>
    ) : (
      <>{children}</>
    );

  useEffect(() => {
    animatePlaceholder(isFocused ? true : !!value);
  }, [value]);

  return (
    <View style={[styles.container, containerStyle]}>
      {IconLeft && (
        <View style={[styles.iconLeft, styles.iconContainer]}>{IconLeft}</View>
      )}

      {!!label && (
        <Animated.View
          pointerEvents="none"
          style={[styles.labelWrapper, rLabelWrapperStyles]}
        >
          <Animated.Text style={[styles.label, rLabelStyles]}>
            {label}
          </Animated.Text>
        </Animated.View>
      )}

      {renderNoPointerEventsWrapperAndroid(
        <_TextInput
          ref={inputRef}
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
          blurOnSubmit={blurOnSubmit}
          editable={!disabled}
          enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline || (!IS_IOS && androidFixScrollMultiline)}
          placeholder={placeholder}
          placeholderTextColor={colors.grayscale.__0}
          pointerEvents={pointerEvents}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          selectionColor={colors.main.normal}
          showSoftInputOnFocus={showSoftInputOnFocus}
          style={[styles.input, StyleSheet.flatten(style)]}
          value={value}
          onBlur={e => {
            onBlur(e);
            setIsFocused(false);
            animatePlaceholder(false);
          }}
          onChangeText={onChange}
          onContentSizeChange={onContentSizeChange}
          onEndEditing={onEndEditing}
          onFocus={e => {
            onFocus(e);
            setIsFocused(true);
            animatePlaceholder(true);
          }}
          onSubmitEditing={onSubmitEditing}
        />,
      )}

      {IconRight ? (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.iconRight, styles.iconContainer]}
        >
          {IconRight}
        </Animated.View>
      ) : (
        !!value &&
        !disabled &&
        isFocused && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.iconRight, styles.iconContainer]}
          >
            <TouchableOpacity
              onPress={() => {
                onChange('');
              }}
            >
              <Icon
                color={colors.grayscale.__0}
                name="close"
                size={20}
              />
            </TouchableOpacity>
          </Animated.View>
        )
      )}
    </View>
  );
};

const borderColors = {
  default: colors.main.light,
  focused: colors.main.mediumLight,
  error: colors.error,
  success: colors.success,
};

const getStyles = ({
  outlineType,
  label,
  disabled,
  size,
  multiline,
}: {
  outlineType: ITextInputOutline;
  label: string;
  disabled: boolean;
  size: ITextInput['size'];
  multiline: ITextInput['multiline'];
}) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 4,
      borderColor: borderColors[outlineType],
      borderWidth: 1,
      borderRadius: 4,
    },
    wrapper: {
      flex: 1,
    },
    labelWrapper: {
      justifyContent: 'center',
    },
    label: {
      position: 'absolute',
      top: size === 'small' ? 10 : 15,
      left: size === 'small' ? 13 : 13,
      fontSize: 16,
    },
    input: {
      flex: 1,
      height: multiline ? 'auto' : size === 'small' ? 40 : 52,
      maxHeight: 300,
      minHeight: multiline ? (size === 'small' ? 40 : 52) : 'auto',
      paddingTop: size === 'small' ? (label ? 16 : 0) : label ? 20 : 20,
      paddingBottom: 0,
      paddingHorizontal: size === 'small' ? 4 : 12,
      color: disabled ? colors.grayscale.__40 : colors.grayscale.__0,
      fontSize: 16,
      lineHeight: 19,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconLeft: {
      paddingLeft: size === 'small' ? 4 : 12,
    },
    iconRight: {
      paddingHorizontal: size === 'small' ? 4 : 12,
    },
  });

export default TextInput;
