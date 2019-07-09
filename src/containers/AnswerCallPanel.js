import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import CallEndIcon from '@material-ui/icons/CallEnd';

import ConfirmationDialog from '../components/ConfirmationDialog';
import { getLangConfig } from '../helpers/appUtils';
import { MUTE_STATE, MANAGER_ACTION_TYPE } from '../constants';
import { formatAmount } from '../helpers/utils';
import { setIsAnswerCall, setManagerAction } from '../actions/voice';
import { setToastMessage, setToastVariant, toggleToast } from '../actions/app';
import voiceAPI from '../services/Voice/voiceAPI';
import dataAPI from '../services/Data/dataAPI';

class AnswerCallPanel extends React.Component {
    state = {
        tableAssigned: '',
        openKickoutClientDialog: false,
        openBlacklistDialog: false
    };

    componentDidMount() {
        let { vid } = this.getCurrentChannelInfo();

        this.setState({
            tableAssigned: vid
        });
    }

    onClientMuteButtonClicked = () => {
        const { clientMute, channelId: currentChannelId } = this.getCurrentChannelInfo();
        const { MUTE, UNMUTE } = MUTE_STATE;

        voiceAPI.toggleMuteChannel(currentChannelId, false, clientMute === MUTE ? UNMUTE : MUTE)
    }

    onAnchorMuteButtonClicked = () => {
        const { channelId: currentChannelId, anchorMute } = this.getCurrentChannelInfo();
        const { MUTE, UNMUTE } = MUTE_STATE;

        voiceAPI.toggleMuteChannel(currentChannelId, true, anchorMute === MUTE ? UNMUTE : MUTE);
    }

    onLeaveChannelClicked = () => {
        const { currentChannelId } = this.props;

        voiceAPI.leaveChannel(currentChannelId);
    }

    getCurrentChannelInfo() {
        const { currentChannelId, channelList } = this.props;

        return channelList.find(channel => channel.channelId === currentChannelId);
    }

    onKickoutClientClicked = () => {
        this.setState({
            openKickoutClientDialog: true
        });
    }

    onBlackListClicked = () => {
        this.setState({
            openBlacklistDialog: true
        });
    }

    closeKickoutDialog = () => {
        this.setState({
            openKickoutClientDialog: false
        });
    }

    kickoutClient = () => {
        const { KICKOUT_CLIENT } = MANAGER_ACTION_TYPE;
        const { clientName } = this.getCurrentChannelInfo();
        const { currentChannelId } = this.props;
        const { tableAssigned } = this.state;

        this.props.setManagerAction(KICKOUT_CLIENT);

        if (!tableAssigned) {
            voiceAPI.kickoutClient(currentChannelId);
        } else {
            dataAPI.kickoutClientFromDataServer(tableAssigned, clientName);
        }

        this.setState({
            openKickoutClientDialog: false
        });
    }

    closeBlacklistDialog = () => {
        this.setState({
            openBlacklistDialog: false
        });
    }

    blacklistClient = () => {
        const { BLACKLIST_CLIENT } = MANAGER_ACTION_TYPE;
        const { tableAssigned } = this.state;
        const { clientName, channelId: currentChannelId } = this.getCurrentChannelInfo();

        this.props.setManagerAction(BLACKLIST_CLIENT);

        if (!tableAssigned) {
            voiceAPI.blacklistClient(currentChannelId);
        } else {
            dataAPI.kickoutClientFromDataServer(tableAssigned, clientName);
        }

        this.setState({
            openBlacklistDialog: false
        });
    }

    render() {
        const {
            classes,
            isAnchorCall,
            setIsAnswerCall,
            setToastMessage,
            setToastVariant,
            toggleToast,
            player
        } = this.props;

        const {
            answerCallPanel,
            answerCallPanelLeftRoot,
            answerCallPanelLeftText,
            answerCallPanelRightRoot,
            answerCallPanelRight,
            answerCallPanelRightText,
            answerCallPanelRightTextValue,
            actionButtonWrapper,
            actionButton,
            blacklistButton,
            icon
        } = classes;
        const { MUTE } = MUTE_STATE;
        const currentChannel = this.getCurrentChannelInfo();
        const langConfig = getLangConfig();
        let latestPlayerBalance = 0;

        if (currentChannel) {
            latestPlayerBalance = currentChannel.clientBalance;
            if (player.username !== '' && player.username === currentChannel.clientName) latestPlayerBalance = player.balance;
        }

        // Error handling when currentChannel is not found in existing channel list
        if (!currentChannel) {
            setIsAnswerCall(false);
            setToastMessage(langConfig.ERROR_MESSAGES.NO_CURRENT_CHANNEL);
            setToastVariant('error');
            toggleToast(true);
        }

        const { vid, clientName, anchorName, clientMute, anchorMute } = currentChannel;

        let line1Text;
        let line2Text;
        let clientMuteStatusTextDisplay;
        let anchorMuteStatusTextDisplay;

        if (isAnchorCall) {
            line1Text = langConfig.TELEBET_LIST_LABEL.WITH_TABLE.replace("{vid}", vid);
            line2Text = langConfig.TELEBET_LIST_LABEL.WITH_PLAYER_AND_ANCHOR.replace("{clientName}", clientName).replace("{anchorName}", anchorName)
        } else {
            line1Text = langConfig.TELEBET_LIST_LABEL.WITH_PLAYER;
            line2Text = clientName;
        }

        clientMuteStatusTextDisplay = clientMute === MUTE ? langConfig.TELEBET_LIST_LABEL.PLAYER_MUTE_ON_GOINGING : '';
        anchorMuteStatusTextDisplay = anchorMute === MUTE ? langConfig.TELEBET_LIST_LABEL.ANCHOR_MUTE_ON_GOINGING : '';

        const answerCallPanelClass = classNames.bind(classes);
        const clientMuteButtonClass = answerCallPanelClass({
            actionButton: true,
            mutingButton: clientMute === MUTE
        });
        const anchorMuteButtonClass = answerCallPanelClass({
            actionButton: true,
            mutingButton: anchorMute === MUTE,
            show: isAnchorCall,
            hide: !isAnchorCall
        });
        const answerCallPanelLeftClass = answerCallPanelClass({
            answerCallPanelLeft: true,
            answerCallPanelLeftAnchor: isAnchorCall
        });

        return (
            <Fragment>
                <div className={answerCallPanel}>
                    <Card classes={{ root: answerCallPanelLeftRoot }}>
                        <CardContent className={answerCallPanelLeftClass}>
                            <Typography color="inherit" className={answerCallPanelLeftText}>{line1Text}</Typography>
                            <Typography color="inherit" className={answerCallPanelLeftText}>{line2Text}</Typography>
                            <Typography color="inherit" className={answerCallPanelLeftText}>{langConfig.TELEBET_LIST_LABEL.CONNECTED}  {clientMuteStatusTextDisplay}{anchorMuteStatusTextDisplay}</Typography>
                        </CardContent>
                    </Card>
                    <Card classes={{ root: answerCallPanelRightRoot }}>
                        <CardContent className={answerCallPanelRight}>
                            <Typography color="inherit" className={answerCallPanelRightText}><span>{langConfig.TELEBET_LIST_LABEL.PLAYER}</span><span className={answerCallPanelRightTextValue}>{clientName}</span></Typography>
                            <Typography color="inherit" className={answerCallPanelRightText}><span>{langConfig.TELEBET_LIST_LABEL.BALANCE}</span><span className={answerCallPanelRightTextValue}>{latestPlayerBalance > 0 ? `$${formatAmount(latestPlayerBalance)}` : '-'}</span></Typography>
                            <Typography color="inherit" className={answerCallPanelRightText}><span>{langConfig.TELEBET_LIST_LABEL.TABLE_VID}</span><span className={answerCallPanelRightTextValue}>{vid ? vid : '-'}</span></Typography>
                        </CardContent>
                    </Card>
                </div>
                <div className={actionButtonWrapper}>
                    <Button variant="contained" size="medium" color="inherit" className={clientMuteButtonClass} onClick={this.onClientMuteButtonClicked}>{clientMute === MUTE ? <VolumeOffIcon className={icon} /> : <VolumeUpIcon className={icon} />}{langConfig.BUTTON_LABEL.PLAYER_MUTE}</Button>
                    <Button variant="contained" size="medium" color="inherit" className={anchorMuteButtonClass} onClick={this.onAnchorMuteButtonClicked}>{anchorMute === MUTE ? <VolumeOffIcon className={icon} /> : <VolumeUpIcon className={icon} />}{langConfig.BUTTON_LABEL.ANCHOR_MUTE}</Button>
                    <Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={this.onLeaveChannelClicked}><CallEndIcon className={icon} />{langConfig.BUTTON_LABEL.LEAVE_CHANNEL}</Button>
                    <Button variant="contained" size="medium" color="inherit" className={actionButton} disabled={vid !== ''} onClick={this.onOpenAssignTableDialogClicked}>{langConfig.BUTTON_LABEL.ASSIGN_TABLE}</Button>
                    <Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={this.onKickoutClientClicked}>{langConfig.BUTTON_LABEL.KICKOUT_PLAYER}</Button>
                    <Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, blacklistButton)} onClick={this.onBlackListClicked}>{langConfig.BUTTON_LABEL.BLACKLIST_PLAYER}</Button>
                </div>
                { /** Kickout Client Dialog*/}
                <ConfirmationDialog
                    open={this.state.openKickoutClientDialog}
                    onClose={this.closeKickoutDialog}
                    onConfirm={this.kickoutClient}
                    message={langConfig.DIALOG_LABEL.CONFIRM_KICKOUT_PLAYER.replace("{clientName}", clientName)} />
                { /** Blacklist Dialog*/}
                <ConfirmationDialog
                    open={this.state.openBlacklistDialog}
                    onClose={this.closeBlacklistDialog}
                    onConfirm={this.blacklistClient}
                    message={langConfig.DIALOG_LABEL.CONFIRM_BACKLIST_PLAYER.replace("{clientName}", clientName)} />
            </Fragment>
        );
    }
}

AnswerCallPanel.propTypes = {
    classes: PropTypes.object.isRequired,
    currentChannelId: PropTypes.number.isRequired,
    channelList: PropTypes.array.isRequired,
    isAnchorCall: PropTypes.bool.isRequired,
    setIsAnswerCall: PropTypes.func.isRequired,
    setToastMessage: PropTypes.func.isRequired,
    setToastVariant: PropTypes.func.isRequired,
    toggleToast: PropTypes.func.isRequired,
    player: PropTypes.object.isRequired,
    setManagerAction: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    const {
        channelList,
        currentChannelId,
        isAnchorCall,
    } = state.voice;

    const {
        player
    } = state.data;
    const {
        managerCredential
    } = state.app
    return ({
        channelList,
        currentChannelId,
        isAnchorCall,
        managerCredential,
        player
    });
};

const mapDispatchToProps = dispatch => ({
    setIsAnswerCall: value => dispatch(setIsAnswerCall(value)),
    setToastMessage: message => dispatch(setToastMessage(message)),
    setToastVariant: value => dispatch(setToastVariant(value)),
    toggleToast: value => dispatch(toggleToast(value)),
    setManagerAction: action => dispatch(setManagerAction(action))
});

export default connect(mapStateToProps, mapDispatchToProps)(AnswerCallPanel);