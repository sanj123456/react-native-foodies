import {createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {images} from '../core/images';
import {useUserAsyncStorage} from '../hooks';
import {FAQs, Home, OrderHistory, Profile, TermAndConditions} from '../modules';
import {useAppSelector} from '../redux/hooks';
import {colors, fonts, fontSize, ms} from '../styles';
import {DrawerScreenRouteProp, StackScreenRouteProp} from '../types/navigationTypes';
import {handleSignOut} from '../utils/functions';
import HomeNew from '../modules/HomeNew';
import {ComponentMatrix} from '../constants/constants';
import DeviceInfo from 'react-native-device-info';
const Drawer = createDrawerNavigator<DrawerScreenRouteProp>();
const DrawerComponent: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'Drawer'>> = ({navigation, route}) => {
  const {user, accessToken} = useAppSelector((state) => state.profile);
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.white,
        drawerItemStyle: {marginHorizontal: 15, marginVertical: 5},
        drawerLabelStyle: {
          fontFamily: fonts.BGFlameLight,
          color: colors.white,
          fontSize: fontSize.fs17,
          marginLeft: -20,
        },
      }}
      drawerContent={(props) => <DrawerContentComponent {...props} />}>
      <Drawer.Screen
        name={'Home'}
        component={HomeNew}
        options={{
          drawerLabel: 'Home',
          drawerIcon: () => <Image style={{marginLeft: 5}} source={images.home_icmenu} />,
        }}
      />
      {/* <Drawer.Screen
        name={'Home'}
        component={Home}
        options={{
          drawerLabel: 'Home',
          drawerIcon: () => <Image style={{marginLeft: 5}} source={images.home_icmenu} />,
        }}
      /> */}
      {accessToken.length > 0 && (
        <Drawer.Group navigationKey={accessToken.length ? 'login' : 'logout'}>
          <Drawer.Screen
            name={'Profile'}
            component={Profile}
            options={{
              drawerLabel: 'Profile',
              drawerIcon: () => <Image style={{marginLeft: 5}} source={images.user_icmenu} />,
            }}
          />
          <Drawer.Screen
            name={'OrderHistory'}
            component={OrderHistory}
            options={{
              drawerLabel: 'Order History',
              drawerIcon: () => <Image style={{marginLeft: 5}} source={images.orderhistory_icmenu} />,
            }}
          />
        </Drawer.Group>
      )}
      <Drawer.Screen
        name={'TermAndConditions'}
        component={TermAndConditions}
        options={{
          drawerLabel: 'Terms & Conditions',
          drawerIcon: () => <Image style={{marginLeft: 5}} source={images.term_icmenu} />,
        }}
      />
      {/* <Drawer.Screen
        name={'FAQs'}
        component={FAQs}
        options={{
          drawerLabel: 'FAQs',
          drawerIcon: () => <Image style={{marginLeft: 5}} source={images.faq_icmenu} />,
        }}
      /> */}
    </Drawer.Navigator>
  );
};
export default DrawerComponent;
const DrawerContentComponent = (props: DrawerContentComponentProps) => {
  const {state, descriptors, navigation} = props;
  const {drawerLabelStyle} = descriptors[state.routes[state.index].key].options;
  const {user, accessToken} = useAppSelector((state) => state.profile);
  const {removeUser} = useUserAsyncStorage();
  return (
    <>
      <View style={styles.root}>
        <DrawerContentScrollView {...props} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
          <Pressable
            onPress={() => {
              props.navigation.toggleDrawer();
            }}
            style={{height: 40, alignItems: 'flex-end', marginRight: 10}}>
            <Image style={styles.IconStyles} source={images.Drawerback} />
          </Pressable>
          {accessToken !== '' && (
            <View
              style={{
                marginHorizontal: ComponentMatrix.HORIZONTAL_12,
                alignItems: 'flex-start',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  color: colors.white,
                  fontSize: fontSize.fs18,
                  fontFamily: fonts.BGFlameBold,
                }}>
                {user.customer.name}
              </Text>
              {/* <Image style={{height: 18, width: '50%', marginBottom: 30}} source={images.Star} /> */}
            </View>
          )}
          <DrawerItemList {...props} />
          {accessToken !== '' && <DrawerItem label="Sign Out" labelStyle={drawerLabelStyle} onPress={handleSignOut} icon={() => <Image source={images.signout_icmenu} style={{marginLeft: 12}} />} />}
        </DrawerContentScrollView>
        <Text
          style={{
            marginLeft: 30,
            marginBottom: 20,
            color: colors.white,
            fontSize: fontSize.fs16,
            fontFamily: fonts.BGFlameLight,
            alignItems: 'flex-start',
          }}>
          Version {DeviceInfo.getVersion()}
        </Text>
        {accessToken === '' && (
          <Pressable
            onPress={() => {
              navigation.navigate('SignIn');
            }}
            style={styles.btnLogin}>
            <Text style={styles.btnLoginText}>Login</Text>
          </Pressable>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.Cinnabar,
  },
  scrollView: {
    marginBottom: 20,
    paddingTop: 10,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  IconStyles: {
    width: 40,
    height: 35,
    resizeMode: 'contain',
  },
  btnLogin: {
    width: '100%',
    height: ms(50),
    backgroundColor: colors.whiteAlpha(0.3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLoginText: {
    color: colors.white,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
  },
});
