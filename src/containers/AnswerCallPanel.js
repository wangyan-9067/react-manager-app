import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { combineStyles, buttonStyles } from '../styles';

import ConfirmationDialog from '../components/ConfirmationDialog';
import { getLangConfig } from '../helpers/appUtils';
import { MUTE_STATE, MANAGER_ACTION_TYPE } from '../constants';
import { formatAmount } from '../helpers/utils';
import { setIsAnswerCall, setManagerAction } from '../actions/voice';
import { setToastMessage, setToastVariant, toggleToast } from '../actions/app';
import voiceAPI from '../services/Voice/voiceAPI';
import dataAPI from '../services/Data/dataAPI';

const styles = theme => ({
    answerCallPanel: {
        display: 'flex',
        borderRadius: '10px',
        width: '90%',
        margin: '50px 0 35px 0'
    },
    answerCallPanelLeftRoot: {
        width: '70%',
        borderRadius: '10px 0px 0px 10px'
    },
    answerCallPanelLeft: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#FD0100',
        color: '#FFFFFF',
        padding: '30px 0'
    },
    answerCallPanelLeftAnchor: {
        backgroundColor: '#1779E6'
    },
    answerCallPanelLeftText: {
        fontWeight: 'bold',
        fontSize: '2rem'
    },
    answerCallPanelRightRoot: {
        width: '30%',
        borderRadius: '0px 10px 10px 0px'
    },
    answerCallPanelRight: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        textAlign: 'left',
        backgroundColor: '#D8D8D8',
        color: '#797979',
        padding: '35px 30px 0 30px'
    },
    answerCallPanelRightText: {
        fontWeight: 'bold',
        fontSize: '1.125rem'
    },
    answerCallPanelRightTextValue: {
        padding: '10px'
    },
    show: {
        display: 'inline-flex'
    },
    hide: {
        display: 'none'
    },
    icon: {
        marginRight: theme.spacing.unit,
        fontSize: 32
    }
});

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
            tableList
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
            blackButton,
            icon
        } = classes;
        const { MUTE } = MUTE_STATE;
        const currentChannel = this.getCurrentChannelInfo();
        const langConfig = getLangConfig();
        let latestPlayerBalance = 0;

        if (currentChannel) {
            const table = tableList.find( table => table.vid === currentChannel.vid);
            latestPlayerBalance = table ? table.account : currentChannel.clientBalance;
        }

        // Error handling when currentChannel is not found in existing channel list
        if (!currentChannel) {
            setIsAnswerCall(false);
            setToastMessage(langConfig.ERROR_MESSAGES.NO_CURRENT_CHANNEL);
            setToastVariant('error');
            toggleToast(true);
        }

        const { vid, clientName, anchorName, clientMute, anchorMute, currency } = currentChannel;

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
            redButton: clientMute === MUTE
        });
        const anchorMuteButtonClass = answerCallPanelClass({
            actionButton: true,
            redButton: anchorMute === MUTE,
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
                            {/* <Typography color="inherit" className={answerCallPanelRightText}><span>{langConfig.TELEBET_LIST_LABEL.PLAYER}</span><span className={answerCallPanelRightTextValue}>{clientName}</span></Typography> */}
                            <Typography color="inherit" className={answerCallPanelRightText}><span>{langConfig.TELEBET_LIST_LABEL.BALANCE}</span><span className={answerCallPanelRightTextValue}>{latestPlayerBalance > 0 ? `${formatAmount(latestPlayerBalance, currency)}` : '-'}</span></Typography>
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
                    <Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, blackButton)} onClick={this.onBlackListClicked}>{langConfig.BUTTON_LABEL.BLACKLIST_PLAYER}</Button>
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
    setManagerAction: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    const {
        channelList,
        currentChannelId,
        isAnchorCall,
    } = state.voice;

    const {
        tableList
    } = state.data;
    const {
        managerCredential
    } = state.app
    return ({
        channelList,
        currentChannelId,
        isAnchorCall,
        managerCredential,
        tableList
    });
};

const mapDispatchToProps = dispatch => ({
    setIsAnswerCall: value => dispatch(setIsAnswerCall(value)),
    setToastMessage: message => dispatch(setToastMessage(message)),
    setToastVariant: value => dispatch(setToastVariant(value)),
    toggleToast: value => dispatch(toggleToast(value)),
    setManagerAction: action => dispatch(setManagerAction(action))
});

const combinedStyles = combineStyles(buttonStyles, styles);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(combinedStyles)(AnswerCallPanel));