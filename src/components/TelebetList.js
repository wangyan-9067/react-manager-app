import React, { Fragment, useState } from 'react';
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

import GridListBase from './GridListBase';
// import TableUser from './TableUser';
import TelebetTile from './TelebetTile';
import WaitingUser from './WaitingUser';
import { MUTE_STATE } from '../constants';
import { formatAmount } from '../utils';

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
		backgroundColor: '#F5F5F5',
		borderRadius: '16px',
		minHeight: '200px'
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

const AnswerCallPanel = ({classes, currentChannelId, channelList, isAnchorCall, leaveChannel, assignTableToChannel, toggleMuteChannel, kickoutClient, blacklistClient}) => {
	const [openAssignTableDialog, setOpenAssignTableDialog] = useState(false);
	const [tableAssigned, setTableAssigned] = useState('V1');
	const [openKickoutClientDialog, setOpenKickoutClientDialog] = useState(false);
	const [openBlacklistDialog, setOpenBlacklistDialog] = useState(false);

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
	const { vid, clientName, anchorName, clientBalance, clientMute, anchorMute } = currentChannel;

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
						<Typography color="inherit" className={answerCallPanelRightText}><span>餘額:</span><span className={answerCallPanelRightTextValue}>{formatAmount(clientBalance)}</span></Typography>
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
							<ToggleButton value="V1">
								<Typography color="inherit">V1</Typography>
							</ToggleButton>
							<ToggleButton value="V2">
								<Typography color="inherit">V2</Typography>
							</ToggleButton>
						</ToggleButtonGroup>
					</DialogContentText>
				</DialogContent>
				<DialogActions classes={{ root: dialogActionsRoot }}>
					<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { assignTableToChannel(currentChannelId, tableAssigned); setOpenAssignTableDialog(false); }}>確定</Button>
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
					<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { kickoutClient(currentChannelId); setOpenKickoutClientDialog(false); }}>確定</Button>
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
					<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { blacklistClient(currentChannelId); setOpenBlacklistDialog(false); }}>確定</Button>
					<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, dialogActionButton)} onClick={() => { setOpenBlacklistDialog(false) }}>取消</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

const TelebetList = props => {	
	const { 
		classes,
		channelList,
		joinChannel,
		leaveChannel,
		assignTableToChannel,
		isAnswerCall,
		isAnchorCall,
		currentChannelId,
		toggleMuteChannel,
		kickoutClient,
		blacklistClient,
		waitingList
	} = props;
	const { separator } = classes;

	const telebetListClasses = classNames.bind(classes);
	const classList = telebetListClasses({
		root: true,
		pageBorder: isAnswerCall
	});

	// channelList[0].clientName = 'hk345';
	// channelList[0].clientState = 2;
	// channelList[1].clientName = 'hk789';
	// channelList[1].anchorName = 'joyce';
	// channelList[1].anchorState = 3;
	// channelList[1].vid = 'V02';
	// channelList[2].clientName = 'hk111';
	// channelList[2].managerName = 'alice';
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
				assignTableToChannel={assignTableToChannel}
				toggleMuteChannel={toggleMuteChannel}
				kickoutClient={kickoutClient}
				blacklistClient={blacklistClient}
			/>
		);
	} else {
		panel = (
			<GridListBase list={channelList} tileClass={classes.tile}>
				<TelebetTile joinChannel={joinChannel} leaveChannel={leaveChannel} assignTableToChannel={assignTableToChannel} />
			</GridListBase>
		);
	}

	return (
		<div className={classList}>
			{ panel }
			<div className={separator} />
			<WaitingUser waitingList={waitingList} />
		</div>
	);
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
	
  return ({
		voiceAppId,
		channelList,
		currentChannelId,
		isAnswerCall,
		isAnchorCall,
		waitingList
  });
};

export default connect(mapStateToProps, null)(StyledTelebetList);