import * as React from 'react';
import { TextInput } from 'react-native';
import createNavigationContainer from '../createNavigationContainer';
import createNavigator from './createNavigator';
import StackView from '../views/StackView/StackView';
import StackRouter from '../routers/StackRouter';

function createStackNavigator(routeConfigMap, stackConfig = {}, name = '') {
  const {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  } = stackConfig;

  const stackRouterConfig = {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  };

  const router = StackRouter(routeConfigMap, stackRouterConfig);

  // Create a navigator with StackView as the view
  const Navigator = createNavigator(
    StackView,
    router,
    stackConfig,
    `${name}Stack`
  );

  class KeyboardAwareNavigator extends React.Component {
    static router = Navigator.router;
    _previouslyFocusedTextInput = null;

    render() {
      return (
        <Navigator
          {...this.props}
          onGestureBegin={this._handleGestureBegin}
          onGestureCanceled={this._handleGestureCanceled}
          onGestureFinish={this._handleGestureFinish}
          onTransitionStart={this._handleTransitionStart}
        />
      );
    }

    _handleGestureBegin = () => {
      this._previouslyFocusedTextInput =
        TextInput.State.currentlyFocusedField() || null;

      if (this._previouslyFocusedTextInput) {
        TextInput.State.blurTextInput(this._previouslyFocusedTextInput);
      }
    };

    _handleGestureCanceled = () => {
      if (this._previouslyFocusedTextInput) {
        TextInput.State.focusTextInput(this._previouslyFocusedTextInput);
      }
    };

    _handleGestureFinish = () => {
      this._previouslyFocusedTextInput = null;
    };

    _handleTransitionStart = () => {
      const currentField = TextInput.State.currentlyFocusedField();
      if (currentField) {
        TextInput.State.blurTextInput(currentField);
      }
    };
  }

  // HOC to provide the navigation prop for the top-level navigator (when the prop is missing)
  return createNavigationContainer(KeyboardAwareNavigator, `${name}Stack`);
}

export default createStackNavigator;
