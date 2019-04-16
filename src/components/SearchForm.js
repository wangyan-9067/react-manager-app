import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
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
    gmCode: { value: '' }
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
            <FormControl classes={{ root: formControlRoot }} className={formControl}>
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
                      onClick={e => {
                        e.preventDefault();
                        getBetHistory(gmCode.value);
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
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