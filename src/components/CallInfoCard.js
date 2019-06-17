import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
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

const styles = theme => ({
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
    },
    greenColor: {
        color: '#36e168'
    }
});


const CallInfoCard = ({ classes, item, setIsAnchorCall, isAnchor, role, roleName, cardClass, roleClass, joinChannel, currentTable, setIncomingCallCount, incomingCallCount, isConnecting, currentManagerName, player }) => {
    const { cardBase, cardContent, cardContentText, client, cardActionButton } = classes;
    const { channelId, anchorState, managerName, clientBalance, clientName, anchorName, clientState, vid } = item;
    let latestClientBalance = clientBalance;
    if (player.username !== '' && player.username === clientName) latestClientBalance = player.balance;
    const { CHANGE_ANCHOR, CHANGE_DEALER, CHANGE_TABLE, ANNOYING, ADVERTISEMENT } = USER_STATE;
    const langConfig = getLangConfig();
    let anchorStateText = '';
    switch (anchorState) {
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
    var anchorTextColorClass = ''
    if (anchorState === 1) {
        anchorTextColorClass = classes.anchor;
    } else {
        anchorTextColorClass = classes.greenColor;
    }

    var clientTextColorClass = ''
    if (clientState === 1) {
        clientTextColorClass = classes.anchor;
    } else {
        clientTextColorClass = classes.greenColor;
    }

    return (
        <Card className={classNames(cardBase, classes[cardClass])}>
            <CardContent className={cardContent}>
                {vid && <Typography color="inherit" className={cardContentText}>{vid}</Typography>}
                {anchorName && <Typography className={classNames(cardContentText, anchorTextColorClass)}>{langConfig.TELEBET_TILE_LABEL.ANCHOR} <span className={client}>{anchorName}</span> {anchorState === 1 ? langConfig.TELEBET_TILE_LABEL.CONNECTING : langConfig.TELEBET_TILE_LABEL.PLAYING}</Typography>}
                {clientName && <Typography color="inherit" className={classNames(cardContentText, clientTextColorClass)}>{langConfig.TELEBET_TILE_LABEL.PLAYER} <span className={client}>{clientName}</span> {clientState === 1 ? langConfig.TELEBET_TILE_LABEL.CONNECTING : langConfig.TELEBET_TILE_LABEL.PLAYING}</Typography>}
                {[CHANGE_ANCHOR, CHANGE_DEALER, CHANGE_TABLE, ANNOYING, ADVERTISEMENT].indexOf(anchorState) > -1 && anchorStateText ? (
                    <Typography color="inherit" className={cardContentText}>{langConfig.TELEBET_TILE_LABEL.REASON} {anchorStateText}</Typography>
                ) : null}
                <Typography color="inherit" className={cardContentText}>{latestClientBalance > 0 ? `$${formatAmount(latestClientBalance)}` : '-'}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" size="medium" color="inherit" className={cardActionButton} disabled={!!(managerName && managerName !== currentManagerName)} onClick={() => { joinRoom(channelId, joinChannel, isAnchor, setIsAnchorCall, setIncomingCallCount, incomingCallCount) }}>{langConfig.BUTTON_LABEL.JOIN_CHANNEL}</Button>
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


export default withStyles(styles)(CallInfoCard);