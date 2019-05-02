import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { getLangConfig } from '../helpers/appUtils';

const styles = theme => ({
  inputUnderline: {
    '&:after': {
      borderBottom: '2px solid #0F58A7'
    }
  },
  formControlRoot: {
    display: 'block'
  },
  formControl: {
    margin: theme.spacing.unit,
  }
});

class SearchForm extends React.Component {
  formDefaults = {
    gmCode: { value: '', isValid: true, message: '' },
    loginname: { value: '', isValid: true, message: '' }
  }

  state = {
    ...this.formDefaults
  };

  setField = (field, isValid, message) => {
    field.isValid = isValid;
    field.message = message;
    
    return isValid;
  };

  resetField = field => {
    field.isValid = true;
    field.message = '';
    
    return true;
  };

  formIsValid = () => {
    const loginname = { ...this.state.loginname };
    const gmCode = { ...this.state.gmCode };
    const langConfig = getLangConfig();

    let isGood = true;

    if (validator.isEmpty(loginname.value)) {
      isGood = this.setField(loginname, false, langConfig.SEARCH_FORM_LABEL.LOGIN_NAME_VALIDATE);
    } else {
      this.resetField(loginname);
    }
    
    if (!validator.isEmpty(gmCode.value) && validator.isEmpty(loginname.value)) {
      isGood = this.setField(gmCode, false, langConfig.SEARCH_FORM_LABEL.GM_CODE_VALIDATE);
    } else {
      this.resetField(gmCode);
    }

    this.setState({
      loginname,
      gmCode
    });

    return isGood;
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

  resetForm = () => {
    this.setState(...this.formDefaults);
  }

  render() {
    const { gmCode, loginname } = this.state;
    const { classes, nullGateForwardMsgCMD, setBetHistorySearchFields } = this.props;
    const {
      inputUnderline,
      input,
      formControlRoot,
      formControl,
    } = classes;
    const langConfig = getLangConfig();

    return (
      <div>
        <form>
          <div>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item>
                <FormControl classes={{ root: formControlRoot }} className={formControl} error={!gmCode.isValid}>
                  <Input
                    defaultValue=""
                    classes={{underline: inputUnderline}}
                    className={input}
                    inputProps={{
                      'aria-label': 'gmCode',
                    }}
                    name="gmCode"
                    placeholder={langConfig.SEARCH_FORM_LABEL.GM_CODE_PLACEHOLDER}
                    onChange={this.onChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Search"
                          onClick={e => {
                            e.preventDefault();

                            if (this.formIsValid()) {
                              setBetHistorySearchFields({
                                loginname: loginname.value,
                                gmCode: gmCode.value
                              });
                              nullGateForwardMsgCMD(loginname.value, gmCode.value, 1);
                            }
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="component-error-text">{gmCode.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl classes={{ root: formControlRoot }} className={formControl} error={!loginname.isValid}>
                  <Input
                    required
                    defaultValue=""
                    classes={{underline: inputUnderline}}
                    className={input}
                    inputProps={{
                      'aria-label': 'loginname',
                    }}
                    name="loginname"
                    placeholder={langConfig.SEARCH_FORM_LABEL.LOGIN_NAME_PLACEHOLDER}
                    onChange={this.onChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Search"
                          onClick={e => {
                            e.preventDefault();
                            if (this.formIsValid()) {
                              setBetHistorySearchFields({
                                loginname: loginname.value,
                                gmCode: ''
                              });
                              nullGateForwardMsgCMD(loginname.value, '', 1);
                            }
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="component-error-text">{loginname.message}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </form>
      </div>
    );
  }
};

SearchForm.propTypes = {
  classes: PropTypes.object.isRequired,
  getBetHistory: PropTypes.func,
  setBetHistorySearchFields: PropTypes.func
};

export default withStyles(styles)(SearchForm);