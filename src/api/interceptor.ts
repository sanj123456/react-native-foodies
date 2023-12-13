import axios, {AxiosError, AxiosResponse} from 'axios';
import store, {dispatch} from '../redux';
import {startLoading, stopLoading} from '../redux/modules/loading-slice';
import {partner} from './url';
import {API_KEYS} from '../constants/constants';
import {Error, USER_INACTIVE} from './StatusCodes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {batch} from 'react-redux';
import {signOut} from '../redux/modules/profileSlice';
import {resetState} from '../redux/modules/bagSlice';

const API_URL = API_KEYS.API_URL;
// const API_URL = 'https://thebitedev.com/api/eat/partner-app';

axios.defaults.baseURL = API_URL;
// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
axios.defaults.headers.common['partner'] = partner;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const toggleLoader = () => {
  return;
  if (store.getState().Loader.isLoading) {
    dispatch(stopLoading());
  } else {
    dispatch(startLoading());
  }
};

// Create Instance
const AxiosInstance = axios.create({});
const AxiosAuthInstance = axios.create({});

const response_interceptor_onFulfilled = (response: AxiosResponse) => {
  toggleLoader();

  return response?.data;
};
const response_interceptor_onRejected = async (error: AxiosError) => {
  if (error?.response?.data?.message === USER_INACTIVE) {
    await AsyncStorage.removeItem('user');
    batch(() => {
      store.dispatch(signOut());
    });
  }
  return Promise.reject(error?.response?.data);
};

AxiosAuthInstance.interceptors.request.use(
  function (config) {
    toggleLoader();
    return config;
  },
  function (error) {
    console.log({error});
    return Promise.reject(error);
  },
);

AxiosAuthInstance.interceptors.response.use(response_interceptor_onFulfilled, response_interceptor_onRejected);

// Add a request interceptor
AxiosInstance.interceptors.request.use(
  function (config) {
    toggleLoader();
    return config;
  },
  function (error) {
    console.log({error});
    return Promise.reject(error);
  },
);

AxiosInstance.interceptors.response.use(response_interceptor_onFulfilled, response_interceptor_onRejected);

export default AxiosInstance;
export {AxiosAuthInstance};
