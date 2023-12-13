import {ms, vs} from 'react-native-size-matters';

export const AuthRoute = ['SignIn', 'ForgotPassword', 'SignUp', 'VerifyOTP'];
export const emptyFunction = () => {};
type Environment = 'production' | 'development';
const isStagEnv = (env: Environment) => env === 'development';
export const ComponentMatrix = {
  HORIZONTAL_12: ms(12),
  HORIZONTAL_16: ms(16),
  HORIZONTAL_30: ms(30),
  insets: {
    bottom: vs(34),
    left: 0,
    right: 0,
    top: vs(47),
  },
};

const env: Environment = 'production';

export const isStag = isStagEnv(env);

export const API_KEYS = Object.freeze(
  isStag
    ? {
        GOOGLE_API_KEY: 'AIzaSyDwRllbGvTPJiumHCJ3XaNXuPeH-BxLzw4',
        partner: '63bbf1b84363e42292c7e748',
        API_URL: 'https://stagingmyordering.com/api/eat',
        partnerId: '63bbf1b84363e42292c7e747',
        tilled_uri: 'https://app.myordering.online/tilledtest.html',
      }
    : {
        GOOGLE_API_KEY: 'AIzaSyDwRllbGvTPJiumHCJ3XaNXuPeH-BxLzw4',
        partner: '638667fea3bd29bee53deab4',
        API_URL: 'https://app.myordering.online/api/eat',
        partnerId: '63bbf1b84363e42292c7e747',
        tilled_uri: 'https://app.myordering.online/tilledtest.html',
      },
);

export const JUPITER_VGS = Object.freeze(isStag ? {env: 'sandbox-platform', vaultId: 'tntne5koztu', environment: 'sandbox'} : {env: 'platform', vaultId: 'tntaxfujub5', environment: 'live'});

export const SPICES = 'High,Low,Medium'.split(',').map((spice) => ({title: spice, isSelected: false}));

export const HIT_SLOP = {
  top: 24,
  bottom: 24,
  left: 24,
  right: 24,
};

export const USER_LOGIN_SKIPED = 'USER_LOGIN_SKIPED';
