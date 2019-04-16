import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search'

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
    gmCode: { value: '', isValid: true, message: '' }
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

  onSubmit = e => {
    e.preventDefault();
    this.resetValidationStates();

    if (this.formIsValid()) {
    }
  }

  formIsValid = () => {
    const gmCode = { ...this.state.gmCode };

    let isGood = true;

    if (validator.isEmpty(gmCode.value)) {
      gmCode.isValid = false;
      gmCode.message = '必須輸入局號';
      isGood = false;
    }

    if (!isGood) {
      this.setState({
        gmCode
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
    const { gmCode } = this.state;
    const { classes, getBetHistory } = this.props;
    const {
      inputUnderline,
      input,
      formControlRoot,
      formControl,
    } = classes;

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div>
            <FormControl classes={{ root: formControlRoot }} className={formControl} error={!gmCode.isValid}>
              <Input
                defaultValue=""
                classes={{underline: inputUnderline}}
                className={input}
                inputProps={{
                  'aria-label': 'gmCode',
                }}
                name="gmCode"
                placeholder="輸入局號查詢"
                onChange={this.onChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Search"
                      onClick={() => {
                        getBetHistory(gmCode.value);
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText id="component-error-text">{gmCode.message}</FormHelperText>
            </FormControl>
          </div>
        </form>
      </div>
    );
  }
};

SearchForm.propTypes = {
  classes: PropTypes.object.isRequired,
  getBetHistory: PropTypes.func
};

export default withStyles(styles)(SearchForm);