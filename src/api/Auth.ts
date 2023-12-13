import store, {getStore} from '../redux';
import {makeBearerToken} from './api-functions';
import {AxiosAuthInstance} from './interceptor';

import {ParamLogin, ParamResetPassword, ParamSignUp, ParamUpdateFCMToken, ParamUpdateProfile, ParamVerifyOTP} from './types';
import {AuthUrls} from './url';
import {ResponseType} from './types';

class Auth {
  appBearerToken: string;
  customer_id: string;

  constructor() {
    const {accessToken, user} = getStore().profile;
    this.appBearerToken = makeBearerToken(accessToken);
    this.customer_id = user._id;
    // this.customer_id = '6494187dd1897a33c4923f1f';
  }

  initData = () => {
    const {accessToken, user} = getStore().profile;
    this.appBearerToken = makeBearerToken(accessToken);
    this.customer_id = user._id;
    // this.customer_id = '6494187dd1897a33c4923f1f';
  };

  get_headers = () => {
    const {accessToken, user} = getStore().profile;
    return {
      Authorization: makeBearerToken(accessToken),
    };
  };

  sign_up = (params: Partial<ParamSignUp>): Promise<ResponseType> => {
    return AxiosAuthInstance.post(AuthUrls.sign_up, params);
  };
  login = (params: ParamLogin): Promise<ResponseType> => {
    return AxiosAuthInstance.post(AuthUrls.login, params);
  };
  reset_password = (params: ParamResetPassword): Promise<ResponseType> => {
    return AxiosAuthInstance.post(AuthUrls.reset_password, params);
  };
  verify_otp = (params: ParamVerifyOTP): Promise<ResponseType> => {
    return AxiosAuthInstance.post(AuthUrls.verify_otp, params);
  };
  get_profile = (id: string): Promise<ResponseType> => {
    return AxiosAuthInstance.get(AuthUrls.get_profile(id), {
      headers: this.get_headers(),
    });
  };
  update_profile = (params: ParamUpdateProfile): Promise<ResponseType> => {
    return AxiosAuthInstance.patch(AuthUrls.update_profile(''), params);
  };
  update_fcm_token = (params: ParamUpdateFCMToken): Promise<ResponseType> => {
    return AxiosAuthInstance.post(AuthUrls.update_fcm_token, params);
  };
  get_auth_profile = (controller?: AbortController): Promise<ResponseType> => {
    this.initData();

    if (!this.customer_id && !this.appBearerToken) {
      return Promise.reject<ResponseType>();
    }

    return AxiosAuthInstance.get(AuthUrls.get_auth_profile(this.customer_id), {
      headers: {Authorization: this.appBearerToken},
      signal: controller?.signal,
    });
  };
}

const API_Auth = new Auth();

export {API_Auth};
