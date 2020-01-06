import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { create } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider, createMuiTheme, createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import 'typeface-roboto';

import App from './App';
import Main from './containers/Main';
import * as serviceWorker from './serviceWorker';
import './index.css';
import { getConfig } from './config';
import { store } from './store';

const jss = create({
    ...jssPreset(),
    // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
    insertionPoint: document.getElementById('jss-insertion-point'),
});
jss.options.createGenerateClassName = createGenerateClassName;

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
        <JssProvider jss={jss}>
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <Main component={App} />
                </MuiThemeProvider>
            </Provider>
        </JssProvider>
    );
};

getConfig().then(() => {
    ReactDOM.render(<Application />, document.getElementById('root'));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
