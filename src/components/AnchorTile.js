import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const styles = {
  label: {
    marginLeft: '10px',
    fontSize: '1.125rem',
    fontWeight: 'bold'
  }
};

const AnchorTile = props => {
  const [useIconAvatar, setUseIconAvatar] = useState(false);
  const { classes, item } = props;
  const { label } = classes;
  const { loginname, nickname, url } = item;

  return (
    <Fragment>
      { useIconAvatar? (
        <Avatar><AccountCircle /></Avatar>
      ): (
        <Avatar aria-label={loginname} src={url} onError={() => { setUseIconAvatar(true); }} />
      )}
      <Tooltip title={nickname}>
        <Typography color="inherit" align="center" className={label} noWrap={true}>{nickname}</Typography>
      </Tooltip>
    </Fragment>
  );
}

AnchorTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AnchorTile);