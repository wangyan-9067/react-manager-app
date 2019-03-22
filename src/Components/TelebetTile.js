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

import * as RTC from 'cube-rtc';
import { USER_STATE } from '../constants';
import { formatAmount } from '../utils';

const styles = {
	emptyCardRoot: {
		top: 0,
    left: 0,
    width: '100%',
    height: '100%'
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
		padding: '30px',
		backgroundColor: '#F5F5F5'
	},
	cardContent: {
		color: '#818181'
	},
	cardActionButton: {
		margin: '0 auto',
		padding: '3px 40px',
		borderRadius: '10px',
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

const joinRoom = (channelId, voiceAppId) => {
	console.log("joinRoom", channelId, voiceAppId);
	RTC.joinRoom(channelId.toString(), voiceAppId);
};

const assignAnchor = (channelId, anchor, sendAssignAnchorCMD) => {
	console.log("assignAnchor", channelId, anchor, );
	sendAssignAnchorCMD(channelId.toString(), anchor);
};

const EmptyCard = ({classes}) => {
	return (
    <Card className={classes.emptyCard}></Card>
	);
};

const DisabledCard = ({classes, item, role}) => {
	const { disabledCard, cardContent, cardContentText, client, cardActionButton } = classes;
	const { clientName, clientBalance } = item;

	return (
    <Card className={disabledCard}>
      <CardContent className={cardContent}>
				<Typography color="inherit" className={classNames(cardContentText)}>{role} <span className={client}>{clientName}</span> 接入中</Typography>
				<Typography color="inherit" className={cardContentText}>${formatAmount(clientBalance)}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} disabled>接聽</Button>
      </CardActions>
    </Card>
	);
};

const CallInfoCard = ({classes, item, role, roleClass, voiceAppId, sendAssignAnchorCMD}) => {
	const { card, cardContent, cardContentText, client, cardActionButton } = classes;
	const { clientName, clientBalance, channelId } = item;

	return (
    <Card className={card}>
      <CardContent className={cardContent}>
				<Typography color="inherit" className={classNames(cardContentText, roleClass)}>{role} <span className={client}>{clientName}</span> 接入中</Typography>
				<Typography color="inherit" className={cardContentText}>${formatAmount(clientBalance)}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { joinRoom(channelId, voiceAppId) }}>接聽</Button>
      </CardActions>
			<CardActions>
				<Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { assignAnchor(channelId, 'joyce', sendAssignAnchorCMD) }}>配對主播</Button>
			</CardActions>
    </Card>
	);
};

const TelebetTile = props => {
	const { classes, voiceAppId, item, sendAssignAnchorCMD } = props;
	const { anchorName, clientName, managerName, anchorState } = item;

	const clientDealIn = clientName && !anchorName;
	const anchorDealIn = clientName && anchorName && anchorState === USER_STATE.WAITING_MANAGER;
	const nobodyDealIn = !clientName && !anchorName && !managerName;
	const fullDesk = clientName && (anchorName || managerName);

	let role;
	let roleClass;
	let panel;

	if (clientDealIn) {
		roleClass = 'player';
		role = '玩家';
	}

	if (anchorDealIn) {
		roleClass = 'anchor';
		role = '主播';
	}

	if (nobodyDealIn || fullDesk) {
		panel = <EmptyCard classes={classes} />; // Empty card
	} else if (clientDealIn || anchorDealIn) {
		if (managerName) {
			panel = <DisabledCard classes={classes} item={item} role={role} />; // Disabled info card
		} else {
			panel = <CallInfoCard classes={classes} item={item} role={role} roleClass={roleClass} voiceAppId={voiceAppId} sendAssignAnchorCMD={sendAssignAnchorCMD} /> // Call info card
		}
	} else {
		console.log("OMG", item);
	}

	console.log("item & panel", item, panel);

	return (
		<div>{panel}</div>
	);
}

TelebetTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

const StyledTelebetTile = withStyles(styles)(TelebetTile);

const mapStateToProps = state => {
	const { voiceAppId, channelList } = state.voice;
	
  return ({
		voiceAppId: voiceAppId,
    channelList: channelList
  });
};

export default connect(mapStateToProps, null)(StyledTelebetTile);