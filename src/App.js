import 'cube-egret-polyfill';
import React from 'react';
import { connect } from 'react-redux';

import MenuBar from './components/MenuBar';
import MessageBar from './components/MessageBar';
import LoadingIndicator from './components/LoadingIndicator';
import { toggleToast } from './actions/app';
import './App.css';

class App extends React.Component {
    onClose = (evt, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.props.toggleToast(false);
    }

    render() {
        const {
            open,
            variant,
            message,
            duration,
            showLoading,
        } = this.props;

        return (
            <div className="App">
                <MenuBar />
                <MessageBar
                    variant={variant}
                    message={message}
                    duration={duration}
                    isOpen={open}
                    onClose={this.onClose}
                />
                <LoadingIndicator showLoading={showLoading} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { variant, message, duration, open, showLoading } = state.app;
    return ({
        variant,
        message,
        duration,
        open,
        showLoading
    });
};

const mapDispatchToProps = dispatch => ({
    toggleToast: toggle => dispatch(toggleToast(toggle))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
