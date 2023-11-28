import { Alert, LayoutAnimation } from 'react-native';

import { DEFAULT_LINKING_PREFIX } from '#navigation/linking';

import Vibration from './vibrations';

export const showUnexpectedError = (error: any) => {
  Alert.alert(
    'При выполнении сетевого запроса произошла неожиданная ошибка',
    JSON.stringify(error),
  );
};

export const animateLayout = (onAnimationEnd = () => {}) => {
  LayoutAnimation.configureNext(
    {
      duration: 250,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    },
    () => {
      onAnimationEnd();
    },
  );
};

export const isHaveErrors = (validationResults: boolean[]) => {
  const haveErrors = validationResults.some(el => el);

  if (haveErrors) {
    Vibration.impactMedium();
  }

  return haveErrors;
};

export const prettifyTime = (time: string | undefined): string => {
  if (!time) {
    return '';
  }

  const [hours, minutes] = time.split(':').map(el => +el);

  let res = '';

  if (hours) {
    res += `${hours} ${pluralize(+hours, 'час', 'часа', 'часов')} `;
  }

  if (minutes) {
    res += `${minutes} ${pluralize(+minutes, 'минута', 'минуты', 'минут')}`;
  }

  return res;
};

export const pluralize = (
  number: number,
  wordForOne: string,
  wordForTwo: string,
  wordForFive: string,
) => {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return wordForFive;
  }
  n %= 10;
  if (n === 1) {
    return wordForOne;
  }
  if (n >= 2 && n <= 4) {
    return wordForTwo;
  }
  return wordForFive;
};

export const animateDecorator = <T extends (...args: any) => any>(cb: T) => {
  return (...params: Parameters<T>) => {
    animateLayout();
    //@ts-expect-error
    cb(...params);
  };
};

export const generateDeepLink = (link?: any) => {
  if (typeof link === 'string' && link) {
    return `${DEFAULT_LINKING_PREFIX}/${link}`;
  } else {
    return '';
  }
};

export const delay = (time = 100) => {
  const _delay = new Promise(resolve => {
    setTimeout(() => {
      resolve('');
    }, time);
  });

  return _delay;
};
