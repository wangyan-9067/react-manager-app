import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import { setIsAnchorCall } from '../actions/voice';
import { isObject } from '../helpers/utils';
import voiceAPI from '../services/Voice/voiceAPI';

import CallInfoCard from '../components/CallInfoCard';

const styles = {
    cardBase: {
        minHeight: '229px'
    },
    emptyCard: {
        borderRadius: '16px',
        border: '3px solid #F5F5F5',
        padding: '30px',
        backgroundColor: '#F5F5F5'
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

const TelebetTile = ({
    classes,
    setIsAnchorCall,
    item,
    managerCredential,
    tableList,
    player
}) => {
    const { anchorName, clientName, managerName, vid } = item;
    const currentManagerName = isObject(managerCredential) ? managerCredential.managerLoginname : '';
    const currentTable = vid ? tableList.find(table => table.vid === vid) : null;
    const nobodyDealIn = !clientName && !anchorName && !managerName;
    const joinChannel = (...args) => {
        voiceAPI.joinChannel(...args);
    }

    let panel;

    if (nobodyDealIn) {
        panel = <EmptyCard classes={classes} />;
    } else {
        panel = (
            <CallInfoCard
                item={item}
                setIsAnchorCall={setIsAnchorCall}
                joinChannel={joinChannel}
                currentTable={currentTable}
                currentManagerName={currentManagerName}
                player={player}
            />
        );
    }

    return (
        <div>{panel}</div>
    );
}

TelebetTile.propTypes = {
    classes: PropTypes.object.isRequired,
    setIsAnchorCall: PropTypes.func,
    item: PropTypes.object,
    managerCredential: PropTypes.object,
    tableList: PropTypes.array,
    setIncomingCallCount: PropTypes.func,
    incomingCallCount: PropTypes.number
};

const StyledTelebetTile = withStyles(styles)(TelebetTile);

const mapStateToProps = state => {
    const { incomingCallCount } = state.voice;
    const { managerCredential } = state.app;
    const { player, anchorBets } = state.data;

    return ({
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