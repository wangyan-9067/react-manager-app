import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';

import { getLangConfig } from '../helpers/appUtils';

const styles = theme => ({
	actionButton: {
    margin: '0 5px',
    padding: '3px 20px',
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
	dialogPaper: {
		width: '100%'
	},
	dialogActionButton: {
		fontSize: '1.125rem',
	},
	dialogActionsRootNoBorder: {
    paddingTop: '10px',
    justifyContent: 'center'
	},
	dialogContent: {
		fontWeight: 'bold',
		fontSize: '1.125rem',
		textAlign: 'center',
		color: '#7E7E7E'
	}
});

const DialogWrapper = ({ classes, isOpen, onCloseHandler, actionHandler, content }) => {
  const { actionButton, dialogPaper, dialogActionButton, dialogActionsRootNoBorder, dialogContent } = classes;
  const langConfig = getLangConfig();

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        if (onCloseHandler instanceof Function) {
          onCloseHandler();
        }
      }}
      aria-labelledby="responsive-dialog-title"
      classes={{ paper: dialogPaper }}
    >
      <DialogContent>
        <DialogContentText>
          <Typography color="inherit" className={dialogContent}>
            {content}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions classes={{ root: dialogActionsRootNoBorder }}>
        <Button
          variant="contained"
          size="medium"
          color="inherit"
          className={classNames(actionButton, dialogActionButton)}
          onClick={() => {
            if (actionHandler instanceof Function) {
              actionHandler();
            }
          }}
        >
          {langConfig.BUTTON_LABEL.CONFIRM}
        </Button>
        <Button
          variant="contained"
          size="medium"
          color="inherit"
          className={classNames(actionButton, dialogActionButton)}
          onClick={() => {
            if (onCloseHandler instanceof Function) {
              onCloseHandler();
            }
          }}
        >
          {langConfig.BUTTON_LABEL.CANCEL}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCloseHandler: PropTypes.func,
  actionHandler: PropTypes.func,
  content: PropTypes.string
};

export default withStyles(styles)(DialogWrapper);