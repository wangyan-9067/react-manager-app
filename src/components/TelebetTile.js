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
import { formatAmount } from '../utils';

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

const DisabledCard = ({classes, item, role, roleName, voiceAppId, leaveChannel, assignTableToChannel}) => {
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

const CallInfoCard = ({classes, item, setIsAnchorCall, isAnchor, role, roleName, cardClass, roleClass, joinChannel, leaveChannel, assignTableToChannel}) => {
	const { cardContent, cardContentText, client, cardActionButton } = classes;
	const { clientBalance, channelId } = item;

	return (
    <Card className={classes[cardClass]}>
      <CardContent className={cardContent}>
				<Typography color="inherit" className={classNames(cardContentText, classes[roleClass])}>{role} <span className={client}>{roleName}</span> 接入中</Typography>
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

const TelebetTile = props => {
	const { classes, voiceAppId, setIsAnchorCall, item, joinChannel, leaveChannel, assignTableToChannel } = props;
	const { anchorName, clientName, managerName, anchorState, clientState, vid } = item;
	const { WAITING_MANAGER, CONNECTED } = USER_STATE;

	const clientDealIn = clientName && !anchorName && clientState === CONNECTED;
	const anchorDealIn = clientName && anchorName && anchorState === WAITING_MANAGER;
	const nobodyDealIn = !clientName && !anchorName && !managerName;
	// const fullDesk = clientName && (anchorName || managerName) && clientState === CONNECTED && (anchorState === CONNECTED || managerState === CONNECTED);

	// TODO cases:
	// 1) 玩家主播遊戲中
	// 2) 經理斷線重連

	let role;
	let roleClass;
	let roleName;
	let cardClass;
	let panel;

	if (clientDealIn) {
		cardClass = 'card';
		roleClass = 'player';
		role = '玩家';
		roleName = clientName;
	}

	if (anchorDealIn) {
		cardClass = 'anchorCard';
		roleClass = 'anchor';
		role = '主播';
		roleName = `${anchorName} ${vid}`;
	}

	if (nobodyDealIn) {
		panel = <EmptyCard classes={classes} />;
	} else if (clientDealIn || anchorDealIn) {
		if (managerName) {
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
	}

	return (
		<div>{panel}</div>
	);
}

TelebetTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

const StyledTelebetTile = withStyles(styles)(TelebetTile);

const mapStateToProps = state => {
	const { voiceAppId } = state.voice;
	
  return ({
		voiceAppId
  });
};

const mapDispatchToProps = dispatch => ({
  setIsAnchorCall: isAnchor => dispatch(setIsAnchorCall(isAnchor))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledTelebetTile);