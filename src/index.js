import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Switch } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'typeface-roboto';

import App from './App';
// import Login from './components/Login';
// import ContextRoute from './helpers/ContextRoute';
import PrivateRoute from './helpers/PrivateRoute';
import { ContextProvider } from './helpers/SocketContext';
import * as serviceWorker from './serviceWorker';
import './index.css';

const store = createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const theme = createMuiTheme({
	shadows: new Array(25),
	overrides: {
		MuiToggleButton: {
			root: {
        '&$selected': {
					backgroundColor: '#FFDDDC',
					border: '1px solid #DF6C68',
					'&:hover': {
						backgroundColor: '#FFDDDC',
						border: '1px solid #DF6C68'
					}
				},
				'&:hover': {
					backgroundColor: '#FFDDDC',
					border: '1px solid #DF6C68'
				}
			}
		}
	}
});

const Application = () => {
	return (
		<Provider store={store}>
			<MuiThemeProvider theme={theme}>
				<Router>
					<ContextProvider>
						<Switch>
							{/* <ContextRoute exact path="/login" contextConsumer={ContextConsumer} component={Login} /> */}
							<PrivateRoute exact path="/" component={App} />					
						</Switch>
					</ContextProvider>
				</Router>
			</MuiThemeProvider>
		</Provider>
	);
};

ReactDOM.render(<Application />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
