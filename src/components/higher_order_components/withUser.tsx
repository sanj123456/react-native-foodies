import React from 'react';
import {useAppSelector} from '../../redux/hooks';

const withUser = <T extends object>(WrappedComponent: React.ComponentType<T>) => {
  return (props: any) => {
    const profile = useAppSelector(state => state.profile);
    return <WrappedComponent {...props} {...profile} />;
  };
};

export default withUser;
