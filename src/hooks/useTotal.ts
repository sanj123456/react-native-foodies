import store from '../redux';

const useTotal = () => {
  const {items} = store.getState().itemBag;
  const numSums = items.length;
  const numSumsQty = items.reduce((sum, c) => {
    return sum + c.quantity;
  }, 0);
  const tSum = items.reduce((accumulator: any, currentValue: any) => {
    let sumOfTotal = 0;

    if (Array.isArray(currentValue?.toppings) && currentValue?.toppings.length > 0) {
      sumOfTotal = currentValue?.toppings?.reduce((a: any, c: any, index: any) => {
        let toppingsQty = c?.quantity ?? 1;
        return a + toppingsQty * c?.price;
      }, 0);
    }
    return accumulator + currentValue?.quantity * (currentValue?.price + sumOfTotal);
  }, 0);
  const sumOfPrice = Math.round((tSum + Number.EPSILON) * 100) / 100;

  return {numSums, numSumsQty, sumOfPrice};
};

export {useTotal};
export default useTotal;
