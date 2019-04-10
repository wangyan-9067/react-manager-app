import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { ContextConsumer } from './SocketContext';

const PrivateRoute = ({ contextComponent, component: Component, ...rest }) => {
	useEffect(() => {
		sessionStorage.removeItem('authToken');
  });
  
  return (
    <ContextConsumer>
      {({ voice, data }) => (
        <Route
          {...rest}
          render={props =>
            sessionStorage.getItem("authToken") ? (
              <Component {...props} voice={voice} data={data}/>
            ) : (
              <Redirect
                to={{
                  pathname: "./login",
                  state: { from: props.location }
                }}
              />
            )
          }
        />
      )}
    </ContextConsumer>
  );
};

export default PrivateRoute;