import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {API_Ordering, ICategory, ParamRestaurantMenu, StatusCodes} from '../api';
import {BagButton, FavoriteAndUnfavoriteButton, ListEmptyComponent, withUser} from '../components';
import {images} from '../core';
import {useModal} from '../hooks';
import {dispatch} from '../redux';
import {useAppSelector} from '../redux/hooks';
import {setComingFrom} from '../redux/modules/navigationSlice';
import {stopLoading, startLoading} from '../redux/modules/loading-slice';
import {colors, commonStyles, fontSize, fonts, ms, vs} from '../styles';
import {StackScreenRouteProp} from '../types/navigationTypes';
import {prettyPrint, prettyPrintError, showDangerMessage} from '../utils/functions';
import {ComponentMatrix, HIT_SLOP} from '../constants/constants';
import FastImage from 'react-native-fast-image';

const Menu: React.FC<NativeStackScreenProps<StackScreenRouteProp, 'Menu'>> = ({navigation, route}) => {
  const {passedData} = route.params;
  const [listCategories, setListCategories] = useState<Partial<ICategory>[]>([]);
  const [listMenuBasedOnCategory, setListMenuBasedOnCategory] = useState([]);
  const [selectedCatIndex, setSelectedCatIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [usuals, setUsuals] = useState([]);
  const [popularOfRestaurant, setPopularOfRestaurant] = useState([]);

  const {ModalContainer, toggleModal, visible, setVisible, messageRef: messageRefSigninModal} = useModal();
  const {ModalContainer: ModalPopularOfRestaurant, toggleModal: toggleModal2, visible: visible2, setVisible: setVisible2} = useModal();

  const {user, accessToken} = useAppSelector((state) => state.profile);
  const {
    restaurant: {
      ordering: {hideOrderUsualAndPopular},
    },
  } = useAppSelector((state) => state.restaurant);
  const {scheduledOn} = useAppSelector((state) => state.itemBag);

  useEffect(() => {
    API_Ordering.restaurant_categories(passedData).then(({data}) => {
      setIsLoading(false);
      setListCategories(data.categories.map(({_id, categoryName}: any) => ({_id, categoryName})));

      if (data.categories.length) {
        setSelectedCatIndex(0);
      }

      const get_popular_of_restaurant = async () => {
        try {
          const response = await API_Ordering.popular_of_restaurant({locationId: passedData?.locationId});
          const {code, data} = response;
          if (code === StatusCodes.SUCCESS) {
            setPopularOfRestaurant(data);
          }
        } catch (error) {
          console.log({error});
        }
      };
      get_popular_of_restaurant();
    });
  }, [passedData]);

  useEffect(() => {
    if (!accessToken) return;

    const get_customer_usuals = async () => {
      try {
        const response = await API_Ordering.customer_usuals({
          customerId: user.customer._id,
          restaurant: passedData?.restaurantId,
        });
        const {code, data} = response;
        if (code === StatusCodes.SUCCESS) {
          setUsuals(data);
        }
      } catch (error) {
        console.log({error});
      }
    };
    get_customer_usuals();
  }, [user.customer._id, passedData]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMenu = async () => {
      if (selectedCatIndex >= 0) {
        const params: ParamRestaurantMenu = {
          ...passedData,
          categoryId: listCategories[selectedCatIndex]._id ?? '',
          locationId: passedData.locationId,
          method: passedData.method,
        };
        if (scheduledOn) {
          params['schedule'] = scheduledOn;
        }

        try {
          const response = await API_Ordering.restaurant_menu(params, controller);
          if (response.code === StatusCodes.SUCCESS) {
            setIsLoading(false);
            setListMenuBasedOnCategory(response.data.items);
          } else {
          }
        } catch (error) {
          // Handle errors here, you can differentiate specific errors if needed
          console.error('Error:', error);
        } finally {
          // Code that runs whether the request succeeds or fails
        }
      }
    };

    fetchMenu();

    return () => {
      controller.abort();
    };
  }, [selectedCatIndex, passedData, scheduledOn]);

  const renderCategory = ({item, index}: any) => {
    return (
      <Pressable
        style={{
          marginHorizontal: 5,
        }}
        onPress={() => {
          setSelectedCatIndex(index);
        }}>
        {index === selectedCatIndex ? (
          <>
            <Text style={[menuStyles.locationText, {color: colors.headerbg}]}>{item?.categoryName}</Text>
            <View
              style={{
                height: 2,
                width: 15,
                backgroundColor: colors.headerbg,
                borderRadius: 2,
                marginTop: 10,
                alignSelf: 'center',
              }}
            />
          </>
        ) : (
          <Text
            style={{
              color: '#777676',
              fontSize: fontSize.fs16,
              fontFamily: fonts.BGFlame,
              fontWeight: 'normal',
            }}>
            {item?.categoryName}
          </Text>
        )}
      </Pressable>
    );
  };

  const renderItem = ({item, index, onPress = () => {}}: any) => {
    return (
      <Pressable
        style={[menuStyles.restaurantItemsWrapper, {marginTop: 24}]}
        onPress={() => {
          onPress?.();
          navigation.navigate('OrderDetailPage', {
            item_id: item._id,
            isCommingFromBag: false,
          });
        }}>
        <View style={{width: 100}}>
          {item?.imageUrl ? (
            <>
              <FastImage
                style={{
                  height: 70,
                  width: 100,
                  borderTopLeftRadius: 10,
                }}
                resizeMode="stretch"
                source={{uri: item.imageUrl}}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[menuStyles.locationTextAdd]}>${item.price}</Text>
              </View>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 90,
                backgroundColor: '#F1F1F1',
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}>
              <Text style={[menuStyles.locationTextAdd]}>${item.price}</Text>
            </View>
          )}
        </View>
        <View
          style={{
            flex: 1,
            marginHorizontal: ComponentMatrix.HORIZONTAL_16,
          }}>
          <View style={{marginTop: vs(8), flexDirection: 'row'}}>
            <Text style={[menuStyles.locationTextAdd, {flexShrink: 1}]}>{item?.name}</Text>
            {item?.isCombo && (
              <View
                style={{
                  backgroundColor: '#fee6e0',
                  marginHorizontal: ms(5),
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: ms(8),
                  borderRadius: ms(5),
                  maxHeight: vs(35),
                }}>
                <Text
                  style={{
                    textTransform: 'uppercase',
                    fontSize: fontSize.fs11,
                    color: colors.CoralRed,
                    fontFamily: fonts.BGFlame,
                  }}>
                  Combo Meal
                </Text>
              </View>
            )}
          </View>
          <Text numberOfLines={2} style={[menuStyles.itemTxt, {marginTop: vs(8)}]}>
            {item?.description}
          </Text>
        </View>
      </Pressable>
    );
  };
  const addToFavorite = async () => {
    const customerId = user.customer._id;

    try {
      const response = await API_Ordering.add_fav_restaurant({
        customerId,
        restaurantId: passedData?.restaurantId,
      });

      if (response.code === StatusCodes.SUCCESS) {
      }
    } catch (error) {
      console.log({error});
    }
  };

  return (
    <View style={commonStyles.mainView}>
      <SafeAreaView style={{backgroundColor: colors.headerbg}} />
      <StatusBar barStyle={'light-content'} hidden={false} backgroundColor={colors.headerbg} />
      <View style={menuStyles.headerView}>
        <Pressable hitSlop={HIT_SLOP} style={{position: 'absolute', left: ComponentMatrix.HORIZONTAL_16, zIndex: 1}} onPress={() => navigation.goBack()}>
          <Image source={images.icHeaderBack} />
        </Pressable>
        <Text style={menuStyles.txt}>Menu</Text>
        <View style={{flexDirection: 'row', position: 'absolute', right: ComponentMatrix.HORIZONTAL_16}}>
          <FavoriteAndUnfavoriteButton />
          <BagButton />
        </View>
      </View>
      {isLoading === false ? (
        <SafeAreaView style={{flex: 1}}>
          {!hideOrderUsualAndPopular && (
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                alignSelf: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Pressable
                onPress={() => {
                  if (accessToken) {
                    toggleModal();
                  } else {
                    dispatch(
                      setComingFrom({
                        isComingFrom: 'Menu',
                      }),
                    );
                    navigation.navigate('SignIn');
                  }
                }}
                style={[menuStyles.buttonWrapper, {}]}>
                <Text style={{color: colors.headerbg, textAlign: 'center'}}>My Usuals</Text>
              </Pressable>
              <Pressable onPress={toggleModal2} style={[menuStyles.buttonWrapper, {marginLeft: 0}]}>
                <Text style={{color: colors.headerbg, textAlign: 'center'}}>Popular</Text>
              </Pressable>
            </View>
          )}
          <FlatList
            horizontal
            data={listCategories}
            keyExtractor={(item: any, index) => item._id}
            renderItem={renderCategory}
            style={{
              marginTop: vs(15),
              flexGrow: 0,
            }}
            contentContainerStyle={{
              paddingHorizontal: vs(18),
              columnGap: vs(18),
            }}
          />
          <FlatList
            data={listMenuBasedOnCategory}
            renderItem={renderItem}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            ListEmptyComponent={
              <ListEmptyComponent
                viewStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                Currently no data here
              </ListEmptyComponent>
            }
          />
        </SafeAreaView>
      ) : null}
      <ModalContainer
        contentContainerStyle={{
          marginHorizontal: 0,
        }}
        visible={visible}
        onClose={() => {
          setVisible(!visible);
        }}
        messageRef={messageRefSigninModal}>
        <FlatList data={usuals} renderItem={renderItem} ListEmptyComponent={<ListEmptyComponent>{'No usuals found'}</ListEmptyComponent>} />
      </ModalContainer>

      <ModalPopularOfRestaurant
        contentContainerStyle={{
          marginHorizontal: 0,
        }}
        visible={visible2}
        onClose={() => {
          setVisible2(!visible2);
        }}>
        <FlatList
          data={popularOfRestaurant}
          renderItem={(props) =>
            renderItem({
              ...props,
              onPress: () => {
                setVisible2(false);
              },
            })
          }
          ListEmptyComponent={<ListEmptyComponent>{'No popular items found'}</ListEmptyComponent>}
        />
      </ModalPopularOfRestaurant>
    </View>
  );
};

export default withUser(Menu);

const styles = StyleSheet.create({
  linkBtn: {
    marginVertical: vs(10),
  },
  linkBtnText: {
    color: colors.headerbg,
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
  },
  subTitleText: {
    color: '#525f7f',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlame,
    marginTop: vs(10),
  },
});

export const menuStyles = StyleSheet.create({
  headerView: {
    height: 100,
    backgroundColor: colors.headerbg,

    flexDirection: 'row',
    marginBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  rightView: {
    height: 30,
    width: 30,
    marginRight: 50,
  },
  txt: {
    color: colors.white,
    fontSize: fontSize.fs20,
    fontFamily: fonts.BGFlameBold,
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
  },
  stepperActive: {
    height: 12,
    width: 34,
    borderRadius: 8,
    marginTop: 5,
  },
  stepperInActive: {
    height: 13,
    backgroundColor: '#F0F2F5',
    width: 38,
    borderRadius: 8,
    marginTop: 5,
  },
  headerRightText: {
    textAlign: 'center',
    paddingTop: 5,
    color: '#677A8E',
  },
  locationText: {
    color: '#ABABAB',
    fontSize: fontSize.fs16,
    fontFamily: fonts.BGFlameBold,
    fontWeight: 'normal',
  },
  locationTextAdd: {
    color: '#343434',
    fontSize: fontSize.fs14,

    fontWeight: '700',
  },
  itemTxt: {
    color: '#808080',
    fontSize: fontSize.fs11,
  },
  locationIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',

    top: 6,
  },
  locationWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    paddingBottom: 10,
    marginTop: 10,
  },
  restaurantItemsWrapper: {
    marginHorizontal: '4%',
    marginVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 10,
    ...commonStyles.shadowStyles,
    marginTop: 10,
    flexDirection: 'row',
  },
  searchIcon: {},
  filterIcon: {
    top: 10,
  },
  textInput: {
    height: 35,
    paddingLeft: 10,
    marginRight: 10,
  },
  icRestaurantStyle: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  buttonWrapper: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...commonStyles.shadowStyles,
    paddingVertical: '4%',
    borderRadius: 10,
    width: '48%',
  },
});
