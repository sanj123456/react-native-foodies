import store from '../redux';
import AxiosInstance from './interceptor';
import {ParamsAddCard, PaymentProviders, ResponseType} from './types';
import {CardsUrls, OrderUrls} from './url';

class Cards {
  find_all_cards_customer = (provider: PaymentProviders): Promise<ResponseType> => {
    return AxiosInstance.get(CardsUrls.find_all_cards_customer(provider), {
      headers: {
        Authorization: store.getState().profile.accessToken,
      },
    });
  };

  addCard = (params: ParamsAddCard): Promise<ResponseType> => {
    return AxiosInstance.post(CardsUrls.add_card, params, {
      headers: {
        Authorization: store.getState().profile.accessToken,
      },
    });
  };
}

const API_Cards = new Cards();

export {API_Cards};
export default API_Cards;
