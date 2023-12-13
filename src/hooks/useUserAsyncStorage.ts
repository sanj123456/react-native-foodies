import {useState, useEffect} from 'react';

import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {dispatch} from '../redux';
import {setInitUser} from '../redux/modules/profileSlice';

const useUserAsyncStorage = () => {
  const [user, setUser] = useState(null);
  const {getItem, setItem, removeItem} = useAsyncStorage('user');

  const setItemUser = (value: any) => {
    try {
      return setItem(JSON.stringify(value));
    } catch (error) {
      console.log({error});
    }
  };

  useEffect(() => {
    getItem().then((user) => {
      if (user != null) {
        const user1 = JSON.parse(user);
        setUser(user1);
        // dispatch(setInitUser(user1));
      }
    });
  }, []);

  return {
    storageUser: user,
    setUserStorage: setItemUser,
    removeUser: removeItem,
  };
};

export {useUserAsyncStorage};
export default useUserAsyncStorage;
