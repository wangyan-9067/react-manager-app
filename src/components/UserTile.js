import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CustomAvatar from './CustomAvatar';

const styles = {
  label: {
    marginLeft: '10px',
    fontSize: '1.125rem',
    fontWeight: 'bold'
  }
};

const UserTile = ({ classes, item }) => {
  const { label } = classes;
  const { loginname, nickname, url } = item;
  // TODO: move to separate file
  const defaultIconUrl = 'account-circle.svg';
  const defaultTitle = loginname;

  return (
    <Fragment>
      <CustomAvatar 
        imgUrl={url || defaultIconUrl}
        label={loginname}
      />
      <Tooltip title={nickname || defaultTitle}>
        <Typography color="inherit" align="center" className={label} noWrap={true}>{nickname || defaultTitle}</Typography>
      </Tooltip>
    </Fragment>
  );
}

UserTile.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
};

export default withStyles(styles)(UserTile);