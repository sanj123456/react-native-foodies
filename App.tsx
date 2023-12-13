import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import React, {FC, useEffect} from 'react';
import {View} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import FlashMessage from 'react-native-flash-message';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {Loader} from './src/components';
import store, {dispatch} from './src/redux';
import {setInitUser} from './src/redux/modules/profileSlice';
import {commonStyles} from './src/styles';
import MainStackNavigator from './src/navigation/MainStackNavigator';

const App: FC = ({}) => {
  const {getItem} = useAsyncStorage('user');

  useEffect(() => {
    getItem().then((user) => {
      if (user != null) {
        const storageUser = JSON.parse(user);

        dispatch(setInitUser(storageUser));
      }
    });
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <View style={commonStyles.mainView}>
          <MainStackNavigator />
        </View>
        <Loader />
      </Provider>
      <FlashMessage position="top" />
    </ErrorBoundary>
  );
};

export default gestureHandlerRootHOC(App);
