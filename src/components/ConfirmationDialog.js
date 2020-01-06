import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { getLangConfig } from '../helpers/appUtils';

import dialogStyles from '../css/dialog.module.css';
import buttonStyles from '../css/button.module.scss';

export default class ConfirmationDialog extends React.Component {
    onClick = () => {
        this.props.onConfirm();
        this.props.onClose();
    }

    render() {
        const langConfig = getLangConfig();

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="responsive-dialog-title"
                classes={{ paper: dialogStyles.dialogPaper }}
            >
                <DialogContent>
                    <Typography color="inherit" className={dialogStyles.dialogContent}>{this.props.message}</Typography>
                </DialogContent>
                <DialogActions classes={{ root: dialogStyles.dialogActionsRootNoBorder }}>
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        className={classNames(buttonStyles.actionButton, dialogStyles.dialogActionButton)}
                        onClick={this.onClick}
                    >
                        {langConfig.BUTTON_LABEL.CONFIRM}
                    </Button>
                    <Button variant="contained" size="medium" className={classNames(buttonStyles.actionButton, dialogStyles.dialogActionButton)} onClick={this.props.onClose}>{langConfig.BUTTON_LABEL.CANCEL}</Button>
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