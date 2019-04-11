import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import * as RTC from 'cube-rtc';

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

import { setVoiceAppId, setUserLevel } from '../actions/voice';
import { setIsUserAuthenticated, setManagerCredential } from '../actions/app';
import {
  MANAGER_LOGIN,
  MANAGER_LOGIN_R,
  ANCHOR_ALL_QUERY_REQ,
  ANCHORS_ON_DUTY_REQUEST,
  CDS_OPERATOR_LOGIN,
  CDS_OPERATOR_LOGIN_R
} from '../protocols';
import { VALUE_LENGTH, DATA_SERVER_VALUE_LENGTH, RESPONSE_CODES } from '../constants';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
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

  onVoiceSocketPacket = async (evt) => {
    if (evt.$type === Socket.EVENT_PACKET) {
      console.log(`${Socket.EVENT_PACKET} data:`, evt.data);

      const { setVoiceAppId, setIsUserAuthenticated, setUserLevel } = this.props;

      switch(evt.data.respId) {
        case MANAGER_LOGIN_R:
          const { code: loginStatus, voiceAppId, level } = evt.data;

          if (loginStatus === RESPONSE_CODES.SUCCESS) {
            if (voiceAppId) {
              setVoiceAppId(voiceAppId);
              RTC.init(voiceAppId);

              this.getAnchorList();
              this.getAnchorsDutyList();

              setIsUserAuthenticated(true);
              setUserLevel(level);
            } else {
              // TODO: show error popup
              setIsUserAuthenticated(false);
            }
          } else {
            // TODO: show error popup
            setIsUserAuthenticated(false);
          }
        break;

        default:
        break;
      }
    }
  }

  onDataSocketPacket = async (evt) => {
    if (evt.$type === Socket.EVENT_PACKET) {
      console.log(`${Socket.EVENT_PACKET} data:`, evt.data);
    }

    const { setIsUserAuthenticated } = this.props;

    switch(evt.data.respId) {
      case CDS_OPERATOR_LOGIN_R:
        const { code: loginStatus } = evt.data;

        if (loginStatus === RESPONSE_CODES.SUCCESS) {
          setIsUserAuthenticated(true);
        } else {
          setIsUserAuthenticated(false);
          // TODO: show error popup
        }
      break;

      default:
      break;
    }
  }

  async componentDidMount() {
    const { voice: voiceSocket, data: dataSocket } = this.props;

    voiceSocket.addEventListener(Socket.EVENT_PACKET, this.onVoiceSocketPacket);

    dataSocket.addEventListener(Socket.EVENT_PACKET, this.onDataSocketPacket);

    await voiceSocket.autoConnect();
    await dataSocket.autoConnect();
  }

  componentWillUnmount() {
    const { voice: voiceSocket, data: dataSocket } = this.props;

    voiceSocket.removeEventListener(Socket.EVENT_PACKET, this.onVoiceSocketPacket);
    dataSocket.removeEventListener(Socket.EVENT_PACKET, this.onDataSocketPacket);
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

  onSubmit = e => {
    e.preventDefault();
    this.resetValidationStates();

    if (this.formIsValid()) {
      const { managerLoginname, managerPassword } = this.state;
      const { voice: voiceSocket, data: dataSocket, setManagerCredential } = this.props;

      setManagerCredential({
        managerLoginname: managerLoginname.value,
        managerPassword: managerPassword.value
      });

      if (voiceSocket.readyState === Socket.ReadyState.OPEN) {
        voiceSocket.writeBytes(Socket.createCMD(MANAGER_LOGIN, bytes => {
          bytes.writeBytes(Socket.stringToBytes(managerLoginname, VALUE_LENGTH.LOGIN_NAME));
          bytes.writeBytes(Socket.stringToBytes(managerPassword, VALUE_LENGTH.PASSWORD));
        }));
      }

      if (dataSocket.readyState === Socket.ReadyState.OPEN) {
        const { VL_VIDEO_ID, VL_USER_NAME, VL_PSW } = DATA_SERVER_VALUE_LENGTH;

        dataSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_LOGIN, bytes => {
          bytes.writeUnsignedShort();
          bytes.writeUnsignedShort();
          bytes.writeBytes(Socket.stringToBytes('', VL_VIDEO_ID));
          bytes.writeBytes(Socket.stringToBytes(managerLoginname, VL_USER_NAME));
          bytes.writeBytes(Socket.stringToBytes(managerPassword, VL_PSW));
          bytes.writeUnsignedInt();
        }));
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


  render () {
    const { managerLoginname, managerPassword } = this.state;
    const { classes } = this.props;
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
      </div>
    );
  }
};

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

const RoutedLogin = withRouter(withStyles(styles)(Login));

const mapDispatchToProps = dispatch => ({
  setVoiceAppId: id => dispatch(setVoiceAppId(id)),
  setIsUserAuthenticated: status => dispatch(setIsUserAuthenticated(status)),
  setManagerCredential: credential => dispatch(setManagerCredential(credential)),
  setUserLevel: level => dispatch(setUserLevel(level))
});

export default connect(null, mapDispatchToProps)(RoutedLogin);