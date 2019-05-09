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
import { USER_STATE, CALLING_MANAGER_STATES } from '../constants';
import { formatAmount, isObject } from '../helpers/utils';
import { getLangConfig } from '../helpers/appUtils';

const styles = {
	cardBase: {
		minHeight: '200px'
	},
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

const joinRoom = (channelId, joinChannel, isAnchor, setIsAnchorCall, setIncomingCallCount, incomingCallCount) => {
	setIsAnchorCall(isAnchor);
	joinChannel(channelId);
	setIncomingCallCount(incomingCallCount - 1)
};

const EmptyCard = ({classes}) => {
	const { cardBase, emptyCard } = classes;

	return (
    <Card className={classNames(cardBase, emptyCard)} />
	);
};

EmptyCard.propTypes = {
	classes: PropTypes.object.isRequired
};

const DisabledCard = ({ classes, item, role, roleName, voiceAppId, currentTable }) => {
	const { cardBase, disabledCard, cardContent, cardContentText, client, cardActionButton } = classes;
	const langConfig = getLangConfig();

	return (
    <Card className={classNames(cardBase, disabledCard)}>
      <CardContent className={cardContent}>
				<Typography color="inherit" className={classNames(cardContentText)}>{role} <span className={client}>{roleName}</span> {langConfig.TELEBET_TILE_LABEL.CONNECTED}</Typography>
				<Typography color="inherit" className={cardContentText}>{isObject(currentTable) && currentTable.account ? `$${formatAmount(currentTable.account)}` : '-'}</Typography>
      </CardContent>
      <CardActions>
	    <Button variant="contained" size="medium" color="inherit" className={cardActionButton} disabled>{langConfig.BUTTON_LABEL.JOIN_CHANNEL}</Button>
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
	currentTable: PropTypes.object
};

const CallInfoCard = ({ classes, item, setIsAnchorCall, isAnchor, role, roleName, cardClass, roleClass, joinChannel, currentTable, setIncomingCallCount, incomingCallCount, isConnecting, currentManagerName }) => {	
	const { cardBase, cardContent, cardContentText, client, cardActionButton } = classes;
	const { channelId, anchorState, managerName } = item;	
	const { CHANGE_ANCHOR, CHANGE_DEALER, CHANGE_TABLE, ANNOYING, ADVERTISEMENT } = USER_STATE;	
	const langConfig = getLangConfig();
	let anchorStateText = '';
	switch(anchorState) {
		case CHANGE_ANCHOR:
			anchorStateText = langConfig.TELEBET_TILE_LABEL.ANCHOR_STATE_ACTIONS.CHANGE_ANCHOR;
		break;

		case CHANGE_DEALER:
			anchorStateText = langConfig.TELEBET_TILE_LABEL.ANCHOR_STATE_ACTIONS.CHANGE_DEALER;
		break;

		case CHANGE_TABLE:
			anchorStateText = langConfig.TELEBET_TILE_LABEL.ANCHOR_STATE_ACTIONS.CHANGE_TABLE;
		break;

		case ANNOYING:
			anchorStateText = langConfig.TELEBET_TILE_LABEL.ANCHOR_STATE_ACTIONS.ANNOYING;
		break;

		case ADVERTISEMENT:
			anchorStateText = langConfig.TELEBET_TILE_LABEL.ANCHOR_STATE_ACTIONS.ADVERTISEMENT;
		break;

		default:
		break;
	}

	return (
    <Card className={classNames(cardBase, classes[cardClass])}>
      <CardContent className={cardContent}>
				<Typography color="inherit" className={classNames(cardContentText, classes[roleClass])}>{role} <span className={client}>{roleName}</span> {isConnecting ? langConfig.TELEBET_TILE_LABEL.CONNECTING : langConfig.TELEBET_TILE_LABEL.CONNECTED}</Typography>
				{ isAnchor && anchorStateText ? (
					<Typography color="inherit" className={cardContentText}>{langConfig.TELEBET_TILE_LABEL.REASON}: {anchorStateText}</Typography>
				) : null }
				<Typography color="inherit" className={cardContentText}>{isObject(currentTable) && currentTable.account ? `$${formatAmount(currentTable.account)}` : '-'}</Typography>
      </CardContent>
      <CardActions>
      	<Button variant="contained" size="medium" color="inherit" className={cardActionButton} disabled={managerName && managerName !== currentManagerName} onClick={() => { joinRoom(channelId, joinChannel, isAnchor, setIsAnchorCall, setIncomingCallCount, incomingCallCount) }}>{langConfig.BUTTON_LABEL.JOIN_CHANNEL}</Button>
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
	currentTable: PropTypes.object
};

const FullChatroomCard = ({ classes, item, setIsAnchorCall, cardClass, joinChannel, isManagerReconnect, currentTable, setIncomingCallCount, incomingCallCount }) => {
	const { cardBase, cardContent, cardContentText, client, cardActionButton } = classes;
	const { clientName, anchorName, channelId, managerName } = item;
	const langConfig = getLangConfig();

	return (
    <Card className={classNames(cardBase, classes[cardClass])}>
      <CardContent className={cardContent}>
				<Typography color="inherit" className={cardContentText}>{langConfig.TELEBET_TILE_LABEL.ANCHOR}<span className={client}>{anchorName}</span></Typography>
				<Typography color="inherit" className={cardContentText}>{langConfig.TELEBET_TILE_LABEL.PLAYER}<span className={client}>{clientName}</span>{langConfig.TELEBET_TILE_LABEL.PLAYING}</Typography>
				<Typography color="inherit" className={cardContentText}>{isObject(currentTable) && currentTable.account ? `$${formatAmount(currentTable.account)}` : '-'}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { joinRoom(channelId, joinChannel, true, setIsAnchorCall, setIncomingCallCount, incomingCallCount) }} disabled={managerName && !isManagerReconnect ? true : false}>{langConfig.BUTTON_LABEL.JOIN_CHANNEL_2.replace("{name}", managerName)}</Button>
      </CardActions>
    </Card>
	);
};

FullChatroomCard.propTypes = {
	classes: PropTypes.object.isRequired,
	item: PropTypes.object,
	setIsAnchorCall: PropTypes.func,
	cardClass: PropTypes.string,
	joinChannel: PropTypes.func,
	isManagerReconnect: PropTypes.bool,
	currentTable: PropTypes.object
};

const TelebetTile = ({
	classes,
	voiceAppId,
	setIsAnchorCall,
	item,
	joinChannel,
	managerCredential,
	tableList,
	setIncomingCallCount,
	incomingCallCount
}) => {	
	const { anchorName, clientName, managerName, anchorState, clientState, vid } = item;	
	const { CONNECTED, CONNECTING } = USER_STATE;
	const currentManagerName = isObject(managerCredential) ? managerCredential.managerLoginname: '';	
	const currentTable = vid ? tableList.find(table => table.vid === vid) : null;

	const isCallingManager = CALLING_MANAGER_STATES.findIndex(state => state === anchorState) !== -1;
	const isManagerReconnect = managerName === currentManagerName ? true : false;

	const clientConnecting = clientName && !anchorName && clientState === CONNECTING;
	const anchorConnecting = clientName && anchorName && isCallingManager && anchorState === CONNECTING;
	const clientDealIn = clientName && !anchorName && clientState === CONNECTED;
	const anchorDealIn = clientName && anchorName && isCallingManager;
	const clientAnchorPlaying = clientName && (clientState === CONNECTED || clientState === CONNECTING) && anchorName && (anchorState === CONNECTED || anchorState === CONNECTING);
	const nobodyDealIn = !clientName && !anchorName && !managerName;
	// const fullDesk = clientName && (anchorName || managerName) && clientState === CONNECTED && (anchorState === CONNECTED || managerState === CONNECTED);

	const langConfig = getLangConfig();

	let role;
	let roleClass;
	let roleName;
	let cardClass;
	let panel;

	if (clientDealIn || clientConnecting) {
		cardClass = 'card';
		roleClass = 'player';
		role = langConfig.TELEBET_TILE_LABEL.PLAYER;
		roleName = clientName;
	}

	if (anchorDealIn || anchorConnecting) {
		cardClass = 'anchorCard';
		roleClass = 'anchor';
		role = langConfig.TELEBET_TILE_LABEL.ANCHOR;
		roleName = `${anchorName} ${vid}`;
	}

	if (clientAnchorPlaying) {
		cardClass = 'playingCard';
	}
		console.log(item)

	if (nobodyDealIn) {
		cardClass = 'emptyCard';
		panel = <EmptyCard classes={classes} />;
	} else if (clientDealIn || anchorDealIn) {
		if (managerName && !isManagerReconnect) {			
			cardClass = 'disabledCard';
			panel = (
				<DisabledCard
					classes={classes}
					item={item}
					role={role}
					roleName={roleName}
					voiceAppId={voiceAppId}
					currentTable={currentTable}
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
					currentTable={currentTable}
					setIncomingCallCount={setIncomingCallCount}
					incomingCallCount={incomingCallCount}
					isConnecting={false}
					currentManagerName={currentManagerName}
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
				isManagerReconnect={isManagerReconnect}
				currentTable={currentTable}
				setIncomingCallCount={setIncomingCallCount}
				incomingCallCount={incomingCallCount}
			/>
		);
	} else if (clientConnecting || anchorConnecting) {		
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
				currentTable={currentTable}
				setIncomingCallCount={setIncomingCallCount}
				incomingCallCount={incomingCallCount}
				isConnecting={true}
				currentManagerName={currentManagerName}
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
	managerCredential: PropTypes.object,
	tableList: PropTypes.array,
	setIncomingCallCount: PropTypes.func,
	incomingCallCount: PropTypes.number
};

const StyledTelebetTile = withStyles(styles)(TelebetTile);

const mapStateToProps = state => {
	const { voiceAppId, incomingCallCount } = state.voice;
	const { managerCredential } = state.app;
	
  return ({
		voiceAppId,
		managerCredential,
		incomingCallCount
  });
};

const mapDispatchToProps = dispatch => ({
  setIsAnchorCall: isAnchor => dispatch(setIsAnchorCall(isAnchor)) 
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledTelebetTile);