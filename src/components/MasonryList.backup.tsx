import React, {memo} from 'react';
import {Alert, Image, Pressable, ScrollView, StyleSheet, View, PressableProps} from 'react-native';
import {ms} from 'react-native-size-matters';
import {Restaurant} from '../api/types';
import {ComponentMatrix, emptyFunction} from '../constants/constants';
import useGridLayout from '../hooks/useGridLayout';
import {dispatch} from '../redux';
import {resetState, selectResturant} from '../redux/modules/bagSlice';
import {isCloseToBottom} from '../utils/functions';
export interface MasonryListProps {
  data: Restaurant[];
  showItemCount?: number;
  onEndReached?: (info: {distanceFromEnd: number}) => void | null | undefined;
  onPressRestaurant: (item: any, index: number) => void;
}

const ITEM_HEIGHT = [160, 112, 222, 222, 160, 112, 112, 222, 160];

const MasonryList: React.FC<MasonryListProps> = ({data, showItemCount = 3, onEndReached = emptyFunction, onPressRestaurant = emptyFunction}) => {
  const {ITEM_WIDTH, DEVICE_HEIGHT, DEVICE_WIDTH, GAP_HORIZONTAL, TOTAL_GAP_HORIZONTAL, SHOW_ITEM_COUNT, MARGIN_HORIZONTAL} = useGridLayout({showItemCount});

  const totalHeightOfAllElement = data.reduce((previousValue, currentValue, currentIndex) => previousValue + ITEM_HEIGHT[currentIndex % ITEM_HEIGHT.length], 15);

  const scrollMaxSize = totalHeightOfAllElement / SHOW_ITEM_COUNT;

  const renderItem = () => {
    const cols: React.JSX.Element[][] = Array.from({length: showItemCount}, () => []);
    let _colIndex = 0;
    let availableHeight = scrollMaxSize;

    data.forEach((item, index) => {
      let lHeight = ITEM_HEIGHT[index % ITEM_HEIGHT.length];
      const view = (
        <Pressable
          onPress={() => onPressRestaurant(item, index)}
          key={index}
          style={[
            styles.item,
            {
              height: lHeight,
              width: ITEM_WIDTH,
            },
          ]}>
          <Image style={[StyleSheet.absoluteFillObject, {resizeMode: 'cover'}]} source={{uri: item.logo}} />
        </Pressable>
      );

      if (lHeight < availableHeight) {
        cols[_colIndex].push(view);
        availableHeight = availableHeight - lHeight;
      } else {
        availableHeight = scrollMaxSize;
        _colIndex++;
      }
    });
    return cols.map((col) => {
      return <View style={{rowGap: GAP_HORIZONTAL}}>{col.map((item) => item)}</View>;
    });
  };

  return (
    <ScrollView
      onScroll={({nativeEvent}) => {
        const {distanceFromEnd, bIsCloseToBottom} = isCloseToBottom(nativeEvent);
        if (bIsCloseToBottom) {
          onEndReached({distanceFromEnd});
        }
      }}
      scrollEventThrottle={400}
      style={[styles.container, {marginHorizontal: MARGIN_HORIZONTAL}]}>
      <View style={{flexDirection: 'row', columnGap: GAP_HORIZONTAL}}>{renderItem()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    marginHorizontal: ComponentMatrix.HORIZONTAL_12,
  },
  subBody: {
    gap: ms(8),
  },
  item: {
    borderRadius: ms(8),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(MasonryList, (prevProps, nextProps) => Object.is(prevProps, nextProps));
