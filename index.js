import {AppRegistry, LogBox, ScrollView, Platform} from 'react-native';
import 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';
import KeyboardManager from 'react-native-keyboard-manager';

ScrollView.defaultProps = {
  ...ScrollView.defaultProps,
  bounces: false,
  showsHorizontalScrollIndicator: false,
  showsVerticalScrollIndicator: false,
};

if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setEnableDebugging(false);
  KeyboardManager.setKeyboardDistanceFromTextField(10);
  KeyboardManager.setLayoutIfNeededOnUpdate(true);
  KeyboardManager.setEnableAutoToolbar(true);
  KeyboardManager.setToolbarManageBehaviourBy('subviews'); // "subviews" | "tag" | "position"
  KeyboardManager.setToolbarPreviousNextButtonEnable(false);
  KeyboardManager.setToolbarTintColor('#0000FF'); // Only #000000 format is supported
  KeyboardManager.setToolbarBarTintColor('#FFFFFF'); // Only #000000 format is supported
  KeyboardManager.setShouldShowToolbarPlaceholder(true);
  KeyboardManager.setOverrideKeyboardAppearance(false);
  KeyboardManager.setKeyboardAppearance('default'); // "default" | "light" | "dark"
  KeyboardManager.setShouldResignOnTouchOutside(true);
  KeyboardManager.setShouldPlayInputClicks(true);
  KeyboardManager.resignFirstResponder();
}

LogBox.ignoreAllLogs(true);
console.error = () => {};

AppRegistry.registerComponent(appName, () => App);
