import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { USER_STATE } from '../constants';
import { getLangConfig } from '../helpers/appUtils';
import { formatAmount } from '../helpers/utils';

const joinRoom = (channelId, joinChannel, isAnchor, setIsAnchorCall, setIncomingCallCount, incomingCallCount) => {
	setIsAnchorCall(isAnchor);
	joinChannel(channelId);
	setIncomingCallCount(incomingCallCount - 1)
};


const CallInfoCard = ({ classes, item, setIsAnchorCall, isAnchor, role, roleName, cardClass, roleClass, joinChannel, currentTable, setIncomingCallCount, incomingCallCount, isConnecting, currentManagerName }) => {	
	const { cardBase, cardContent, cardContentText, client, cardActionButton } = classes;
	const { channelId, anchorState, managerName, clientBalance,clientName,anchorName } = item;		
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
	}	

	return (
	    <Card className={classNames(cardBase, classes[cardClass])}>
	      <CardContent className={cardContent}>	      
			{ anchorName && <Typography color="inherit" className={classNames(cardContentText, classes.anchor)}>{langConfig.TELEBET_TILE_LABEL.ANCHOR} <span className={client}>{anchorName}</span> {isConnecting ? langConfig.TELEBET_TILE_LABEL.CONNECTING : langConfig.TELEBET_TILE_LABEL.CONNECTED}</Typography> }
			{ clientName && <Typography color="inherit" className={classNames(cardContentText, classes.player)}>{langConfig.TELEBET_TILE_LABEL.PLAYER} <span className={client}>{clientName}</span> {isConnecting ? langConfig.TELEBET_TILE_LABEL.CONNECTING : langConfig.TELEBET_TILE_LABEL.CONNECTED}</Typography> }
			{ [CHANGE_ANCHOR, CHANGE_DEALER, CHANGE_TABLE, ANNOYING, ADVERTISEMENT].indexOf(anchorState) > -1 && anchorStateText ? (
				<Typography color="inherit" className={cardContentText}>{langConfig.TELEBET_TILE_LABEL.REASON}: {anchorStateText}</Typography>
			) : null }
			<Typography color="inherit" className={cardContentText}>{clientBalance > 0 ? `$${formatAmount(clientBalance)}` : '-'}</Typography>
	      </CardContent>
	      <CardActions>
	      	<Button variant="contained" size="medium" color="inherit" className={cardActionButton} disabled={ !!(managerName && managerName !== currentManagerName)} onClick={() => { joinRoom(channelId, joinChannel, isAnchor, setIsAnchorCall, setIncomingCallCount, incomingCallCount) }}>{langConfig.BUTTON_LABEL.JOIN_CHANNEL}</Button>
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


export default CallInfoCard;