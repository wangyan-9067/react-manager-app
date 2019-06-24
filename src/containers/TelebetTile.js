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
import voiceAPI from '../services/Voice/voiceAPI';

import CallInfoCard from '../components/CallInfoCard';
import FullChatroomCard from '../components/FullChatroomCard';

const styles = {
    cardBase: {
        minHeight: '229px'
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

const EmptyCard = ({ classes }) => {
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

const TelebetTile = ({
    classes,
    voiceAppId,
    setIsAnchorCall,
    item,
    managerCredential,
    tableList,
    setIncomingCallCount,
    incomingCallCount,
    player
}) => {
    const { anchorName, clientName, managerName, anchorState, clientState, vid, } = item;
    const { CONNECTED, CONNECTING } = USER_STATE;
    const currentManagerName = isObject(managerCredential) ? managerCredential.managerLoginname : '';
    const currentTable = vid ? tableList.find(table => table.vid === vid) : null;
    const isCallingManager = CALLING_MANAGER_STATES.findIndex(state => state === anchorState) !== -1;
    const isManagerReconnect = managerName === currentManagerName ? true : false;
    const isManagerConnected = managerName ? true : false

    const clientConnecting = clientName && !anchorName && clientState === CONNECTING;
    const anchorConnecting = clientName && anchorName;
    const clientDealIn = clientName && !anchorName && clientState === CONNECTED;
    const anchorDealIn = clientName && anchorName && isCallingManager ? true : false;
    const clientAnchorPlaying = clientName && (clientState === CONNECTED || clientState === CONNECTING) && anchorName;
    const nobodyDealIn = !clientName && !anchorName && !managerName;
    const langConfig = getLangConfig();
    const joinChannel = (...args) => {
        voiceAPI.joinChannel(...args);
    }

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


    if (nobodyDealIn) {
        cardClass = 'emptyCard';
        panel = <EmptyCard classes={classes} />;
    } else if (isManagerConnected) {
        panel = (
            <FullChatroomCard
                item={item}
                setIsAnchorCall={setIsAnchorCall}
                cardClass={cardClass}
                joinChannel={joinChannel}
                isManagerReconnect={isManagerReconnect}
                currentTable={currentTable}
                setIncomingCallCount={setIncomingCallCount}
                incomingCallCount={incomingCallCount}
                player={player}
            />
        );
    } else if (clientConnecting || anchorConnecting) {
        panel = (
            <CallInfoCard
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
                player={player}
            />
        );
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
                    player={player}
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
    voiceAppId: PropTypes.string,
    setIsAnchorCall: PropTypes.func,
    item: PropTypes.object,
    managerCredential: PropTypes.object,
    tableList: PropTypes.array,
    setIncomingCallCount: PropTypes.func,
    incomingCallCount: PropTypes.number
};

const StyledTelebetTile = withStyles(styles)(TelebetTile);

const mapStateToProps = state => {
    const { voiceAppId, incomingCallCount } = state.voice;
    const { managerCredential } = state.app;
    const { player, anchorBets } = state.data;

    return ({
        voiceAppId,
        managerCredential,
        incomingCallCount,
        player,
        anchorBets
    });
};

const mapDispatchToProps = dispatch => ({
    setIsAnchorCall: isAnchor => dispatch(setIsAnchorCall(isAnchor))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledTelebetTile);