import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import CallEndIcon from '@material-ui/icons/CallEnd';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import GridListBase from '../components/GridListBase';
import WaitingUser from '../components/WaitingUser';
import TelebetTile from './TelebetTile';
import { setToastMessage, setToastVariant, toggleToast } from '../actions/app';
import { setManagerAction, setIsAnswerCall, setIncomingCallCount } from '../actions/voice';
import { MUTE_STATE, MANAGER_ACTION_TYPE, DATA_SERVER_VIDEO_STATUS } from '../constants';
import { formatAmount, isObject } from '../helpers/utils';
import { getLangConfig } from '../helpers/appUtils';

const telebetListTheme = createMuiTheme({
	shadows: new Array(25),
	overrides: {
		MuiToggleButton: {
			root: {
        '&$selected': {
					color: '#FFFFFF',
					backgroundColor: '#3970B0',
					border: '3px solid #DF6C68',
					'&:hover': {
						color: '#FFFFFF',
						backgroundColor: '#3970B0',
						border: '3px solid #DF6C68'
					}
				},
				'&:hover': {
					color: '#FFFFFF',
					backgroundColor: '#3970B0',
					border: '3px solid #DF6C68'
				}
			}
		}
	}
});

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    // padding: '5px',
		backgroundColor: '#FFFFFF',
		borderRadius: '10px'
	},
	pageBorder: {
		border: '3px solid #FD0100'
	},
	tile: {
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		// backgroundColor: '#F5F5F5',
		// borderRadius: '16px',
		// minHeight: '200px'
	},
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
	actionButtonWrapper: {
		width: '100%',
    minWidth: '750px'
	},
	actionButton: {
    margin: '5px',
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
	mutingButton: {
		backgroundColor: '#FD0100',
    '&:hover': {
      backgroundColor: '#FD0100',
      borderColor: '#FD0100',
    }
	},
	blacklistButton: {
		backgroundColor: '#4A4B4F',
    '&:hover': {
      backgroundColor: '#4A4B4F',
      borderColor: '#4A4B4F',
    }
	},
	cancelButton: {
		backgroundColor: '#AAAAAA',
    '&:hover': {
      backgroundColor: '#AAAAAA',
      borderColor: '#AAAAAA',
    }
	},
	separator: {
    padding: '30px',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
	},
  icon: {
    marginRight: theme.spacing.unit,
    fontSize: 32
	},
	dialogPaper: {
		width: '100%'
	},
	dialogActionButton: {
		fontSize: '1.125rem',
	},
	dialogTitle: {
		color: '#7B7B7B',
		fontSize: '1.25rem',
		fontWeight: 'bold'
	},
	dialogActionsRoot: {
		borderTop: '1px solid #C8C8C8',
    paddingTop: '10px',
    justifyContent: 'center'
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
	},
	show: {
		display: 'inline-flex'
	},
	hide: {
		display: 'none'
	},
	toggleButtonRoot: {
		height: '50px',
		margin: '5px',
		color: '#FFFFFF',
		backgroundColor: '#3970B0'
	},
	toggleButtonDisabled: {
		backgroundColor: '#F4F4F4',
		color: '#D5D5D5'
	},
	toggleButtonLabel: {
		fontSize: '1rem',
		fontWeight: 'bold'
	}
});

const changeTable = (event, table, setTableAssigned) => {
	setTableAssigned(table);
};

const AnswerCallPanel = ({
	classes,
	currentChannelId,
	channelList,
	isAnchorCall,
	leaveChannel,
	assignTable,
	assignTableToChannel,
	toggleMuteChannel,
	kickoutClientFromDataServer,
	kickoutClient,
	blacklistClient,
	tableList,
	setManagerAction,
	setIsAnswerCall,
	setToastMessage,
	setToastVariant,
	toggleToast
}) => {
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
		icon,
		dialogPaper,
		dialogActionButton,
		dialogTitle,
		dialogActionsRoot,
		dialogActionsRootNoBorder,
		dialogContent,
		toggleButtonRoot,
		toggleButtonDisabled,
		toggleButtonLabel
	} = classes;
	const { MUTE, UNMUTE } = MUTE_STATE;
	const currentChannel = channelList.find(channel => channel.channelId === currentChannelId);
	const vidsInChannel = channelList.map(channel => channel.vid);
	const langConfig = getLangConfig();

	// Error handling when currentChannel is not found in existing channel list
	if (!currentChannel) {
		setIsAnswerCall(false);
		setToastMessage(langConfig.ERROR_MESSAGES.NO_CURRENT_CHANNEL);
		setToastVariant('error');
		toggleToast(true);
	}

	const { vid, clientName, anchorName, clientMute, anchorMute } = currentChannel;
	const currentTable = vid ? tableList.find(table => table.vid === vid) : null;
	console.log("Current Table: ",currentTable)
	const [openAssignTableDialog, setOpenAssignTableDialog] = useState(false);
	const [tableAssigned, setTableAssigned] = useState(vid);
	const [openKickoutClientDialog, setOpenKickoutClientDialog] = useState(false);
	const [openBlacklistDialog, setOpenBlacklistDialog] = useState(false);

	const { KICKOUT_CLIENT, BLACKLIST_CLIENT } = MANAGER_ACTION_TYPE;

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
		<MuiThemeProvider theme={telebetListTheme}>
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
							<Typography color="inherit" className={answerCallPanelRightText}><span>{langConfig.TELEBET_LIST_LABEL.BALANCE}</span><span className={answerCallPanelRightTextValue}>{isObject(currentTable) && currentTable.account ? `$${formatAmount(currentTable.account)}` : '-'}</span></Typography>
							<Typography color="inherit" className={answerCallPanelRightText}><span>{langConfig.TELEBET_LIST_LABEL.TABLE_VID}</span><span className={answerCallPanelRightTextValue}>{vid ? vid : '-'}</span></Typography>
						</CardContent>
					</Card>
				</div>
				<div className={actionButtonWrapper}>
					<Button variant="contained" size="medium" color="inherit" className={clientMuteButtonClass} onClick={() => { toggleMuteChannel(currentChannelId, false, clientMute === MUTE ? UNMUTE : MUTE) }}><VolumeUpIcon className={icon}/>{langConfig.BUTTON_LABEL.PLAYER_MUTE}</Button>
					<Button variant="contained" size="medium" color="inherit" className={anchorMuteButtonClass} onClick={() => { toggleMuteChannel(currentChannelId, true, anchorMute === MUTE ? UNMUTE : MUTE) }}><VolumeUpIcon className={icon}/>{langConfig.BUTTON_LABEL.ANCHOR_MUTE}</Button>
					<Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { leaveChannel(currentChannelId); }}><CallEndIcon className={icon} />{langConfig.BUTTON_LABEL.LEAVE_CHANNEL}</Button>
					<Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { setOpenAssignTableDialog(true) }}>{langConfig.BUTTON_LABEL.ASSIGN_TABLE}</Button>
					<Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { setOpenKickoutClientDialog(true) }}>{langConfig.BUTTON_LABEL.KICKOUT_PLAYER}</Button>
					<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, blacklistButton)} onClick={() => { setOpenBlacklistDialog(true) }}>{langConfig.BUTTON_LABEL.BLACKLIST_PLAYER}</Button>
				</div>
				{ /** Assign Table Dialog*/ }
				<Dialog
					open={openAssignTableDialog}
					onClose={() => { setOpenAssignTableDialog(false)}}
					aria-labelledby="responsive-dialog-title"
					classes={{ paper: dialogPaper }}
				>
					<DialogTitle id="responsive-dialog-title">
						<Typography color="inherit" className={dialogTitle}>{langConfig.TELEBET_LIST_LABEL.CHOOSE_TABLE}</Typography>
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							<ToggleButtonGroup
								value={tableAssigned}
								exclusive
								onChange={(event, table) => {
									if (!table) {
										table = tableAssigned;
									}
									changeTable(event, table, setTableAssigned);
								}}
							>
							{tableList.map((table, index) =>
								<ToggleButton key={index} value={table.vid} disabled={table.status !== DATA_SERVER_VIDEO_STATUS.FREE || vidsInChannel.indexOf(table.vid) > -1} classes={{ root: toggleButtonRoot, disabled: toggleButtonDisabled }}>
									<Typography color="inherit" className={toggleButtonLabel}>{table.vid}</Typography>
								</ToggleButton>
							)}
							</ToggleButtonGroup>
						</DialogContentText>
					</DialogContent>
					<DialogActions classes={{ root: dialogActionsRoot }}>
						<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { assignTable(tableAssigned, clientName); setOpenAssignTableDialog(false); }}>{langConfig.BUTTON_LABEL.CONFIRM}</Button>
						<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { setOpenAssignTableDialog(false) }}>{langConfig.BUTTON_LABEL.CANCEL}</Button>
					</DialogActions>
				</Dialog>
				{ /** Kickout Client Dialog*/ }
				<Dialog
					open={openKickoutClientDialog}
					onClose={() => { setOpenKickoutClientDialog(false)}}
					aria-labelledby="responsive-dialog-title"
					classes={{ paper: dialogPaper }}
				>
					<DialogContent>
						<DialogContentText><Typography color="inherit" className={dialogContent}>{langConfig.DIALOG_LABEL.CONFIRM_KICKOUT_PLAYER.replace("{clientName}", clientName)}</Typography></DialogContentText>
					</DialogContent>
					<DialogActions classes={{ root: dialogActionsRootNoBorder }}>
						<Button
							variant="contained"
							size="medium"
							color="inherit"
							className={classNames(actionButton, dialogActionButton)}
							onClick={() => {
								setManagerAction(KICKOUT_CLIENT);

								if (!tableAssigned) {
									kickoutClient(currentChannelId);
								} else {
									kickoutClientFromDataServer(tableAssigned, clientName);
								}

								setOpenKickoutClientDialog(false);
							}}
						>
							{langConfig.BUTTON_LABEL.CONFIRM}
						</Button>
						<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { setOpenKickoutClientDialog(false) }}>{langConfig.BUTTON_LABEL.CANCEL}</Button>
					</DialogActions>
				</Dialog>
				{ /** Blacklist Dialog*/ }
				<Dialog
					open={openBlacklistDialog}
					onClose={() => { setOpenBlacklistDialog(false)}}
					aria-labelledby="responsive-dialog-title"
					classes={{ paper: dialogPaper }}
				>
					<DialogContent>
						<DialogContentText><Typography color="inherit" className={dialogContent}>{langConfig.DIALOG_LABEL.CONFIRM_BACKLIST_PLAYER.replace("{clientName}", clientName)}</Typography></DialogContentText>
					</DialogContent>
					<DialogActions classes={{ root: dialogActionsRootNoBorder }}>
						<Button
							variant="contained"
							size="medium"
							color="inherit"
							className={classNames(actionButton, dialogActionButton)}
							onClick={() => {
								setManagerAction(BLACKLIST_CLIENT);

								if (!tableAssigned) {
									blacklistClient(currentChannelId);
								} else {
									kickoutClientFromDataServer(tableAssigned, clientName);
								}

								setOpenBlacklistDialog(false);
							}}>
								{langConfig.BUTTON_LABEL.CONFIRM}
							</Button>
						<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { setOpenBlacklistDialog(false) }}>{langConfig.BUTTON_LABEL.CANCEL}</Button>
					</DialogActions>
				</Dialog>
			</Fragment>
		</MuiThemeProvider>
	);
};

AnswerCallPanel.prototype = {
	classes: PropTypes.object.isRequired,
	currentChannelId: PropTypes.number,
	channelList: PropTypes.array,
	isAnchorCall: PropTypes.bool,
	leaveChannel: PropTypes.func,
	assignTable: PropTypes.func,
	assignTableToChannel: PropTypes.func,
	toggleMuteChannel: PropTypes.func,
	kickoutClientFromDataServer: PropTypes.func,
	kickoutClient: PropTypes.func,
	blacklistClient: PropTypes.func,
	tableList: PropTypes.array,
	setManagerAction: PropTypes.func,
	setIsAnswerCall: PropTypes.func,
	setToastMessage: PropTypes.func,
	setToastVariant: PropTypes.func,
	toggleToast: PropTypes.func
};

const TelebetList = ({
	classes,
	channelList,
	joinChannel,
	leaveChannel,
	assignTable,
	assignTableToChannel,
	isAnswerCall,
	isAnchorCall,
	currentChannelId,
	toggleMuteChannel,
	kickoutClientFromDataServer,
	kickoutClient,
	blacklistClient,
	waitingList,
	tableList,
	setManagerAction,
	setIsAnswerCall,
	setToastMessage,
	setToastVariant,
	toggleToast,
	assignTokenToDelegator,
	kickDelegator,
	setIncomingCallCount
}) => {
	const { separator, tile } = classes;

	const telebetListClasses = classNames.bind(classes);
	const classList = telebetListClasses({
		root: true,
		pageBorder: isAnswerCall
	});

	// TODO: remove testing data
	// channelList[3].clientName = 'TSThk456';
	// channelList[3].clientState = 2;
	// channelList[4].clientName = 'TSThk457';
	// channelList[4].clientState = 2;
	// channelList[4].anchorName = 'alice';
	// channelList[4].anchorState = 1;
	// channelList[4].vid = 'V010';
	// channelList[1].clientName = 'hk789';
	// channelList[1].anchorName = 'joyce';
	// channelList[1].anchorState = 7;
	// channelList[1].vid = 'V02';
	// channelList[2].clientName = 'hk111';
	// channelList[2].managerName = 'abc';
	// channelList[2].anchorName = 'joyce';
	// channelList[2].anchorState = 2;
	// channelList[2].clientState = 2;

	let panel;
console.log("isAnswerCall", isAnswerCall);

	

	if (isAnswerCall) {
		panel = (
			<AnswerCallPanel
				classes={classes}
				currentChannelId={currentChannelId}
				channelList={channelList}
				isAnchorCall={isAnchorCall}
				leaveChannel={leaveChannel}
				assignTable={assignTable}
				assignTableToChannel={assignTableToChannel}
				toggleMuteChannel={toggleMuteChannel}
				kickoutClientFromDataServer={kickoutClientFromDataServer}
				kickoutClient={kickoutClient}
				blacklistClient={blacklistClient}
				tableList={tableList}
				setManagerAction={setManagerAction}
				setIsAnswerCall={setIsAnswerCall}
				setToastMessage={setToastMessage}
				setToastVariant={setToastVariant}
				toggleToast={toggleToast}
			/>
		);
	} else {
		panel = (
			<GridListBase list={channelList} tileClass={tile}>
				<TelebetTile joinChannel={joinChannel} tableList={tableList} setIncomingCallCount={setIncomingCallCount} />
			</GridListBase>
		);
	}

	return (
		<div className={classList}>
			{ panel }
			<div className={separator} />
			{!isAnswerCall && 			
				<WaitingUser waitingList={waitingList} assignTokenToDelegator={assignTokenToDelegator} kickDelegator={kickDelegator} />
			}
		</div>
	);
}

TelebetList.prototype = {
	classes: PropTypes.object.isRequired,
	channelList: PropTypes.array,
	joinChannel: PropTypes.func,
	leaveChannel: PropTypes.func,
	assignTable: PropTypes.func,
	assignTableToChannel: PropTypes.func,
	isAnswerCall: PropTypes.bool,
	isAnchorCall: PropTypes.bool,
	currentChannelId: PropTypes.number,
	toggleMuteChannel: PropTypes.func,
	kickoutClientFromDataServer: PropTypes.func,
	kickoutClient: PropTypes.func,
	blacklistClient: PropTypes.func,
	waitingList: PropTypes.func,
	tableList: PropTypes.array,
	setManagerAction: PropTypes.func,
	setIsAnswerCall: PropTypes.func,
	setToastMessage: PropTypes.func,
	setToastVariant: PropTypes.func,
	toggleToast: PropTypes.func,
	assignTokenToDelegator: PropTypes.func,
	kickDelegator: PropTypes.func,
	setIncomingCallCount: PropTypes.func
}

const StyledTelebetList = withStyles(styles)(TelebetList);

const mapStateToProps = state => {
	const {
		voiceAppId,
		channelList,
		currentChannelId,
		isAnswerCall,
		isAnchorCall,
		waitingList
	} = state.voice;

	const {
		tableList
	} = state.data;	
  return ({
		voiceAppId,
		channelList,
		currentChannelId,
		isAnswerCall,
		isAnchorCall,
		waitingList,
		tableList
  });
};

const mapDispatchToProps = dispatch => ({
	setManagerAction: action => dispatch(setManagerAction(action)),
	setIsAnswerCall: answer => dispatch(setIsAnswerCall(answer)),
	setToastMessage: message => dispatch(setToastMessage(message)),
	setToastVariant: variant => dispatch(setToastVariant(variant)),
	toggleToast: toggle => dispatch(toggleToast(toggle)),
	setIncomingCallCount: count => dispatch(setIncomingCallCount(count))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledTelebetList);