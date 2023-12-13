import {useWindowDimensions} from 'react-native';
import {ms} from 'react-native-size-matters';

interface Props {
  marginHorizontal?: number;
  gapHorizontal?: number;
  showItemCount?: number;
}

const useGridLayout = ({marginHorizontal = ms(12), gapHorizontal = ms(8), showItemCount = 3}: Props) => {
  const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = useWindowDimensions();

  const MARGIN_HORIZONTAL = marginHorizontal;
  const GAP_HORIZONTAL = gapHorizontal;
  const SHOW_ITEM_COUNT = showItemCount;

  const TOTAL_MARGIN_HORIZONTAL = 2 * MARGIN_HORIZONTAL;
  const TOTAL_GAP_HORIZONTAL = (SHOW_ITEM_COUNT - 1) * GAP_HORIZONTAL;
  const TOTAL_SPACEING = TOTAL_MARGIN_HORIZONTAL + TOTAL_GAP_HORIZONTAL;

  const ITEM_WIDTH = (DEVICE_WIDTH - TOTAL_SPACEING) / SHOW_ITEM_COUNT;

  return {MARGIN_HORIZONTAL, GAP_HORIZONTAL, SHOW_ITEM_COUNT, TOTAL_MARGIN_HORIZONTAL, TOTAL_GAP_HORIZONTAL, TOTAL_SPACEING, ITEM_WIDTH, DEVICE_HEIGHT, DEVICE_WIDTH};
};

export {useGridLayout};
export default useGridLayout;
