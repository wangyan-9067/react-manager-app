import React from 'react';
import classNames from 'classnames';
import validator from 'validator';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import DialogWrapper from './DialogWrapper';

const styles = theme => ({
  managerActionDialog: {
    display: 'flex',
		borderRadius: '10px',
		width: '100%'
  },
  managerActionDialogSectionLeft: {
    width: '70%'
  },
  managerActionDialogSectionRight: {
    width: '30%',
    margin: '100px 0px'
  },
  managerActionFormField: {
    lineHeight: '60px'
  },
  managerActionFormLabel: {
    color: '#656565',
    display: 'inline-block',
    marginTop: '20px'
  },
  input: {
    margin: theme.spacing.unit,
    float: 'right',
    width: '70%',
    display: 'inline-block'
  },
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
  },
	actionButton: {
    margin: '10px 5px',
    padding: '3px 40px',
		borderRadius: '60px',
		fontSize: '1.5rem',
		fontWeight: 'bold',
		color: '#FFFFFF',
		backgroundColor: '#0F58A7',
    '&:hover': {
      backgroundColor: '#0F58A7',
      borderColor: '#0F58A7',
    }
  },
	dialogActionButton: {
		fontSize: '1.125rem',
  },
  dialogCancelButton: {
    backgroundColor: '#656565'
  },
  dialogDeleteButton: {
    backgroundColor: '#FD0100'
  }
});

class UserForm extends React.Component {
  formDefaults = {
    loginname: { value: '', isValid: true, message: '' },
    nickname: { value: '', isValid: true, message: '' },
    password: { value: '', isValid: true, message: '' },
    passwordConfirm: { value: '', isValid: true, message: '' },
    iconUrl: { value: '', isValid: true, message: '' },
    level: { value: '', isValid: true, message: '' },
    tel: { value: '', isValid: true, message: '' }
  }

  constructor(props) {
    super(props);

    const { selectedUser } = this.props;

    if (selectedUser) {
      const { loginname, nickname, password, url, flag, tel } = selectedUser;

      this.formDefaults.loginname.value = loginname;
      this.formDefaults.nickname.value = nickname;
      this.formDefaults.password.value = password;
      this.formDefaults.passwordConfirm.value = password;
      this.formDefaults.iconUrl.value = url;

      if (typeof flag !== 'undefined') {
        this.formDefaults.level.value = flag;
      }

      if (typeof tel !== 'undefined') {
        this.formDefaults.tel.value = tel;
      }
    }

    this.state = {
      ...this.formDefaults
    };
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
      const { loginname, nickname, password, iconUrl, level, tel } = this.state;
      const { addUser, setOpenAddDialog, isManager, isDelegator } = this.props;

      if (isManager) {
        addUser(loginname.value, password.value, nickname.value, iconUrl.value, level.value);
      } else if (isDelegator) {
        addUser(loginname.value, password.value, tel.value);
      } else {
        addUser(loginname.value, password.value, nickname.value, iconUrl.value);
      }
      setOpenAddDialog(false);
    }
  }

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
    const nickname = { ...this.state.nickname };
    const password = { ...this.state.password };
    const passwordConfirm = { ...this.state.passwordConfirm };
    const iconUrl = { ...this.state.iconUrl };
    const level = { ...this.state.level };
    const tel = { ...this.state.tel };
    const { isEdit, userList, isManager, isDelegator } = this.props;

    let isGood = true;

    if (validator.isEmpty(loginname.value)) {
      isGood = this.setField(loginname, false, 'Loginname is required');
    } else {
      this.resetField(loginname);
    }

    if (loginname.isValid) {
      if (!validator.isAlphanumeric(loginname.value)) {
        isGood = this.setField(loginname, false, 'Loginname must be alphanumeric');
      } else {
        this.resetField(loginname);
      }
    }

    if (loginname.isValid && !isEdit) {
      if (userList.find(user => user.loginname.toLowerCase() === loginname.value.toLowerCase())) {
        isGood = this.setField(loginname, false, 'Loginname is already registered');
      } else {
        this.resetField(loginname);
      }
    }

    if (!isDelegator) {
      if (validator.isEmpty(nickname.value)) {
        isGood = this.setField(nickname, false, 'Nickname is required');
      } else {
        this.resetField(nickname);
      }
    }

    if (validator.isEmpty(password.value)) {
      isGood = this.setField(password, false, 'Password is required');
    } else {
      this.resetField(password);
    }

    if (validator.isEmpty(passwordConfirm.value)) {
      isGood = this.setField(passwordConfirm, false, 'Password Confirm is required');
    } else {
      this.resetField(passwordConfirm);
    }

    if (passwordConfirm.isValid) {
      if (!validator.equals(password.value, passwordConfirm.value)) {
        isGood = this.setField(passwordConfirm, false, 'Password does not match');
      } else {
        this.resetField(passwordConfirm);
      }
    }

    if (!isDelegator) {
      if (validator.isEmpty(iconUrl.value)) {
        isGood = this.setField(iconUrl, false, 'Icon URL is required');
      } else {
        this.resetField(iconUrl);
      }
    }

    if (isManager) {
      if (!(level.value === 0 || level.value === 1)) {
        isGood = this.setField(level, false, 'Level is required');
      } else {
        this.resetField(level);
      }
    }

    if (isDelegator) {
      if (validator.isEmpty(tel.value)) {
        isGood = this.setField(tel, false, 'Phone number is required');
      } else {
        this.resetField(tel);
      }

      if (tel.isValid) {
        if (!validator.isNumeric(tel.value)) {
          isGood = this.setField(tel, false, 'Phone number must be numeric');
        } else {
          this.resetField(tel);
        }
      }
    }
    
    if (!isGood) {
      this.setState({
        loginname,
        nickname,
        password,
        passwordConfirm,
        iconUrl,
        level,
        tel
      });
    }

    return isGood;
  }

  resetValidationStates = () => {
    // make a copy of everything in state
    const state = JSON.parse(JSON.stringify(this.state));

    /**
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

  render() {
    const { loginname, nickname, password, passwordConfirm, iconUrl, level, tel } = this.state;
    const { classes, setOpenAddDialog, isEdit, deleteUser, openDialog, toggleDialog, isManager, isDelegator } = this.props;
    const {
      managerActionDialog,
      managerActionFormLabel,
      inputUnderline,
      input,
      formControlRoot,
      formControl,
      managerActionDialogSectionLeft,
      managerActionDialogSectionRight,
      actionButton,
      dialogActionButton,
      dialogCancelButton,
      dialogDeleteButton
    } = classes;

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className={managerActionDialog}>
            <div className={managerActionDialogSectionLeft}>
              <FormControl classes={{ root: formControlRoot }} className={formControl} error={!loginname.isValid}>
                <div className={managerActionFormLabel}>Login名</div>
                <Input
                  defaultValue=""
                  classes={{underline: inputUnderline}}
                  className={input}
                  inputProps={{
                    'aria-label': 'loginname',
                  }}
                  name="loginname"
                  placeholder=""
                  value={loginname.value}
                  onChange={this.onChange}
                  disabled={isEdit}
                />
                <FormHelperText id="component-error-text">{loginname.message}</FormHelperText>
              </FormControl>
              {!isDelegator && (
                <FormControl classes={{ root: formControlRoot }} className={formControl} error={!nickname.isValid}>
                  <div className={managerActionFormLabel}>暱稱</div>
                  <Input
                    defaultValue=""
                    classes={{underline: inputUnderline}}
                    className={input}
                    inputProps={{
                      'aria-label': 'nickname',
                    }}
                    name="nickname"
                    placeholder=""
                    value={nickname.value}
                    onChange={this.onChange}
                  />
                  <FormHelperText id="component-error-text">{nickname.message}</FormHelperText>
                </FormControl>
              )}
              <FormControl classes={{ root: formControlRoot }} className={formControl} error={!password.isValid}>
                <div className={managerActionFormLabel}>密碼</div>
                <Input
                  defaultValue=""
                  classes={{underline: inputUnderline}}
                  className={input}
                  inputProps={{
                    'aria-label': 'password',
                  }}
                  name="password"
                  placeholder=""
                  value={password.value}
                  onChange={this.onChange}
                />
                <FormHelperText id="component-error-text">{password.message}</FormHelperText>
              </FormControl>
              <FormControl classes={{ root: formControlRoot }} className={formControl} error={!passwordConfirm.isValid}>
                <div className={managerActionFormLabel}>確認密碼</div>
                <Input
                  defaultValue=""
                  classes={{underline: inputUnderline}}
                  className={input}
                  inputProps={{
                    'aria-label': 'passwordConfirm',
                  }}
                  name="passwordConfirm"
                  placeholder=""
                  value={passwordConfirm.value}
                  onChange={this.onChange}
                />
                <FormHelperText id="component-error-text">{passwordConfirm.message}</FormHelperText>
              </FormControl>
              {!isDelegator && (
                <FormControl classes={{ root: formControlRoot }} className={formControl} error={!iconUrl.isValid}>
                  <div className={managerActionFormLabel}>照片URL</div>
                  <Input
                    defaultValue=""
                    classes={{underline: inputUnderline}}
                    className={input}
                    inputProps={{
                      'aria-label': 'iconUrl',
                    }}
                    name="iconUrl"
                    placeholder=""
                    value={iconUrl.value}
                    onChange={this.onChange}
                  />
                  <FormHelperText id="component-error-text">{iconUrl.message}</FormHelperText>
                </FormControl>
              )}
              {isManager && (
                <FormControl classes={{ root: formControlRoot }} className={formControl} error={!level.isValid}>
                  <div className={managerActionFormLabel}>權限</div>
                  <Select
                    value={level.value}
                    onChange={this.onChange}
                    classes={{underline: inputUnderline}}
                    className={input}
                    inputProps={{
                      name: 'level',
                      id: 'level',
                    }}
                  >
                    <MenuItem value={0}>普通經理</MenuItem>
                    <MenuItem value={1}>admin經理</MenuItem>
                  </Select>
                  <FormHelperText id="component-error-text">{level.message}</FormHelperText>
                </FormControl>
              )}
              {isDelegator && (
                <FormControl classes={{ root: formControlRoot }} className={formControl} error={!tel.isValid}>
                  <div className={managerActionFormLabel}>電話</div>
                  <Input
                    defaultValue=""
                    classes={{underline: inputUnderline}}
                    className={input}
                    inputProps={{
                      'aria-label': 'tel',
                    }}
                    name="tel"
                    placeholder=""
                    value={tel.value}
                    onChange={this.onChange}
                  />
                  <FormHelperText id="component-error-text">{tel.message}</FormHelperText>
                </FormControl>
              )}
            </div>
            <div className={managerActionDialogSectionRight}>
              <Button type="submit" variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)}>確定</Button>
              <Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton, dialogCancelButton)} onClick={() => { setOpenAddDialog(false); }}>取消</Button>
              <Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton, dialogDeleteButton)} disabled={!isEdit} onClick={() => { toggleDialog(true); }}>刪除</Button>
            </div>
          </div>
        </form>
        <DialogWrapper
          isOpen={openDialog}
          onCloseHandler={() => {
            toggleDialog(false);
          }}
          actionHandler={() => {
            deleteUser(loginname.value);
            setOpenAddDialog(false);
          }}
          content="確定要刪除嗎?"
        />
      </div>
    );
  }
};

export default withStyles(styles)(UserForm);