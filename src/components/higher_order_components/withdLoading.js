import React from 'react';
import { Dimensions } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startLoading, stopLoading } from '../../redux/slices/loading-slice';

const withLoading = WrappedComponent => {

  const HOC = (props) => {
    const LoaderState = useSelector(state => state.Loader)
    return <WrappedComponent {...this.props} />;
  }

  return HOC;
  
  // class HOC extends React.Component {
  //   constructor(props) {
  //     super(props);
  //   }

  //   componentDidUpdate(prevProps, prevState, snapshot) {}

  //   render() {
  //     return <WrappedComponent {...this.props} />;
  //   }
  // }
  // const mapStateToProps = state => state.LoaderReducer;
  // return connect(mapStateToProps, dispatch =>
  //   bindActionCreators({ startLoading, stopLoading }, dispatch),
  // )(HOC);
};

export default withLoading;
