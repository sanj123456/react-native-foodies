import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ToppingItem, Item, BagState} from '../../types';
import {DeliveryAddress} from '../../api/types';

const initialState = {
  items: [],
  restaurantId: '',
  restaurantIdForFavorite: '',
  locationId: '',
  locationAddress: '',
  method: undefined,
  deliveryAddress: {},
  deliveryMethod: '',
  deliveryZoneId: '',
  orderTiming: 'now',
  scheduledOn: '',
} as BagState;

const arraysMatchElements = (array1: string[], array2: string[]) => {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  if (set1.size !== set2.size) {
    return false;
  }

  for (const element of set1) {
    if (!set2.has(element)) {
      return false;
    }
  }

  return true;
};

/**
 * Returns the index of the first element in the array where predicate is true, and -1 otherwise.
 * @param state whole state object
 * @param action PayloadAction<Item> for payload
 */
const checkProductExists = (state: BagState, product_id: string) => {
  const existingProductIndex = state.items.findIndex(({id}) => id === product_id);
  return existingProductIndex;
};

const checkToppingIsListedOrNot = (toppings: Array<ToppingItem>, topping_id: string) => {
  return toppings.findIndex(({id}) => id === topping_id);
};

const extractIDs = (arr: any[]) => {
  return arr.map(({id}) => id);
};

const {actions, reducer: bagReducer} = createSlice({
  name: 'bag',
  initialState,
  reducers: {
    resetState: (state) => {
      state.items = initialState.items;
      state.restaurantId = initialState.restaurantId;
      state.locationId = initialState.locationId;
      state.locationAddress = initialState.locationAddress;
      state.method = initialState.method;
      state.deliveryAddress = initialState.deliveryAddress;
      state.deliveryMethod = initialState.deliveryMethod;
      state.deliveryZoneId = initialState.deliveryZoneId;
    },
    selectResturant: (state, action: PayloadAction<Pick<BagState, 'restaurantId'>>) => {
      state.restaurantId = action.payload.restaurantId;
    },
    selectResturantForFavorite: (state, action: PayloadAction<Pick<BagState, 'restaurantIdForFavorite'>>) => {
      state.restaurantIdForFavorite = action.payload.restaurantIdForFavorite;
    },
    removeResturant: (state) => {
      state.restaurantId = '';
      state.restaurantIdForFavorite = '';
    },
    selectLocation: (state, action: PayloadAction<Pick<BagState, 'locationId' | 'locationAddress'>>) => {
      state.locationId = action.payload.locationId;
      state.locationAddress = action.payload.locationAddress;
    },
    removeLocation: (state) => {
      state.locationId = '';
    },
    selectLocationMethod: (state, action: PayloadAction<Pick<BagState, 'method'>>) => {
      state.method = action.payload.method;
    },
    removeLocationMethod: (state) => {
      state.method = undefined;
    },
    selectLocationAndResturant: (state, action: PayloadAction<Pick<BagState, 'restaurantId' | 'locationId'>>) => {
      state.restaurantId = action.payload.restaurantId;
      state.locationId = action.payload.locationId;
    },
    removeLocationAndResturant: (state) => {
      state.restaurantId = '';
      state.locationId = '';
    },
    addItemToBagOrInBagItemQuantity: (state, action: PayloadAction<Item>) => {
      const arrPayloadToppingIds = [action.payload.id, ...extractIDs(action.payload.toppings)];

      const filteredModifierWithAdvancedPizzaOptions = action.payload.toppings.filter((x) => x?.advancedPizzaOptions);

      const mapedModifierWithAdvancedPizzaOptions = filteredModifierWithAdvancedPizzaOptions.map(({id, side, size}) => ({id, side, size}));

      let isNotAdded = true;
      for (let index = 0; index < state.items.length; index++) {
        const element = state.items[index];
        const b = [element.id, ...element.toppings.map(({id}) => id)];

        const a = element.toppings.filter((t) => t.advancedPizzaOptions);

        for (let aIndex = 0; aIndex < a.length; aIndex++) {
          const element = a[aIndex];
          let isBreak = false;
          for (let mIndex = 0; mIndex < mapedModifierWithAdvancedPizzaOptions.length; mIndex++) {
            const x = mapedModifierWithAdvancedPizzaOptions[mIndex];

            if (element.id === x.id && element.side !== x.side && element.size !== x.size) {
              isNotAdded = false;
              isBreak = true;
              break;
            }
          }
          if (isBreak) {
            break;
          }
        }

        if (arraysMatchElements(arrPayloadToppingIds, b)) {
          state.items[index].quantity += action.payload.quantity;
          isNotAdded = false;
          break;
        }
      }
      if (isNotAdded) {
        state.items.push(action.payload);
      }
    },
    updateQty: (state, action) => {
      const {index, quantity} = action.payload;

      if (quantity === 0) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity = quantity;
      }
    },
    updateQtyByid: (state, action) => {
      const {id: payload_id, quantity} = action.payload;

      const index = state.items.findIndex(({id}) => {
        return payload_id === id;
      });
      if (index != -1) {
        state.items[index].quantity = quantity;
      }
    },

    addOrUpdateToppings: (
      state,
      action: PayloadAction<
        ToppingItem & {
          product_id: string;
        }
      >,
    ) => {
      const existingProductIndex = checkProductExists(state, action.payload.product_id);
      if (existingProductIndex !== -1) {
        const {toppings} = state.items[existingProductIndex];

        const toppingIndex = checkToppingIsListedOrNot(toppings ?? [], action.payload.id);

        if (toppings && toppings?.length > 0 && toppingIndex !== -1) {
          state.items[existingProductIndex].toppings[toppingIndex].quantity = action.payload.quantity;
        } else {
          state.items[existingProductIndex].toppings.push(action.payload);
        }
      }
    },
    setDeliveryAddress: (state, action: PayloadAction<DeliveryAddress | {}>) => {
      state.deliveryAddress = action.payload;
    },
    setDeliveryZoneId: (state, action: PayloadAction<string>) => {
      state.deliveryZoneId = action.payload;
    },
    setDeliveryMethod: (state, action: PayloadAction<string>) => {
      state.deliveryMethod = action.payload;
    },
    setOrderTiming: (state, action: PayloadAction<'now' | 'later'>) => {
      state.orderTiming = action.payload;
    },
    setScheduledOn: (state, action: PayloadAction<string>) => {
      state.scheduledOn = action.payload;
    },
    addToBag: (state, action: PayloadAction<BagState>) => {
      state.items = action.payload.items;
      state.restaurantId = action.payload.restaurantId;
      state.locationId = action.payload.locationId;
      state.locationAddress = action.payload.locationAddress;
      state.method = action.payload.method;
      state.deliveryAddress = action.payload.deliveryAddress;
      state.deliveryMethod = action.payload.deliveryMethod;
      state.deliveryZoneId = action.payload.deliveryZoneId;
      state.restaurantIdForFavorite = action.payload.restaurantIdForFavorite;
      state.orderTiming = action.payload.orderTiming;
      state.scheduledOn = action.payload.scheduledOn;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addItemToBagOrInBagItemQuantity,
  addOrUpdateToppings,
  updateQty,
  updateQtyByid,
  selectResturant,
  selectResturantForFavorite,
  removeResturant,
  selectLocation,
  removeLocation,
  selectLocationAndResturant,
  removeLocationAndResturant,
  selectLocationMethod,
  removeLocationMethod,
  resetState,
  setDeliveryAddress,
  setDeliveryZoneId,
  setDeliveryMethod,
  addToBag,
  setOrderTiming,
  setScheduledOn,
} = actions;

export default bagReducer;
