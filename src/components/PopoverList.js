import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

const styles = () => ({
  button: {
    color: '#6C6C6C'
  }
});

const PopoverList = ({ classes, buttonText, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { button } = classes;
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-owns={open ? 'popover-list' : undefined}
        aria-haspopup="true"
        variant="contained"
        size="small"
        onClick={handleClick}
        className={button}
      >
        { buttonText }
      </Button>
      <Popover
        id="popover-list"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        {children}
      </Popover>
    </div>
  );
};

PopoverList.propTypes = {
  classes: PropTypes.object.isRequired,
  buttonText: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired
};

export default withStyles(styles)(PopoverList);