import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
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

import { setToastMessage, setToastVariant, toggleToast } from '../actions/app';
import { setManagerAction, setIsAnswerCall } from '../actions/voice';
import GridListBase from './GridListBase';
import TelebetTile from './TelebetTile';
import WaitingUser from './WaitingUser';
import { MUTE_STATE, MANAGER_ACTION_TYPE, DATA_SERVER_VIDEO_STATUS } from '../constants';
import { formatAmount, isObject } from '../helpers/utils';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    padding: '5px',
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
		actionButton,
		blacklistButton,
		icon,
		dialogPaper,
		dialogActionButton,
		dialogTitle,
		dialogActionsRoot,
		dialogActionsRootNoBorder,
		dialogContent
	} = classes;
	const { MUTE, UNMUTE } = MUTE_STATE;
	const currentChannel = channelList.find(channel => channel.channelId === currentChannelId);

	// Error handling when currentChannel is not found in existing channel list
	if (!currentChannel) {
		setIsAnswerCall(false);
		setToastMessage("因為系統問題, 所以暫時不能接聽電話, 請聯絡管理員!");
		setToastVariant('error');
		toggleToast(true);
	}

	const { vid, clientName, anchorName, clientMute, anchorMute } = currentChannel;
	const currentTable = vid ? tableList.find(table => table.vid === vid) : null;

	const [openAssignTableDialog, setOpenAssignTableDialog] = useState(false);
	const [tableAssigned, setTableAssigned] = useState(vid);
	const [openKickoutClientDialog, setOpenKickoutClientDialog] = useState(false);
	const [openBlacklistDialog, setOpenBlacklistDialog] = useState(false);

	let line1Text;
	let line2Text;
	let clientMuteStatusTextDisplay;
	let anchorMuteStatusTextDisplay;

	if (isAnchorCall) {
		line1Text = `與 ${vid}`;
		line2Text = `玩家 ${clientName} 主播 ${anchorName}`;
	} else {
		line1Text = '與玩家';
		line2Text = clientName;
	}

	clientMuteStatusTextDisplay = clientMute === MUTE ? '(玩家靜音中)' : '';
	anchorMuteStatusTextDisplay = anchorMute === MUTE ? '(主播靜音中)' : '';

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
						<Typography color="inherit" className={answerCallPanelLeftText}>通訊中...  {clientMuteStatusTextDisplay}{anchorMuteStatusTextDisplay}</Typography>
					</CardContent>
				</Card>
				<Card classes={{ root: answerCallPanelRightRoot }}>
					<CardContent className={answerCallPanelRight}>
						<Typography color="inherit" className={answerCallPanelRightText}><span>玩家:</span><span className={answerCallPanelRightTextValue}>{clientName}</span></Typography>
						<Typography color="inherit" className={answerCallPanelRightText}><span>餘額:</span><span className={answerCallPanelRightTextValue}>{isObject(currentTable) && currentTable.account ? `$${formatAmount(currentTable.account)}` : '-'}</span></Typography>
						<Typography color="inherit" className={answerCallPanelRightText}><span>桌號:</span><span className={answerCallPanelRightTextValue}>{vid ? vid : '-'}</span></Typography>
					</CardContent>
				</Card>
			</div>
			<div>
				<Button variant="contained" size="medium" color="inherit" className={clientMuteButtonClass} onClick={() => { toggleMuteChannel(currentChannelId, false, clientMute === MUTE ? UNMUTE : MUTE) }}><VolumeUpIcon className={icon}/>玩家靜音</Button>
				<Button variant="contained" size="medium" color="inherit" className={anchorMuteButtonClass} onClick={() => { toggleMuteChannel(currentChannelId, true, anchorMute === MUTE ? UNMUTE : MUTE) }}><VolumeUpIcon className={icon}/>主播靜音</Button>
				<Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { leaveChannel(currentChannelId) }}><CallEndIcon className={icon} />掛斷</Button>
				<Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { setOpenAssignTableDialog(true) }}>配對</Button>
				<Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { setOpenKickoutClientDialog(true) }}>踢走玩家</Button>
				<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, blacklistButton)} onClick={() => { setOpenBlacklistDialog(true) }}>列入黑名單</Button>
			</div>
			{ /** Assign Table Dialog*/ }
			<Dialog
				open={openAssignTableDialog}
				onClose={() => { setOpenAssignTableDialog(false)}}
				aria-labelledby="responsive-dialog-title"
				classes={{ paper: dialogPaper }}
			>
				<DialogTitle id="responsive-dialog-title">
					<Typography color="inherit" className={dialogTitle}>選擇桌台</Typography>
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
							<ToggleButton value={table.vid} disabled={table.status !== DATA_SERVER_VIDEO_STATUS.FREE}>
								<Typography color="inherit">{table.vid}</Typography>
							</ToggleButton>
        		)}
						</ToggleButtonGroup>
					</DialogContentText>
				</DialogContent>
				<DialogActions classes={{ root: dialogActionsRoot }}>
					<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { assignTable(tableAssigned, clientName); setOpenAssignTableDialog(false); }}>確定</Button>
					<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { setOpenAssignTableDialog(false) }}>取消</Button>
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
					<DialogContentText><Typography color="inherit" className={dialogContent}>要把{clientName}踢出桌台嗎?</Typography></DialogContentText>
				</DialogContent>
				<DialogActions classes={{ root: dialogActionsRootNoBorder }}>
					<Button 
						variant="contained"
						size="medium"
						color="inherit"
						className={classNames(actionButton, dialogActionButton)}
						onClick={() => {
							setManagerAction(MANAGER_ACTION_TYPE.KICKOUT_CLIENT);

							if (!tableAssigned) {
								kickoutClient(currentChannelId);
							} else {
								kickoutClientFromDataServer(tableAssigned, clientName);
							}

							setOpenKickoutClientDialog(false);
						}}
					>
						確定
					</Button>
					<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { setOpenKickoutClientDialog(false) }}>取消</Button>
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
					<DialogContentText><Typography color="inherit" className={dialogContent}>要把{clientName}列入黑名單嗎?</Typography></DialogContentText>
				</DialogContent>
				<DialogActions classes={{ root: dialogActionsRootNoBorder }}>
					<Button 
						variant="contained"
						size="medium"
						color="inherit"
						className={classNames(actionButton, dialogActionButton)}
						onClick={() => {
							setManagerAction(MANAGER_ACTION_TYPE.BLACKLIST_CLIENT);

							if (!tableAssigned) {
								blacklistClient(currentChannelId);
							} else {
								kickoutClientFromDataServer(tableAssigned, clientName);
							}

							setOpenBlacklistDialog(false);
						}}>
							確定
						</Button>
					<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { setOpenBlacklistDialog(false) }}>取消</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

AnswerCallPanel.prototype = {
	classes: PropTypes.object.isRequired,
	currentChannelId: PropTypes.number,
	channelList: PropTypes.array, 
	isAnchorCall: PropTypes.bool, 
	leaveChannel: PropTypes.func, 
	assignTableToChannel: PropTypes.func, 
	toggleMuteChannel: PropTypes.func, 
	kickoutClient: PropTypes.func, 
	blacklistClient: PropTypes.func
};

const TelebetList = props => {	
	const { 
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
		kickDelegator
	} = props;
	const { separator, tile } = classes;

	const telebetListClasses = classNames.bind(classes);
	const classList = telebetListClasses({
		root: true,
		pageBorder: isAnswerCall
	});

	// TODO: remove testing data
	channelList[3].clientName = 'TSThk456';
	channelList[3].clientState = 2;
	channelList[4].clientName = 'TSThk457';
	channelList[4].clientState = 2;
	channelList[4].anchorName = 'alice';
	channelList[4].anchorState = 1;
	channelList[4].vid = 'V010';
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
				<TelebetTile joinChannel={joinChannel} tableList={tableList} />
			</GridListBase>
		);
	}

	return (
		<div className={classList}>
			{ panel }
			<div className={separator} />
			<WaitingUser waitingList={waitingList} assignTokenToDelegator={assignTokenToDelegator} kickDelegator={kickDelegator} />
		</div>
	);
}

TelebetList.prototype = {
	classes: PropTypes.object.isRequired,
	channelList: PropTypes.array,
	joinChannel: PropTypes.func,
	leaveChannel: PropTypes.func,
	assignTableToChannel: PropTypes.func,
	isAnswerCall: PropTypes.bool,
	isAnchorCall: PropTypes.bool,
	currentChannelId: PropTypes.number,
	toggleMuteChannel: PropTypes.func,
	kickoutClient: PropTypes.func,
	blacklistClient: PropTypes.func,
	waitingList: PropTypes.func
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
  toggleToast: toggle => dispatch(toggleToast(toggle))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledTelebetList);