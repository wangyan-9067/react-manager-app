import React from 'react';
import { connect } from 'react-redux';
import Login from './Login';

const Main = ({component: Component, isUserAuthenticated }) => {
  if (isUserAuthenticated) {
    return (
      <Component />
    )
  }

  return (
    <Login />
  );
};

const mapStateToProps = state => {
  const { isUserAuthenticated } = state.app;

  return {
    isUserAuthenticated
  };
}

export default connect(mapStateToProps, null)(Main);