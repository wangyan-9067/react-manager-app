import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import CallEndIcon from '@material-ui/icons/CallEnd';

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
    margin: '0 10px',
    padding: '3px 40px',
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
	blacklistButton: {
		backgroundColor: '#4A4B4F',
    '&:hover': {
      backgroundColor: '#4A4B4F',
      borderColor: '#4A4B4F',
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
  }
});

const toggleMuteRoom = (channelId, toggleMuteChannel, isAnchor, isMute) => {
	toggleMuteChannel(channelId, isAnchor, isMute);
}

const leaveRoom = (channelId, leaveChannel) => {
	leaveChannel(channelId);
};

const assignTable = (channelId, assignTableToChannel) => {
	assignTableToChannel(channelId, 'V01');
}

const AnswerCallPanel = ({classes, currentChannelId, channelList, isAnchorCall, leaveChannel, assignTableToChannel, toggleMuteChannel}) => {
	const { 
		answerCallPanel, 
		answerCallPanelLeftRoot, 
		answerCallPanelLeft, 
		answerCallPanelLeftText, 
		answerCallPanelRightRoot, 
		answerCallPanelRight, 
		answerCallPanelRightText,
		answerCallPanelRightTextValue,
		actionButton,
		blacklistButton,
		icon
	} = classes;
	const { MUTE, UNMUTE } = MUTE_STATE;
	const currentChannel = channelList.find(channel => channel.channelId === currentChannelId);
	const { vid, clientName, anchorName, clientBalance, clientMute, anchorMute } = currentChannel;

	let line1Text;
	let line2Text;
	let currentMuteStatus;

	if (isAnchorCall) {
		line1Text = `與${vid}`;
		line2Text = `玩家${clientName} 主播${anchorName}`;
		currentMuteStatus = anchorMute;
	} else {
		line1Text = '與玩家';
		line2Text = clientName;
		currentMuteStatus = clientMute;
	}

	return (
		<Fragment>
			<div className={answerCallPanel}>
				<Card classes={{ root: answerCallPanelLeftRoot }}>
					<CardContent className={answerCallPanelLeft}>
						<Typography color="inherit" className={answerCallPanelLeftText}>{line1Text}</Typography>
						<Typography color="inherit" className={answerCallPanelLeftText}>{line2Text}</Typography>
						<Typography color="inherit" className={answerCallPanelLeftText}>通訊中...</Typography>
					</CardContent>
				</Card>
				<Card classes={{ root: answerCallPanelRightRoot }}>
					<CardContent className={answerCallPanelRight}>
						<Typography color="inherit" className={answerCallPanelRightText}><span>玩家:</span><span className={answerCallPanelRightTextValue}>{clientName}</span></Typography>
						<Typography color="inherit" className={answerCallPanelRightText}><span>餘額:</span><span className={answerCallPanelRightTextValue}>{formatAmount(clientBalance)}</span></Typography>
						<Typography color="inherit" className={answerCallPanelRightText}><span>桌號:</span><span className={answerCallPanelRightTextValue}>{vid ? vid : '-'}</span></Typography>
						<Typography color="inherit" className={answerCallPanelRightText}><span>備註:</span><span className={answerCallPanelRightTextValue}></span></Typography>
					</CardContent>
				</Card>
			</div>
			<div>
				<Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { toggleMuteRoom(currentChannelId, toggleMuteChannel, isAnchorCall, currentMuteStatus === MUTE ? UNMUTE : MUTE) }}><VolumeUpIcon className={icon}/>玩家靜音</Button>
				<Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { leaveRoom(currentChannelId, leaveChannel) }}><CallEndIcon className={icon} />掛斷</Button>
				<Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { assignTable(currentChannelId, assignTableToChannel) }}>配對</Button>
				<Button variant="contained" size="medium" color="inherit" className={actionButton}>備註</Button>
				<Button variant="contained" size="medium" color="inherit" className={classNames(actionButton, blacklistButton)}>列入黑名單</Button>
			</div>
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
		toggleMuteChannel
	} = props;
	const { separator } = classes;

	const telebetListClasses = classNames.bind(classes);
	const classList = telebetListClasses({
		root: true,
		pageBorder: isAnswerCall
	});

	channelList[0].clientName = 'hk345';
	channelList[0].clientState = 2;
	channelList[1].clientName = 'hk789';
	channelList[1].anchorName = 'joyce';
	channelList[1].anchorState = 3;
	channelList[1].vid = 'V02';
	channelList[2].clientName = 'hk111';
	channelList[2].managerName = 'alice';
	channelList[2].clientState = 2;

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
			<WaitingUser />
		</div>
	);
}

const StyledTelebetList = withStyles(styles)(TelebetList);

const mapStateToProps = state => {
	const { voiceAppId, channelList, currentChannelId, isAnswerCall, isAnchorCall } = state.voice;
	
  return ({
		voiceAppId,
		channelList,
		currentChannelId,
		isAnswerCall,
		isAnchorCall
  });
};

export default connect(mapStateToProps, null)(StyledTelebetList);