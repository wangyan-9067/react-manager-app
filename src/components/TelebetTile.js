import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { setIsAnchorCall } from '../actions/voice';
import { USER_STATE } from '../constants';
import { formatAmount, isObject, getAnonymousName } from '../helpers/utils';

const styles = {
	emptyCard: {
		borderRadius: '16px',
		border: '3px solid #F5F5F5',
		padding: '30px',
		backgroundColor: '#F5F5F5'
	},
	disabledCard: {
		borderRadius: '16px',
		border: '3px solid #DDDDDD',
		padding: '30px',
		backgroundColor: '#DDDDDD'
	},
	card: {
		borderRadius: '16px',
		border: '3px solid #FD0100',
		padding: '30px 10px',
		backgroundColor: '#F5F5F5'
	},
	anchorCard: {
		borderRadius: '16px',
		border: '3px solid #3970B0',
		padding: '30px 10px',
		backgroundColor: '#F5F5F5'
	},
	playingCard: {
		borderRadius: '16px',
		border: '3px solid #F5F5F5',
		padding: '30px 10px',
		backgroundColor: '#F5F5F5'
	},
	cardContent: {
		color: '#818181'
	},
	cardActionButton: {
		margin: '0 auto',
		padding: '3px 40px',
		borderRadius: '60px',
		fontSize: '20px',
		fontWeight: 'bold',
		color: '#FFFFFF',
		backgroundColor: '#3970B0',
    '&:hover': {
      backgroundColor: '#3970B0',
      borderColor: '#3970B0',
    }
	},
	cardContentText: {
		fontSize: '24px'
	},
	client: {
		fontWeight: 'bold',
	},
	player: {
		color: '#FD0100'
	},
	anchor: {
		color: '#3970B0'
	}
};

const joinRoom = (channelId, joinChannel, isAnchor, setIsAnchorCall) => {
	setIsAnchorCall(isAnchor);
	joinChannel(channelId);
};

const leaveRoom = (channelId, leaveChannel) => {
	leaveChannel(channelId);
};

const assignTable = (channelId, assignTableToChannel) => {
	assignTableToChannel(channelId, 'V01');
}

const EmptyCard = ({classes}) => {
	return (
    <Card className={classes.emptyCard} />
	);
};

EmptyCard.propTypes = {
	classes: PropTypes.object.isRequired
};

const DisabledCard = ({ classes, item, role, roleName, voiceAppId, leaveChannel, assignTableToChannel }) => {
	const { disabledCard, cardContent, cardContentText, client, cardActionButton } = classes;
	const { clientBalance, channelId } = item;

	return (
    <Card className={disabledCard}>
      <CardContent className={cardContent}>
				<Typography color="inherit" className={classNames(cardContentText)}>{role} <span className={client}>{roleName}</span> 接入中</Typography>
				<Typography color="inherit" className={cardContentText}>${formatAmount(clientBalance)}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} disabled>接聽</Button>
      </CardActions>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { leaveRoom(channelId, leaveChannel) }}>離開</Button>
      </CardActions>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { assignTable(channelId, assignTableToChannel) }}>配對</Button>
      </CardActions>
    </Card>
	);
};

DisabledCard.propTypes = {
	classes: PropTypes.object.isRequired,
	item: PropTypes.object,
	role: PropTypes.string,
	roleName: PropTypes.string,
	voiceAppId: PropTypes.string,
	leaveChannel: PropTypes.func,
	assignTableToChannel: PropTypes.func
};

const CallInfoCard = ({ classes, item, setIsAnchorCall, isAnchor, role, roleName, cardClass, roleClass, joinChannel, leaveChannel, assignTableToChannel }) => {
	const { cardContent, cardContentText, client, cardActionButton } = classes;
	const { clientBalance, channelId, anchorState } = item;
	const { CHANGE_ANCHOR, CHANGE_DEALER, CHANGE_TABLE, ANNOYING, ADVERTISEMENT } = USER_STATE;
	let anchorStateText = '';

	switch(anchorState) {
		case CHANGE_ANCHOR:
			anchorStateText = '更換主播';
		break;

		case CHANGE_DEALER:
			anchorStateText = '更換荷官';
		break;

		case CHANGE_TABLE:
			anchorStateText = '更換桌枱';
		break;

		case ANNOYING:
			anchorStateText = '騷擾';
		break;

		case ADVERTISEMENT:
			anchorStateText = '賣廣告';
		break;

		default:
		break;
	}

	return (
    <Card className={classes[cardClass]}>
      <CardContent className={cardContent}>
				<Typography color="inherit" className={classNames(cardContentText, classes[roleClass])}>{role} <span className={client}>{roleName}</span> 接入中</Typography>
				{ isAnchor && anchorStateText ? (
					<Typography color="inherit" className={cardContentText}>理由: {anchorStateText}</Typography>
				) : null }
				<Typography color="inherit" className={cardContentText}>${formatAmount(clientBalance)}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { joinRoom(channelId, joinChannel, isAnchor, setIsAnchorCall) }}>接聽</Button>
      </CardActions>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { leaveRoom(channelId, leaveChannel) }}>離開</Button>
      </CardActions>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { assignTable(channelId, assignTableToChannel) }}>配對</Button>
      </CardActions>
    </Card>
	);
};

CallInfoCard.propTypes = {
	classes: PropTypes.object.isRequired,
	item: PropTypes.object,
	setIsAnchorCall: PropTypes.func,
	isAnchor: PropTypes.bool,
	role: PropTypes.string,
	roleName: PropTypes.string,
	cardClass: PropTypes.string,
	roleClass: PropTypes.string,
	joinChannel: PropTypes.func,
	leaveChannel: PropTypes.func,
	assignTableToChannel: PropTypes.func
};

const FullChatroomCard = ({ classes, item, setIsAnchorCall, cardClass, joinChannel, leaveChannel, assignTableToChannel, isManagerReconnect }) => {
	const { cardContent, cardContentText, client, cardActionButton } = classes;
	const { clientName, anchorName, clientBalance, channelId, managerName } = item;
	const maskedClientName = getAnonymousName(clientName);

	return (
    <Card className={classes[cardClass]}>
      <CardContent className={cardContent}>
				<Typography color="inherit" className={cardContentText}>主播<span className={client}>{anchorName}</span></Typography>
				<Typography color="inherit" className={cardContentText}>玩家<span className={client}>{maskedClientName}</span>遊戲中</Typography>
				<Typography color="inherit" className={cardContentText}>${formatAmount(clientBalance)}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { joinRoom(channelId, joinChannel, true, setIsAnchorCall) }} disabled={managerName && !isManagerReconnect}>接聽</Button>
      </CardActions>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { leaveRoom(channelId, leaveChannel) }}>離開</Button>
      </CardActions>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { assignTable(channelId, assignTableToChannel) }}>配對</Button>
      </CardActions>
    </Card>
	);
};

FullChatroomCard.propTypes = {
	classes: PropTypes.object.isRequired
};

const TelebetTile = props => {
	const { classes, voiceAppId, setIsAnchorCall, item, joinChannel, leaveChannel, assignTableToChannel, managerCredential } = props;
	const { anchorName, clientName, managerName, anchorState, clientState, vid } = item;
	const { WAITING_MANAGER, CHANGE_ANCHOR, CHANGE_DEALER, CHANGE_TABLE, ANNOYING, ADVERTISEMENT, CONNECTED, CONNECTING } = USER_STATE;
	const currentManagerName = isObject(managerCredential) ? managerCredential.managerLoginname: '';

	const CALLING_MANAGER_STATES = [WAITING_MANAGER, CHANGE_ANCHOR, CHANGE_DEALER, CHANGE_TABLE, ANNOYING, ADVERTISEMENT];
	const isCallingManager = CALLING_MANAGER_STATES.findIndex(state => state === anchorState) !== -1;
	const isManagerReconnect = managerName === currentManagerName;
	const maskedClientName = getAnonymousName(clientName);

	const clientDealIn = clientName && !anchorName && clientState === CONNECTED;
	const anchorDealIn = clientName && anchorName && isCallingManager;
	const clientAnchorPlaying = clientName && (clientState === CONNECTED || clientState === CONNECTING) && anchorName && (anchorState === CONNECTED || anchorState === CONNECTING);
	const nobodyDealIn = !clientName && !anchorName && !managerName;
	// const fullDesk = clientName && (anchorName || managerName) && clientState === CONNECTED && (anchorState === CONNECTED || managerState === CONNECTED);

	let role;
	let roleClass;
	let roleName;
	let cardClass;
	let panel;

	if (clientDealIn) {
		cardClass = 'card';
		roleClass = 'player';
		role = '玩家';
		roleName = maskedClientName;
	}

	if (anchorDealIn) {
		cardClass = 'anchorCard';
		roleClass = 'anchor';
		role = '主播';
		roleName = `${anchorName} ${vid}`;
	}

	if (clientAnchorPlaying) {
		cardClass = 'playingCard';
	}

	if (nobodyDealIn) {
		cardClass = 'emptyCard';
		panel = <EmptyCard classes={classes} />;
	} else if (clientDealIn || anchorDealIn) {
		// TODO: 需要handle經理斷線
		if (managerName && !isManagerReconnect) {
			cardClass = 'disabledCard';
			panel = (
				<DisabledCard
					classes={classes}
					item={item}
					role={role}
					roleName={roleName}
					voiceAppId={voiceAppId}
					leaveChannel={leaveChannel}
					assignTableToChannel={assignTableToChannel}
				/>
			);
		} else {
			panel = (
				<CallInfoCard 
					classes={classes}
					item={item}
					setIsAnchorCall={setIsAnchorCall}
					isAnchor={anchorDealIn}
					role={role}
					roleName={roleName}
					cardClass={cardClass}
					roleClass={roleClass}
					joinChannel={joinChannel}
					leaveChannel={leaveChannel}
					assignTableToChannel={assignTableToChannel}
				/>
			);
		}
	} else if (clientAnchorPlaying) {
		panel = (
			<FullChatroomCard 
				classes={classes}
				item={item}
				setIsAnchorCall={setIsAnchorCall}
				cardClass={cardClass}
				joinChannel={joinChannel}
				leaveChannel={leaveChannel}
				assignTableToChannel={assignTableToChannel}
				isManagerReconnect={isManagerReconnect}
			/>
		);
	}

	return (
		<div>{panel}</div>
	);
}

TelebetTile.propTypes = {
	classes: PropTypes.object.isRequired,
	voiceAppId: PropTypes.string, 
	setIsAnchorCall: PropTypes.func, 
	item: PropTypes.object, 
	joinChannel: PropTypes.func, 
	leaveChannel: PropTypes.func, 
	assignTableToChannel: PropTypes.func
};

const StyledTelebetTile = withStyles(styles)(TelebetTile);

const mapStateToProps = state => {
	const { voiceAppId } = state.voice;
	const { managerCredential } = state.app;
	
  return ({
		voiceAppId,
		managerCredential
  });
};

const mapDispatchToProps = dispatch => ({
  setIsAnchorCall: isAnchor => dispatch(setIsAnchorCall(isAnchor)) 
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledTelebetTile);