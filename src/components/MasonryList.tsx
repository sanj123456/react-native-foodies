import React, {memo} from 'react';
import {Alert, Image, Pressable, ScrollView, StyleSheet, View, PressableProps} from 'react-native';
import {ms} from 'react-native-size-matters';
import {Restaurant} from '../api/types';
import {ComponentMatrix, emptyFunction} from '../constants/constants';
import useGridLayout from '../hooks/useGridLayout';
import {dispatch} from '../redux';
import {resetState, selectResturant} from '../redux/modules/bagSlice';
import {isCloseToBottom} from '../utils/functions';
import FastImage from 'react-native-fast-image';
export interface MasonryListProps {
  data: Restaurant[];
  showItemCount?: number;
  onEndReached?: (info: {distanceFromEnd: number}) => void | null | undefined;
  onPressRestaurant: (item: any, index: number) => void;
}

const ITEM_HEIGHT = [
  [112, 160, 222],
  [222, 112, 160],
  [160, 222, 112],
];

const MasonryList: React.FC<MasonryListProps> = ({data, showItemCount = 3, onEndReached = emptyFunction, onPressRestaurant = emptyFunction}) => {
  const {ITEM_WIDTH, GAP_HORIZONTAL, MARGIN_HORIZONTAL} = useGridLayout({showItemCount});
  const maxCols = Math.round(data.length / showItemCount);
  // console.log(data.length, data.length / showItemCount, maxCols);
  const getImage = (item: Restaurant, height: number) => {
    return height === 112 ? item?.logoMd : height === 160 ? item?.logoLg : height === 222 ? item?.logoXl : item.logo;
  };
  const renderItem = () => {
    const cols: React.JSX.Element[][] = Array.from({length: showItemCount}, () => []);
    let _colIndex = 0;
    let sequence = 0;
    let currentItem = 0;

    const itemView = (item: Restaurant, index: number, lHeight: number) => (
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
        <FastImage style={StyleSheet.absoluteFillObject} source={{uri: getImage(item, lHeight) || item.logo}} />
      </Pressable>
    );

    data.forEach((item, index) => {
      let lHeight = ITEM_HEIGHT[_colIndex][sequence];
      sequence++;
      if (sequence === 3) sequence = 0;
      if (currentItem < maxCols) {
        const view = itemView(item, index, lHeight);
        // console.log('if', index, item.name, _colIndex, lHeight, currentItem);
        cols[_colIndex].push(view);
        currentItem++;
      } else {
        // console.log('else', index, _colIndex);
        if (_colIndex !== showItemCount - 1) _colIndex++;
        sequence = 0;
        lHeight = ITEM_HEIGHT[_colIndex][sequence];
        sequence++;
        currentItem = 1;
        const view = itemView(item, index, lHeight);
        // console.log('else', index, item.name, _colIndex, lHeight, currentItem);
        cols[_colIndex].push(view);
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
