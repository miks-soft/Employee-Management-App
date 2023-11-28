import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

class Vibration {
  static impactLight() {
    ReactNativeHapticFeedback.trigger('impactLight');
  }

  static impactMedium() {
    ReactNativeHapticFeedback.trigger('impactMedium');
  }

  static impactHeavy() {
    ReactNativeHapticFeedback.trigger('impactHeavy');
  }

  static rigid() {
    ReactNativeHapticFeedback.trigger('rigid');
  }

  static soft() {
    ReactNativeHapticFeedback.trigger('soft');
  }

  static notificationSuccess() {
    ReactNativeHapticFeedback.trigger('notificationSuccess');
  }

  static notificationWarning() {
    ReactNativeHapticFeedback.trigger('notificationWarning');
  }

  static notificationError() {
    ReactNativeHapticFeedback.trigger('notificationError');
  }
}

export default Vibration;
