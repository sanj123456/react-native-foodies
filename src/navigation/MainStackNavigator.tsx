import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import {
  AllListingsCategoriesScreens,
  AllRestaurants,
  Bag,
  ChooseLocation,
  FavoriteRestaurantScreen,
  ForgotPassword,
  GroceriesScreen,
  MapOfRestauntsNearOfUserScreen,
  Menu,
  OnboardingScreen,
  OrderCheckout,
  OrderDetailPage,
  OrderSuccess,
  OrderSummary,
  Payment,
  PaymentMethod,
  PaymentMethod1,
  PrivacyPolicy,
  SignIn,
  SignUp,
  TermAndConditions,
  VerifyOTP,
  VGSWebView,
} from '../modules';
import {useAppSelector} from '../redux/hooks';
import {colors, commonStyles} from '../styles';
import {StackScreenRouteProp} from '../types/navigationTypes';
import DrawerComponent from './DrawerNavigator';
import {navigationRef} from './RootNavigation';

const MyTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(255, 255, 255)',
  },
};

const Stack = createNativeStackNavigator<StackScreenRouteProp>();
const MainStackNavigator = ({}) => {
  const {accessToken} = useAppSelector((state) => state.profile);

  return (
    <View style={commonStyles.mainView}>
      <NavigationContainer ref={navigationRef} theme={MyTheme}>
        <Stack.Navigator screenOptions={{headerShown: false, statusBarColor: colors.headerbg}}>
          {accessToken === '' && <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />}
          {accessToken === '' && (
            <Stack.Group navigationKey={accessToken.length ? 'login' : 'logout'}>
              <Stack.Screen name={'SignIn'} component={SignIn} />
              <Stack.Screen name={'ForgotPassword'} component={ForgotPassword} />
              <Stack.Screen name={'SignUp'} component={SignUp} />
              <Stack.Screen name={'VerifyOTP'} component={VerifyOTP} />
            </Stack.Group>
          )}
          <Stack.Screen name={'Drawer'} component={DrawerComponent} />
          <Stack.Screen name={'AllListingsCategoriesScreens'} component={AllListingsCategoriesScreens} />
          <Stack.Screen name={'OrderSuccess'} component={OrderSuccess} />
          <Stack.Screen name={'Menu'} component={Menu} />
          <Stack.Screen name={'MapOfRestauntsNearOfUserScreen'} component={MapOfRestauntsNearOfUserScreen} />
          <Stack.Screen name={'OrderDetailPage'} component={OrderDetailPage} />
          <Stack.Screen name={'Bag'} component={Bag} />
          <Stack.Screen name={'OrderSummary'} component={OrderSummary} />
          <Stack.Screen name={'Payment'} component={Payment} />
          <Stack.Screen name={'PaymentMethod'} component={PaymentMethod} />
          <Stack.Screen name={'PaymentMethod1'} component={PaymentMethod1} />
          <Stack.Screen name={'ChooseLocation'} component={ChooseLocation} />
          <Stack.Screen name={'FavoriteRestaurantScreen'} component={FavoriteRestaurantScreen} />
          <Stack.Screen name={'AllRestaurants'} component={AllRestaurants} />
          <Stack.Screen name={'GroceriesScreen'} component={GroceriesScreen} />
          <Stack.Screen name={'OrderCheckout'} component={OrderCheckout} />
          <Stack.Screen name={'TermAndConditions'} component={TermAndConditions} />
          <Stack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} />
          <Stack.Screen name={'VGSWebView'} component={VGSWebView} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default MainStackNavigator;
