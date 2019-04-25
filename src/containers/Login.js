import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validator from 'validator';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withRouter } from "react-router";

import MessageBar from '../components/MessageBar';
import { setVoiceAppId } from '../actions/voice';
import {
  setIsUserAuthenticated,
  setManagerCredential,
  setToastMessage,
  setToastVariant,
  setToastDuration,
  toggleToast
} from '../actions/app';
import {
  MANAGER_LOGIN_R,
  MANAGER_KICKOUT_R,
  MANAGER_LOGOUT,
  ANCHOR_ALL_QUERY_REQ,
  ANCHORS_ON_DUTY_REQUEST,
  CDS_OPERATOR_LOGIN_R,
  CDS_OPERATOR_LOGOUT
} from '../protocols';
import { RESPONSE_CODES } from '../constants';
import { voiceServerLoginCMD, dataServerLoginCMD, handleLoginFailure } from '../helpers/appUtils';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2,
    width: '350px',
    margin: '30px auto',
    backgroundColor: '#E8E8E8'
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // top: 0,
    // bottom: 0,
    // margin: 'auto'
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
		backgroundColor: '#4FA329',
    color: '#FFFFFF',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#4FA329',
      borderColor: '#4FA329',
    }
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

  // onVoiceSocketOpen = () => {
  //   this.props.toggleToast(false);
  // }

  // onDataSocketOpen = () => {
  //   this.props.toggleToast(false);
  // }

  onVoiceSocketPacket = async (evt) => {
    if (evt.$type === Socket.EVENT_PACKET) {
      console.log(`${Socket.EVENT_PACKET} data:`, evt.data);

      const {
        data: dataSocket,
        managerCredential,
        setIsUserAuthenticated,
        setToastMessage,
        setToastVariant,
        setToastDuration,
        toggleToast
      } = this.props;
      const { SUCCESS, REPEAT_LOGIN, ERR_PWD_ERROR, ERR_NO_USER } = RESPONSE_CODES;

      switch(evt.data.respId) {
        case MANAGER_LOGIN_R:
          const { code: loginStatus, voiceAppId } = evt.data;
          const { managerLoginname, managerPassword } = managerCredential;

          if (loginStatus === SUCCESS) {
            if (voiceAppId) {
              if (dataSocket.readyState === Socket.ReadyState.OPEN) {
                toggleToast(false);
                dataServerLoginCMD(managerLoginname, managerPassword, dataSocket);
              } else {
                await dataSocket.killSocket();
                await dataSocket.autoConnect();
                dataServerLoginCMD(managerLoginname, managerPassword, dataSocket);
              }
            } else {
              handleLoginFailure({
                setIsUserAuthenticated,
                setToastMessage,
                setToastVariant,
                setToastDuration,
                toggleToast,
                message: "[VoiceServer] 沒有AppId, 請聯絡管理員"
              });

              this.reset();
            }
          } else if (loginStatus === REPEAT_LOGIN) {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: "經理重覆登入"
            });

            this.reset();
          } else if (loginStatus === ERR_PWD_ERROR) {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: "用戶名/密碼錯誤!"
            });
            
            this.reset();
          } else if (loginStatus === ERR_NO_USER) {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: "沒有此用戶!"
            });

            this.reset();
          } else {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: "[VoiceServer] 無法登入, 請聯絡管理員"
            });

            this.reset();
          }
        break;

        case MANAGER_KICKOUT_R:
          const { code: kickoutStatus } = evt.data;

          if (kickoutStatus === REPEAT_LOGIN) {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: "經理重覆登入!"
            });
          }
        break;

        default:
        break;
      }
    }
  }

  onDataSocketPacket =  async (evt) => {
    if (evt.$type === Socket.EVENT_PACKET) {
      console.log(`${Socket.EVENT_PACKET} data:`, evt.data);
    }

    const { setIsUserAuthenticated, setToastMessage, setToastVariant, setToastDuration, toggleToast } = this.props;

    switch(evt.data.respId) {
      case CDS_OPERATOR_LOGIN_R:
        const { code: loginStatus } = evt.data;

        if (loginStatus === RESPONSE_CODES.SUCCESS) {
          setIsUserAuthenticated(true);
        } else {
          handleLoginFailure({
            setIsUserAuthenticated,
            setToastMessage,
            setToastVariant,
            setToastDuration,
            toggleToast,
            message: "[DataServer] 無法登入, 請聯絡管理員"
          });

          this.reset();
        }
      break;

      default:
      break;
    }
  }

  // TODO: move to appUtils
  reset = () => {
    const { voice: voiceSocket, data: dataSocket, setManagerCredential, setIsUserAuthenticated } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(MANAGER_LOGOUT));
    voiceSocket.close();
    dataSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_LOGOUT));
    dataSocket.close();

    setManagerCredential(null);
    setIsUserAuthenticated(false);
  }

  async componentDidMount() {
    const {
      voice: voiceSocket,
      data: dataSocket
    } = this.props;

    // voiceSocket.addEventListener(Socket.EVENT_OPEN, this.onVoiceSocketOpen);
    voiceSocket.addEventListener(Socket.EVENT_PACKET, this.onVoiceSocketPacket);
    // dataSocket.addEventListener(Socket.EVENT_PACKET, this.onDataSocketOpen);
    dataSocket.addEventListener(Socket.EVENT_PACKET, this.onDataSocketPacket);

    await voiceSocket.autoConnect();
    await dataSocket.autoConnect();
  }

  componentWillUnmount() {
    const { voice: voiceSocket, data: dataSocket } = this.props;

    // voiceSocket.removeEventListener(Socket.EVENT_OPEN, this.onVoiceSocketOpen);
    voiceSocket.removeEventListener(Socket.EVENT_PACKET, this.onVoiceSocketPacket);
    // dataSocket.removeEventListener(Socket.EVENT_OPEN, this.onDataSocketOpen);
    dataSocket.removeEventListener(Socket.EVENT_PACKET, this.onDataSocketPacket);
    
    voiceSocket.close();
    dataSocket.close();
  }

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

  onSubmit = async (e) => {
    e.preventDefault();
    this.resetValidationStates();

    if (this.formIsValid()) {
      const { managerLoginname, managerPassword } = this.state;
      const { voice: voiceSocket, setManagerCredential, setToastMessage, setToastVariant, setToastDuration, toggleToast } = this.props;

      setToastMessage("連線中......");
      setToastVariant('info');
      setToastDuration(null);
      toggleToast(true);

      setManagerCredential({
        managerLoginname: managerLoginname.value,
        managerPassword: managerPassword.value
      });

      if (voiceSocket.readyState === Socket.ReadyState.OPEN) {
        toggleToast(false);
        voiceServerLoginCMD(managerLoginname.value, managerPassword.value, voiceSocket);
      } else {
        await voiceSocket.killSocket();
        await voiceSocket.autoConnect();
        voiceServerLoginCMD(managerLoginname.value, managerPassword.value, voiceSocket);
      }
    }
  }

  formIsValid = () => {
    const managerLoginname = { ...this.state.managerLoginname };
    const managerPassword = { ...this.state.managerPassword };

    let isGood = true;

    if (validator.isEmpty(managerLoginname.value)) {
      managerLoginname.isValid = false;
      managerLoginname.message = 'Manager Loginname is required';
      isGood = false;
    }

    if (managerLoginname.isValid && !validator.isAlphanumeric(managerLoginname.value)) {
      managerLoginname.isValid = false;
      managerLoginname.message = 'Manager Loginname must be alphanumeric';
      isGood = false;
    }

    if (validator.isEmpty(managerPassword.value)) {
      managerPassword.isValid = false;
      managerPassword.message = 'Manager Password is required';
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

  resetValidationStates = () => {
    // make a copy of everything in state
    const state = JSON.parse(JSON.stringify(this.state));

    /*
    loop through each item in state and if it's safe to assume that only
    form values have an 'isValid' property, we can use that to reset their
    validation states and keep their existing value property. This process
    makes it easy to set all validation states on form inputs in case the number
    of fields on our form grows in the future.
    */
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

  getAnchorList = () => {
    const { voice: voiceSocket } = this.props;
    voiceSocket.writeBytes(Socket.createCMD(ANCHOR_ALL_QUERY_REQ));
  }

  getAnchorsDutyList = () => {
    const { voice: voiceSocket } = this.props;
    voiceSocket.writeBytes(Socket.createCMD(ANCHORS_ON_DUTY_REQUEST));
  }

  onClose = (evt, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.props.toggleToast(false);
  }

  render () {
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
      formErrorText
    } = classes;

    return (
      <div>
        <Paper className={root} elevation={1}>
          <form onSubmit={this.onSubmit}>
            <div className={fieldBackground}>
              <FormControl error={!managerLoginname.isValid}>
                <Grid container spacing={8} alignItems="flex-end" className={fieldWrapper}>
                  <Grid item>
                    <Typography color="inherit" className={fieldLabel}>經理:</Typography>
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
                    <Typography color="inherit" className={fieldLabel}>密碼:</Typography>
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
              <Button type="submit" variant="contained" size="medium" color="inherit" className={loginButton}>登入</Button>
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
  voice: PropTypes.object.isRequired,
  setManagerCredential: PropTypes.func,
  setToastMessage: PropTypes.func,
  setToastVariant: PropTypes.func,
  setToastDuration: PropTypes.func,
  toggleToast: PropTypes.func,
  setIsUserAuthenticated: PropTypes.func,
  data: PropTypes.object.isRequired,
  managerCredential: PropTypes.object
};

const RoutedLogin = withRouter(withStyles(styles)(Login));

const mapStateToProps = state => {
  const { variant, message, duration, open, managerCredential } = state.app;
  return ({
    variant,
    message,
    duration,
    open,
    managerCredential
  });
};

const mapDispatchToProps = dispatch => ({
  setVoiceAppId: id => dispatch(setVoiceAppId(id)),
  setIsUserAuthenticated: status => dispatch(setIsUserAuthenticated(status)),
  setManagerCredential: credential => dispatch(setManagerCredential(credential)),
  setToastMessage: message => dispatch(setToastMessage(message)),
  setToastVariant: variant => dispatch(setToastVariant(variant)),
  setToastDuration: duration => dispatch(setToastDuration(duration)),
  toggleToast: toggle => dispatch(toggleToast(toggle))
});

export default connect(mapStateToProps, mapDispatchToProps)(RoutedLogin);