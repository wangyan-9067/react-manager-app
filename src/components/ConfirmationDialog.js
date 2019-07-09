import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { combineStyles, dialogStyles, buttonStyles } from '../styles';

import { getLangConfig } from '../helpers/appUtils';

class ConfirmationDialog extends React.Component {
    onClick = () => {
        this.props.onConfirm();
        this.props.onClose();
    }

    render() {
        const {
            dialogPaper, dialogContent, dialogActionsRootNoBorder,
            dialogActionButton, actionButton
        } = this.props.classes;
        const langConfig = getLangConfig();

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="responsive-dialog-title"
                classes={{ paper: dialogPaper }}
            >
                <DialogContent>
                    <Typography color="inherit" className={dialogContent}>{this.props.message}</Typography>
                </DialogContent>
                <DialogActions classes={{ root: dialogActionsRootNoBorder }}>
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        className={classNames(actionButton, dialogActionButton)}
                        onClick={this.onClick}
                    >
                        {langConfig.BUTTON_LABEL.CONFIRM}
                    </Button>
                    <Button variant="contained" size="medium" className={classNames(actionButton, dialogActionButton)} onClick={this.props.onClose}>{langConfig.BUTTON_LABEL.CANCEL}</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

ConfirmationDialog.propTypes = {
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
};

const combinedStyles = combineStyles(dialogStyles, buttonStyles);

export default withStyles(combinedStyles)(ConfirmationDialog);