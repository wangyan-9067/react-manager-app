import React from 'react';
import classNames from 'classnames';
import validator from 'validator';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';

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

class AnchorForm extends React.Component {
  formDefaults = {
    anchorLoginname: { value: '', isValid: true, message: '' },
    anchorNickname: { value: '', isValid: true, message: '' },
    anchorPassword: { value: '', isValid: true, message: '' },
    anchorPasswordConfirm: { value: '', isValid: true, message: '' },
    anchorIconUrl: { value: '', isValid: true, message: '' }
  }

  constructor(props) {
    super(props);

    const { selectedAnchor } = this.props;

    if (selectedAnchor) {
      const { loginname, nickname, password, url } = selectedAnchor;
      
      this.formDefaults.anchorLoginname.value = loginname;
      this.formDefaults.anchorNickname.value = nickname;
      this.formDefaults.anchorPassword.value = password;
      this.formDefaults.anchorPasswordConfirm.value = password;
      this.formDefaults.anchorIconUrl.value = url;
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
      const { anchorLoginname, anchorNickname, anchorPassword, anchorIconUrl } = this.state;
      const { addAnchor, setOpenAddManagerDialog } = this.props;
      addAnchor(anchorLoginname.value, anchorPassword.value, anchorNickname.value, anchorIconUrl.value);
      setOpenAddManagerDialog(false);
    }
  }

  formIsValid = () => {
    const anchorLoginname = { ...this.state.anchorLoginname };
    const anchorNickname = { ...this.state.anchorNickname };
    const anchorPassword = { ...this.state.anchorPassword };
    const anchorPasswordConfirm = { ...this.state.anchorPasswordConfirm };
    const anchorIconUrl = { ...this.state.anchorIconUrl };
    const { isEdit, anchorList } = this.props;

    let isGood = true;

    if (validator.isEmpty(anchorLoginname.value)) {
      anchorLoginname.isValid = false;
      anchorLoginname.message = 'Anchor Loginname is required';
      isGood = false;
    }

    if (anchorLoginname.isValid && !validator.isAlphanumeric(anchorLoginname.value)) {
      anchorLoginname.isValid = false;
      anchorLoginname.message = 'Anchor Loginname must be alphanumeric';
      isGood = false;
    }

    if (!isEdit && anchorList.find(anchor => anchor.loginname === anchorLoginname.value)) {
      anchorLoginname.isValid = false;
      anchorLoginname.message = 'Anchor loginname is already registered';
      isGood = false;
    }

    if (validator.isEmpty(anchorNickname.value)) {
      anchorNickname.isValid = false;
      anchorNickname.message = 'Anchor Nickname is required';
      isGood = false;
    }

    if (validator.isEmpty(anchorPassword.value)) {
      anchorPassword.isValid = false;
      anchorPassword.message = 'Anchor Password is required';
      isGood = false;
    }

    if (validator.isEmpty(anchorPasswordConfirm.value)) {
      anchorPasswordConfirm.isValid = false;
      anchorPasswordConfirm.message = 'Anchor Password Confirm is required';
      isGood = false;
    }

    if (!validator.equals(anchorPassword.value, anchorPasswordConfirm.value)) {
      anchorPasswordConfirm.isValid = false;
      anchorPasswordConfirm.message = 'Anchor Password does not match';
      isGood = false;
    }

    if (validator.isEmpty(anchorIconUrl.value)) {
      anchorIconUrl.isValid = false;
      anchorIconUrl.message = 'Anchor Icon URL is required';
      isGood = false;
    }

    if (!isGood) {
      this.setState({
        anchorLoginname,
        anchorNickname,
        anchorPassword,
        anchorPasswordConfirm,
        anchorIconUrl
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

  render() {
    const { anchorLoginname, anchorNickname, anchorPassword, anchorPasswordConfirm, anchorIconUrl } = this.state;
    const { classes, setOpenAddManagerDialog, isEdit, deleteAnchor, openDialog, toggleDialog } = this.props;
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
              <FormControl classes={{ root: formControlRoot }} className={formControl} error={!anchorLoginname.isValid}>
                <div className={managerActionFormLabel}>主播Login名</div>
                <Input
                  defaultValue=""
                  classes={{underline: inputUnderline}}
                  className={input}
                  inputProps={{
                    'aria-label': 'anchorLoginname',
                  }}
                  name="anchorLoginname"
                  placeholder=""
                  value={anchorLoginname.value}
                  onChange={this.onChange}
                  disabled={isEdit}
                />
                <FormHelperText id="component-error-text">{anchorLoginname.message}</FormHelperText>
              </FormControl>
              <FormControl classes={{ root: formControlRoot }} className={formControl} error={!anchorNickname.isValid}>
                <div className={managerActionFormLabel}>主播暱稱</div>
                <Input
                  defaultValue=""
                  classes={{underline: inputUnderline}}
                  className={input}
                  inputProps={{
                    'aria-label': 'anchorNickname',
                  }}
                  name="anchorNickname"
                  placeholder=""
                  value={anchorNickname.value}
                  onChange={this.onChange}
                />
                <FormHelperText id="component-error-text">{anchorNickname.message}</FormHelperText>
              </FormControl>
              <FormControl classes={{ root: formControlRoot }} className={formControl} error={!anchorPassword.isValid}>
                <div className={managerActionFormLabel}>密碼</div>
                <Input
                  defaultValue=""
                  classes={{underline: inputUnderline}}
                  className={input}
                  inputProps={{
                    'aria-label': 'anchorPassword',
                  }}
                  name="anchorPassword"
                  placeholder=""
                  value={anchorPassword.value}
                  onChange={this.onChange}
                />
                <FormHelperText id="component-error-text">{anchorPassword.message}</FormHelperText>
              </FormControl>
              <FormControl classes={{ root: formControlRoot }} className={formControl} error={!anchorPasswordConfirm.isValid}>
                <div className={managerActionFormLabel}>確認密碼</div>
                <Input
                  defaultValue=""
                  classes={{underline: inputUnderline}}
                  className={input}
                  inputProps={{
                    'aria-label': 'anchorPasswordConfirm',
                  }}
                  name="anchorPasswordConfirm"
                  placeholder=""
                  value={anchorPasswordConfirm.value}
                  onChange={this.onChange}
                />
                <FormHelperText id="component-error-text">{anchorPasswordConfirm.message}</FormHelperText>
              </FormControl>
              <FormControl classes={{ root: formControlRoot }} className={formControl} error={!anchorIconUrl.isValid}>
                <div className={managerActionFormLabel}>照片URL</div>
                <Input
                  defaultValue=""
                  classes={{underline: inputUnderline}}
                  className={input}
                  inputProps={{
                    'aria-label': 'anchorIconUrl',
                  }}
                  name="anchorIconUrl"
                  placeholder=""
                  value={anchorIconUrl.value}
                  onChange={this.onChange}
                />
                <FormHelperText id="component-error-text">{anchorIconUrl.message}</FormHelperText>
              </FormControl>
            </div>
            <div className={managerActionDialogSectionRight}>
              <Button type="submit" variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)}>確定</Button>
              <Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton, dialogCancelButton)} onClick={() => { setOpenAddManagerDialog(false); }}>取消</Button>
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
            deleteAnchor(anchorLoginname.value);
            setOpenAddManagerDialog(false);
          }}
          content="確定要刪除主播嗎?"
        />
      </div>
    );
  }
};

export default withStyles(styles)(AnchorForm);