import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView, StatusBar} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import {getCurrentLocation, getLocationData} from '../core/GlobalLocation';

import ThemeRedHeader from '../components/ThemeRedHeader';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackScreenRouteProp} from '../types/navigationTypes';
import {ResponseChooseLocation} from '../api/types';
import {API_Ordering, StatusCodes} from '../api';
import {colors} from '../styles';

const MapOfRestauntsNearOfUserScreen: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'MapOfRestauntsNearOfUserScreen'>> = ({navigation, route}) => {
  const [location, setLocation] = useState<Region | undefined>();
  const [errorMsg, setErrorMsg] = useState(null);
  const [alllocationdata, Setalllocationdata] = useState<ResponseChooseLocation[]>([]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locationData = await getCurrentLocation();
        setLocation({...locationData, latitudeDelta: 0.0922, longitudeDelta: 0.0421});
        const data = await API_Ordering.ordering_nearby(locationData);
        if (data.code === StatusCodes.SUCCESS) {
          Setalllocationdata(data?.data);
        }
      } catch (err) {}
    };

    fetchLocation();
  }, []);
  return (
    <View>
      <SafeAreaView style={{backgroundColor: colors.headerbg}} />
      <StatusBar barStyle={'light-content'} hidden={false} backgroundColor={colors.headerbg} />
      <ThemeRedHeader
        headerTitle="Nearby restaurants"
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <MapView style={styles.mapStyle} initialRegion={location} provider={PROVIDER_GOOGLE} showsUserLocation>
        {/* fetch all restarunt near about location data and loop through render Marker */}
        {alllocationdata.map((marker: any, index: number) => {
          return <Marker key={`${index}`} title={marker.name} coordinate={{latitude: marker.latLng[0], longitude: marker.latLng[1]}} />;
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.headerbg,
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapOfRestauntsNearOfUserScreen;
