import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { getLangConfig } from '../helpers/appUtils';
import { USER_STATE } from '../constants';
import { formatAmount } from '../helpers/utils';


const joinRoom = (channelId, joinChannel, isAnchor, setIsAnchorCall, setIncomingCallCount, incomingCallCount) => {
	setIsAnchorCall(isAnchor);
	joinChannel(channelId);
	setIncomingCallCount(incomingCallCount - 1)
};

const FullChatroomCard = ({ classes, item, setIsAnchorCall, cardClass, joinChannel, isManagerReconnect, currentTable, setIncomingCallCount, incomingCallCount }) => {
	const { cardBase, cardContent, cardContentText, client, cardActionButton } = classes;
	const { clientName, anchorState, anchorName, channelId, managerName, clientBalance, vid } = item;
	const { CHANGE_ANCHOR, CHANGE_DEALER, CHANGE_TABLE, ANNOYING, ADVERTISEMENT } = USER_STATE;	
	const langConfig = getLangConfig();
	let renderButton = ''
	if(isManagerReconnect) {
		renderButton = <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { joinRoom(channelId, joinChannel, true, setIsAnchorCall, setIncomingCallCount, incomingCallCount) }} disabled={managerName && !isManagerReconnect ? true : false}>{langConfig.BUTTON_LABEL.CONTINUE_CHANNEL}</Button>		
	} else if(!isManagerReconnect && managerName ){
		renderButton = <Button variant="contained" size="medium" color="inherit" className={cardActionButton} onClick={() => { joinRoom(channelId, joinChannel, true, setIsAnchorCall, setIncomingCallCount, incomingCallCount) }} disabled>{langConfig.BUTTON_LABEL.JOIN_CHANNEL_2.replace("{name}", managerName)}</Button>		
	}

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
			{ vid && <Typography color="inherit" className={cardContentText}>{vid}</Typography> }
			{ anchorName && <Typography color="inherit" className={cardContentText}>{langConfig.TELEBET_TILE_LABEL.ANCHOR}<span className={client}>{anchorName}</span></Typography> }
			<Typography color="inherit" className={cardContentText}>{langConfig.TELEBET_TILE_LABEL.PLAYER}<span className={client}>{clientName}</span>{langConfig.TELEBET_TILE_LABEL.PLAYING}</Typography>
			{ [CHANGE_ANCHOR, CHANGE_DEALER, CHANGE_TABLE, ANNOYING, ADVERTISEMENT].indexOf(anchorState) > -1 && anchorStateText ? (
				<Typography color="inherit" className={cardContentText}>{langConfig.TELEBET_TILE_LABEL.REASON}: {anchorStateText}</Typography>
			) : null }
			<Typography color="inherit" className={cardContentText}>{clientBalance > 0 ? `$${formatAmount(clientBalance)}` : '-'}</Typography>
			</CardContent>
			<CardActions>
			{renderButton}
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

export default FullChatroomCard;