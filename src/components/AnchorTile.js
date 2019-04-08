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

const AnchorTile = props => {
  const { classes, item } = props;
  const { label } = classes;
  const { loginname, nickname, url } = item;

  return (
    <Fragment>
      <CustomAvatar 
        imgUrl={url}
        label={loginname}
      />
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