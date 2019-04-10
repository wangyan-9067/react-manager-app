import React from 'react';
import { Route } from 'react-router-dom';

const ContextRoute = ({ contextConsumer: ContextConsumer, component: Component, ...rest }) => {
  return (
    <Route {...rest}>
      <ContextConsumer>
        {({ voice, data }) => (
          <Component voice={voice} data={data} />
        )}
      </ContextConsumer>
    </Route>
  );
};

export default ContextRoute;