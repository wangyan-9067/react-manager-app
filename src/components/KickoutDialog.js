import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Dialog, DialogActions, DialogContent, Typography, Button } from '@material-ui/core';

import { getLangConfig } from '../helpers/appUtils';
import voiceAPI from '../services/Voice/voiceAPI';
import dataAPI from '../services/Data/dataAPI';
import { MANAGER_ACTION_TYPE, MANAGER_ACTIONS } from '../constants';

import dialogStyles from '../css/dialog.module.css';
import buttonStyles from '../css/button.module.scss';

export default class KickoutDialog extends React.Component {
    static TYPE = {
        KICKOUT_LINEUP_PLAYERS: 'KICKOUT_LINEUP_PLAYERS',
        KICKOUT_IN_TABLE_PLAYERS: 'KICKOUT_IN_TABLE_PLAYERS'
    }

    onClick = (reason) => {
        const { type, clientName, vid, onClose } = this.props;

        if (type === KickoutDialog.TYPE.KICKOUT_LINEUP_PLAYERS) {
            voiceAPI.kickLineupPlayer(clientName, reason);
        } else {
            dataAPI.kickoutClientFromDataServer(vid, clientName, MANAGER_ACTION_TYPE.KICKOUT_CLIENT);
        }

        onClose();
    }

    delayKickout = () => {
        const { channelId } = this.props;

        voiceAPI.sendManagerAction(MANAGER_ACTIONS.DELAY_KICKOUT_CLIENT, channelId);
        this.props.onClose();
    }

    render() {
        const langConfig = getLangConfig();
        const { type } = this.props;
        const isLineupPopup = type === KickoutDialog.TYPE.KICKOUT_LINEUP_PLAYERS;
        const title = langConfig.DIALOG_LABEL[isLineupPopup ? "CONFIRM_KICKOUT_LINEUP_PLAYER" : "CONFIRM_KICKOUT_IN_TABLE_PLAYER"].replace('{clientName}', this.props.clientName);

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="responsive-dialog-title"
                classes={{ paper: dialogStyles.dialogPaper }} >
                <DialogContent>
                    <Typography color="inherit" className={dialogStyles.dialogContent}>{title}</Typography>
                </DialogContent>
                <DialogActions classes={{ root: dialogStyles.dialogActionsRootNoBorder }}>
                    {isLineupPopup ? (
                        <Fragment>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                className={buttonStyles.actionButtonXS}
                                onClick={this.onClick.bind(this, 1)} >
                                {langConfig.BUTTON_LABEL.IN_VALID_ACCOUNT}
                            </Button>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                className={buttonStyles.actionButtonXS}
                                onClick={this.onClick.bind(this, 2)} >
                                {langConfig.BUTTON_LABEL.GAME_CLOSING}
                            </Button>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                className={buttonStyles.actionButtonXS}
                                onClick={this.onClick.bind(this, 1)} >
                                {langConfig.BUTTON_LABEL.GAME_OVER}
                            </Button>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                className={buttonStyles.actionButtonXS}
                                onClick={this.onClick.bind(this, 2)} >
                                {langConfig.BUTTON_LABEL.ILLEGAL_WORDS}
                            </Button>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                className={buttonStyles.actionButtonXS}
                                onClick={this.onClick.bind(this, 3)} >
                                {langConfig.BUTTON_LABEL.TOO_MANY_ADS}
                            </Button>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                className={buttonStyles.actionButtonXS}
                                onClick={this.onClick.bind(this, 4)} >
                                {langConfig.BUTTON_LABEL.NO_BETS}
                            </Button>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                className={classNames(buttonStyles.actionButtonXS, buttonStyles.toolTip)}
                                onClick={this.delayKickout} >
                                {langConfig.BUTTON_LABEL.WAIT_N_KICKOUT}
                                <span className={classNames(buttonStyles.toolTipText)}>{langConfig.BUTTON_LABEL.WAIT_N_KICKOUT_INFO}</span>
                            </Button>
                        </Fragment>
                    )}
                    <Button variant="contained" size="medium" className={buttonStyles.actionButtonXS} onClick={this.props.onClose}>{langConfig.BUTTON_LABEL.CANCEL}</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

KickoutDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    vid: PropTypes.string
};
