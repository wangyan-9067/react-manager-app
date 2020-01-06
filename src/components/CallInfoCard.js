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
import { getLangConfig, isAnchorCalling, isClientCalling } from '../helpers/appUtils';
import { formatAmount } from '../helpers/utils';
import {combineStyles, buttonStyles } from '../styles';

const styles = theme => ({
    cardBase: {
        minHeight: '200px'
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
    cardContentText: {
        fontSize: '1rem'
    },
    client: {
        fontWeight: 'bold',
        wordWrap: 'break-word'
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


const CallInfoCard = ({ classes, item, setIsAnchorCall, joinChannel, currentTable, currentManagerName, tableList, anchorsOnDutyList }) => {
    const { cardBase, cardContent, cardContentText, client, actionButton } = classes;
    const { channelId, anchorState, managerName, currency, clientName, anchorName, clientState, vid } = item;
    const { OTHERS, CHANGE_ANCHOR, CHANGE_DEALER, CHANGE_TABLE, ANNOYING, ADVERTISEMENT, CHANGE_SHOE, NO_BET, CONNECTED, CONNECTING } = USER_STATE;
    const langConfig = getLangConfig();
    const cardClass = isClientCalling(item) ? 'card' : isAnchorCalling(item) ? 'anchorCard' : 'playingCard';
    const joinRoom = (channelId, joinChannel, isAnchorCall, setIsAnchorCall) => {
        setIsAnchorCall(isAnchorCall);
        joinChannel(channelId);
    };

    let anchorStateText = '';
    const table = tableList.find( table => table.vid === vid);
    const latestClientBalance = table && table.account ? table.account : null;
    const isAnchorOnline = !!anchorsOnDutyList.find( anchor => anchor.anchorName === anchorName);

    switch (anchorState) {
        case OTHERS:
        case CHANGE_ANCHOR:
        case CHANGE_DEALER:
        case CHANGE_TABLE:
        case ANNOYING:
        case ADVERTISEMENT:
        case CHANGE_SHOE:
        case NO_BET:
            anchorStateText = langConfig.TELEBET_TILE_LABEL.ANCHOR_STATE_ACTIONS['REASON_' + anchorState];
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
                {anchorName &&
                    <Typography className={classNames(cardContentText, anchorTextColorClass)}>
                        {langConfig.TELEBET_TILE_LABEL.ANCHOR} <span className={client}>{anchorName}</span> {
                            anchorState === CONNECTED ? langConfig.TELEBET_TILE_LABEL.PLAYING : isAnchorOnline ? langConfig.TELEBET_TILE_LABEL.ONLINE : langConfig.TELEBET_TILE_LABEL.CONNECTING
                        }
                    </Typography>
                }
                {
                    clientName && <Typography color="inherit" className={classNames(cardContentText, clientTextColorClass)}>
                        {langConfig.TELEBET_TILE_LABEL.PLAYER}
                        <span className={client}>{clientName}</span>
                        {clientState === CONNECTING && langConfig.TELEBET_TILE_LABEL.CONNECTING}
                        {/* {clientState === CONNECTING && <DurationClock waitingStartTime={waitingStartTime}/>} */}
                        {clientState === CONNECTED && langConfig.TELEBET_TILE_LABEL.PLAYING}
                    </Typography>
                }
                {anchorStateText && (
                    <Typography color="inherit" className={cardContentText}>{langConfig.TELEBET_TILE_LABEL.REASON} {anchorStateText}</Typography>
                )}
                <Typography color="inherit" className={cardContentText}>{latestClientBalance !== null ? `${formatAmount(latestClientBalance, currency)}` : '-'}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="inherit" className={actionButton} disabled={!!(managerName && managerName !== currentManagerName)} onClick={() => { joinRoom(channelId, joinChannel, isAnchorCalling(item), setIsAnchorCall) }}>
                    {!managerName && langConfig.BUTTON_LABEL.JOIN_CHANNEL}
                    {(managerName && managerName === currentManagerName) && langConfig.BUTTON_LABEL.CONTINUE_CHANNEL}
                    {(managerName && managerName !== currentManagerName) && langConfig.BUTTON_LABEL.JOIN_CHANNEL_2.replace("{name}", managerName)}
                </Button>
            </CardActions>
        </Card>
    );
};

CallInfoCard.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object,
    joinChannel: PropTypes.func,
    currentTable: PropTypes.object
};


export default withStyles(combineStyles(buttonStyles, styles))(CallInfoCard);