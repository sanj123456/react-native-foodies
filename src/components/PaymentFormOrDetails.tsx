import React from 'react';
import {FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {WebViewProps} from 'react-native-webview';
import {PaymentMethod} from '../api/types';
import {images} from '../core';
import {VGSWebView} from '../modules';
import TilledWebView from '../modules/TilledWebView';
import {useAppSelector} from '../redux';
import {colors, ms, vs} from '../styles';
import fontSize, {fonts} from '../styles/fonts';
import {Payment} from '../types';
import ListEmptyComponent from './ListEmptyComponent';

type Props = {
  selectedPayType: Payment;
  onDataChange?: (data?: any) => void;
  onMessage: WebViewProps['onMessage'];
  savedCards: any[];
  selectedIndex: number;
  onSavedCardChange: (index: number, val: boolean) => void;
  getGateway: () => void;
  restaurantPaymentAcceptType: PaymentMethod;
};

const getCardLogo = (cardType: string) => {
  const cardLogos = {
    Visa: images.visaCard,
    Mastercard: images.masterCard,
  };
  return cardLogos[cardType];
};

const PaymentFormOrDetails = (props: Props) => {
  const {isLoading} = useAppSelector((state) => state.Loader);
  const {subMerchantId, gateway} = useAppSelector((state) => state.gateway);
  const renderView = () => {
    switch (props.selectedPayType) {
      case 'Pay there':
        if (props.restaurantPaymentAcceptType === 'both' || props.restaurantPaymentAcceptType === 'pay-there') {
          return (
            <Text
              style={{
                fontSize: fontSize.fs11,
                color: colors.CoralRed,
                fontFamily: fonts.BGFlame,
              }}>
              Pay at Restaurant
            </Text>
          );
        } else {
          return null;
        }
      case 'New card':
        if (props.restaurantPaymentAcceptType === 'both' || props.restaurantPaymentAcceptType === 'online') {
          if (subMerchantId && gateway === 'jupiter') {
            return <VGSWebView onMessage={props.onMessage} />;
          } else if (gateway === 'authorize.net') {
            return <ListEmptyComponent>authorize.net</ListEmptyComponent>;
          } else if (gateway === 'tilled') {
            return <TilledWebView onMessage={props.onMessage} />;
          } else {
            return <ListEmptyComponent>No setup any payment method</ListEmptyComponent>;
          }
        } else {
          return null;
        }

      // return subMerchantId && gateway === 'jupiter' ? (
      //   <VGSWebView onMessage={props.onMessage} />
      // ) : gateway === 'authorize.net' ? (
      //   <ListEmptyComponent>authorize.net</ListEmptyComponent>
      // ) : gateway === 'tilled' ? (
      //   <TilledWebView onMessage={props.onMessage} />
      // ) : (
      //   <ListEmptyComponent>No setup any payment method</ListEmptyComponent>
      // );

      case 'Saved Card':
        if (props.restaurantPaymentAcceptType === 'both' || props.restaurantPaymentAcceptType === 'online') {
          return (
            <FlatList
              refreshControl={<RefreshControl enabled={true} onRefresh={props.getGateway} refreshing={isLoading} />}
              data={props.savedCards}
              ListEmptyComponent={<ListEmptyComponent>No data found</ListEmptyComponent>}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      height: vs(70),
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: ms(17),
                    }}>
                    <Image source={getCardLogo(item.cardLogo)} />
                    <View style={{flexGrow: 1}}>
                      <Text style={{fontFamily: fonts.BGFlameBold}}>{item.cardLogo}</Text>
                      <Text style={{fontFamily: fonts.BGFlame}}>{item.truncatedCardNumber}</Text>
                    </View>

                    <Pressable
                      onPress={() => {
                        props.onSavedCardChange(index, index !== props.selectedIndex);
                      }}
                      style={{}}>
                      <Image style={styles.checkbox} source={index === props.selectedIndex ? images.icCheck : images.icUncheck} />
                    </Pressable>
                  </View>
                );
              }}
            />
          );
        } else {
          return null;
        }
    }
  };

  return <View style={{marginTop: vs(8)}}>{renderView()}</View>;
};

export default PaymentFormOrDetails;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(16),
  },
  text: {
    fontSize: fontSize.fs13,
    fontFamily: fonts.BGFlame,
    color: colors.darkBlackText,
    flex: 1,
    marginStart: ms(9),
  },
  checkbox: {
    width: ms(20),
    height: ms(20),
  },
});
