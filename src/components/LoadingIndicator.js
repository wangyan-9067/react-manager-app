import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    position: 'fixed',
    top: '50%',
    left: '47%',
    zIndex: '9999'
  },
  show: {
    display: 'block'
  },
  hide: {
    display: 'none'
  }
});

const LoadingIndicator = ({ classes, showLoading }) => {
  const LoadingIndicatorClasses = classNames.bind(classes);
  const progressClass = LoadingIndicatorClasses({
    progress: true,
    show: showLoading,
    hide: !showLoading
  });

  return (
    <CircularProgress className={progressClass} />
  );
}

LoadingIndicator.propTypes = {
  classes: PropTypes.object.isRequired,
  showLoading: PropTypes.bool.isRequired
};

export default withStyles(styles)(LoadingIndicator);