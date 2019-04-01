import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const styles = {
  label: {
    marginLeft: '10px'
  }
};

const AnchorTile = props => {
  const { classes, item } = props;
  const { label } = classes;
  const { loginname, nickname, url } = item;

  return (
    <Fragment>
      <Avatar aria-label={loginname} src={url} />
      <Typography color="inherit" align="center" className={label}>{nickname}</Typography>
    </Fragment>
  );
}

AnchorTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AnchorTile);