import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ContextConsumer } from './SocketContext';
import Login from '../containers/Login';

const PrivateRoute = ({ contextComponent, component: Component, isUserAuthenticated, ...rest }) => {
  return (
    <ContextConsumer>
      {({ voice, data }) => (
        <Route
          {...rest}
          render={props =>
            isUserAuthenticated ? (
              <Component {...props} voice={voice} data={data}/>
            ) : (
              // <Redirect
              //   to={{
              //     pathname: "./login",
              //     state: { from: props.location }
              //   }}
              // />
              <Login {...props} voice={voice} data={data} />
            )
          }
        />
      )}
    </ContextConsumer>
  );
};

const mapStateToProps = state => {
  const { isUserAuthenticated } = state.app;

  return {
    isUserAuthenticated
  };
}

export default connect(mapStateToProps, null)(PrivateRoute);