import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'typeface-roboto';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  shadows: new Array(25)
});
const Application = () => {
	return (
		<MuiThemeProvider theme={theme}>
			<App />
		</MuiThemeProvider>
	);
}

ReactDOM.render(<Application />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
