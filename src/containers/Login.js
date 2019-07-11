import 'cube-egret-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validator from 'validator';
import classNames from 'classnames/bind';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import voiceAPI from '../services/Voice/voiceAPI';
import MessageBar from '../components/MessageBar';
import {
    setManagerCredential,
    setToastMessage,
    setToastVariant,
    setToastDuration,
    toggleToast
} from '../actions/app';
import { getLangConfig } from '../helpers/appUtils';
import { combineStyles, buttonStyles } from '../styles';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 5,
        paddingBottom: theme.spacing.unit * 2,
        width: '350px',
        margin: '30px auto',
        backgroundColor: '#E8E8E8'
    },
    margin: {
        margin: theme.spacing.unit,
    },
    fieldWrapper: {
        alignItems: 'center'
    },
    fieldInputWrapper: {
        border: '1px solid #4E4E4E',
        lineHeight: '45px'
    },
    inputType: {
        height: '45px'
    },
    fieldLabel: {
        color: '#FFFFFF',
        fontSize: '1.3rem',
        fontWeight: 'bold'
    },
    fieldInput: {
        backgroundColor: '#FFFFFF',
        padding: '10px'
    },
    fieldBackground: {
        backgroundColor: '#4E4E4E',
        padding: '20px 40px'
    },
    loginButtonWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10px'
    },
    loginButton: {
        fontSize: '1.125rem',
        fontWeight: 'bold'
    },
    formErrorText: {
        margin: '5px 0'
    }
});

class Login extends React.Component {
    formDefaults = {
        managerLoginname: { value: '', isValid: true, message: '' },
        managerPassword: { value: '', isValid: true, message: '' }
    }

    state = {
        ...this.formDefaults
    };

    onChange = (e) => {
        const state = {
            ...this.state,
            [e.target.name]: {
                ...this.state[e.target.name],
                value: e.target.value,
            }
        };

        this.setState(state);
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.resetValidationStates();

        if (this.formIsValid()) {
            const { managerLoginname, managerPassword } = this.state;
            const { setManagerCredential, setToastMessage, setToastVariant, setToastDuration, toggleToast } = this.props;
            const langConfig = getLangConfig();

            setToastMessage(langConfig.SYSTEM_MESSAGES.CONNECTING);
            setToastVariant('info');
            setToastDuration(null);
            toggleToast(true);

            setManagerCredential({
                managerLoginname: managerLoginname.value,
                managerPassword: managerPassword.value
            });

            voiceAPI.connect();
        }
    }

    formIsValid() {
        const managerLoginname = { ...this.state.managerLoginname };
        const managerPassword = { ...this.state.managerPassword };
        const langConfig = getLangConfig();

        let isGood = true;

        if (validator.isEmpty(managerLoginname.value)) {
            managerLoginname.isValid = false;
            managerLoginname.message = langConfig.LOGIN_FORM_LABEL.MANAGER_LOGIN_EMPTY;
            isGood = false;
        }

        if (managerLoginname.isValid && !validator.isAlphanumeric(managerLoginname.value)) {
            managerLoginname.isValid = false;
            managerLoginname.message = langConfig.LOGIN_FORM_LABEL.MANAGER_LOGIN_ALPHANUMERIC;
            isGood = false;
        }

        if (validator.isEmpty(managerPassword.value)) {
            managerPassword.isValid = false;
            managerPassword.message = langConfig.LOGIN_FORM_LABEL.MANAGER_PASSWORD_EMPTY;
            isGood = false;
        }

        if (!isGood) {
            this.setState({
                managerLoginname,
                managerPassword
            });
        }

        return isGood;
    }

    resetValidationStates() {
        // make a copy of everything in state
        const state = JSON.parse(JSON.stringify(this.state));

        /*
        loop through each item in state and if it's safe to assume that only
        form values have an 'isValid' property, we can use that to reset their
        validation states and keep their existing value property. This process
        makes it easy to set all validation states on form inputs in case the number
        of fields on our form grows in the future.
        */
        // eslint-disable-next-line
        Object.keys(state).map(key => {
            if (state[key].hasOwnProperty('isValid')) {
                state[key].isValid = true;
                state[key].message = '';
            }
        });

        this.setState(state);
    }

    resetForm = () => {
        this.setState(...this.formDefaults);
    }

    onClose = (evt, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.props.toggleToast(false);
    }

    render() {
        const { managerLoginname, managerPassword } = this.state;
        const { classes, variant, message, duration, open } = this.props;
        const {
            root,
            fieldWrapper,
            fieldInputWrapper,
            inputType,
            fieldLabel,
            fieldInput,
            fieldBackground,
            loginButtonWrapper,
            loginButton,
            greenButton,
            formErrorText
        } = classes;
        const langConfig = getLangConfig();

        return (
            <div>
                <Paper className={root} elevation={1}>
                    <form onSubmit={this.onSubmit}>
                        <div className={fieldBackground}>
                            <FormControl error={!managerLoginname.isValid}>
                                <Grid container spacing={8} alignItems="flex-end" className={fieldWrapper}>
                                    <Grid item>
                                        <Typography color="inherit" className={fieldLabel}>{langConfig.LOGIN_FORM_LABEL.MANAGER_LOGIN}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Input
                                            inputProps={{
                                                'aria-label': 'managerLoginname',
                                            }}
                                            name="managerLoginname"
                                            classes={{ input: fieldInput }}
                                            className={fieldInputWrapper}
                                            disableUnderline={true}
                                            placeholder=""
                                            onChange={this.onChange}
                                            value={managerLoginname.value}
                                        />
                                    </Grid>
                                </Grid>
                                <FormHelperText id="component-error-text" className={formErrorText}>{managerLoginname.message}</FormHelperText>
                            </FormControl>
                            <FormControl error={!managerPassword.isValid}>
                                <Grid container spacing={8} alignItems="flex-end" className={fieldWrapper}>
                                    <Grid item>
                                        <Typography color="inherit" className={fieldLabel}>{langConfig.LOGIN_FORM_LABEL.MANAGER_PASSWORD}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Input
                                            type="password"
                                            inputProps={{
                                                'aria-label': 'managerPassword',
                                            }}
                                            name="managerPassword"
                                            classes={{ inputType, input: fieldInput }}
                                            className={fieldInputWrapper}
                                            disableUnderline={true}
                                            placeholder=""
                                            onChange={this.onChange}
                                            value={managerPassword.value}
                                        />
                                    </Grid>
                                </Grid>
                                <FormHelperText id="component-error-text" className={formErrorText}>{managerPassword.message}</FormHelperText>
                            </FormControl>
                        </div>
                        <div className={loginButtonWrapper}>
                            <Button type="submit" variant="contained" size="medium" color="inherit" className={classNames(loginButton, greenButton)}>{langConfig.BUTTON_LABEL.LOGIN}</Button>
                        </div>
                    </form>
                </Paper>
                <MessageBar
                    variant={variant}
                    message={message}
                    duration={duration}
                    isOpen={open}
                    onClose={this.onClose}
                />
            </div>
        );
    }
};

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    variant: PropTypes.string,
    message: PropTypes.string,
    duration: PropTypes.number,
    open: PropTypes.bool,
    setManagerCredential: PropTypes.func,
    setToastMessage: PropTypes.func,
    setToastVariant: PropTypes.func,
    setToastDuration: PropTypes.func,
    toggleToast: PropTypes.func
};

const mapStateToProps = state => {
    const { variant, message, duration, open } = state.app;
    return ({
        variant,
        message,
        duration,
        open
    });
};

const mapDispatchToProps = dispatch => ({
    setManagerCredential: credential => dispatch(setManagerCredential(credential)),
    setToastMessage: message => dispatch(setToastMessage(message)),
    setToastVariant: variant => dispatch(setToastVariant(variant)),
    setToastDuration: duration => dispatch(setToastDuration(duration)),
    toggleToast: toggle => dispatch(toggleToast(toggle))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combineStyles(buttonStyles, styles))(Login));