import { createStore } from 'redux';

import reducer from './reducers';

export const store = createStore(
    reducer,
    // TODO: remove it for production deployment
    process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);