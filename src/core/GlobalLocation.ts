import Geolocation, {GeolocationResponse} from '@react-native-community/geolocation';
import {showDangerMessage} from '../utils/functions';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {Platform} from 'react-native';
import {API_KEYS} from '../constants/constants';
export interface LocationData {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  place_id: string;
  result: any;
}

export interface CurrentLocationData {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = (): Promise<CurrentLocationData> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        resolve({latitude, longitude});
      },
      (error) => {
        reject(error.message);
      },
      {enableHighAccuracy: false, timeout: 15000},
    );
  });
};

const getCurrentPosition = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        const {latitude, longitude} = position.coords;
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEYS.GOOGLE_API_KEY}`)
          .then((response) => response.json())
          .then((data) => {
            const formattedAddress = data.results[0]?.formatted_address;
            if (formattedAddress) {
              resolve({latitude, longitude, formattedAddress, place_id: data.results[0]?.place_id, result: data.results[0]});
            } else {
              reject(new Error('Failed to retrieve the formatted address.'));
            }
          })
          .catch((error) => {
            showDangerMessage(error.message);
            reject(error);
          });
      },
      (error) => {
        showDangerMessage(error.message);
        reject(error);
      },
      {enableHighAccuracy: false, timeout: 15000},
    );
  });
};

export const getLocationData = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    (async () => {
      if (Platform.OS === 'android') {
        Geolocation.requestAuthorization(
          async () => {
            if (Platform.OS === 'android') {
              await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
                interval: 10000,
                fastInterval: 5000,
              });
            }
            try {
              resolve(await getCurrentPosition());
            } catch (error) {
              console.log({error});
              reject(error);
            }
          },
          (error) => {
            reject(error);
          },
        );
      } else {
        try {
          resolve(await getCurrentPosition());
        } catch (error) {
          console.log({error});
          reject(error);
        }
      }
    })();
  });
};
