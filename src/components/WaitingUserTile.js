import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import { getLangConfig } from '../helpers/appUtils';
import DurationClock from '../components/DurationClock';
import dataAPI from '../services/Data/dataAPI';

import buttonStyles from '../css/button.module.scss';

const styles = theme => ({
    root: {
        margin: theme.spacing.unit
    },
    card: {
        borderRadius: '10px',
        border: '3px solid #EDEDED',
        backgroundColor: '#EDEDED',
        minHeight: '148px'
    },
    cardContentRoot: {
        padding: '5px',
        '&:first-child': {
            paddingBottom: '0'
        }
    },
    cardContent: {
        color: '#666666',
        textAlign: 'left'
    },
    cardActions: {
        display: 'block',
        textAlign: 'center'
    },
    cardContentText: {
        fontSize: '16px'
    },
    cardContentMainText: {
        color: '#1779E6',
        fontWeight: 'bold',
        fontSize: '1rem',
        wordWrap: 'break-word'
    },
    cardContentSubText: {
        color: '#139727',
        fontWeight: 'bold',
        margin: '5px 0'
    }
});

const WaitingForToken = ({ classes, item, waitingStartTime, openAssignTableDialog, openKickLineupDialog }) => {
    const { card, cardContentRoot, cardContent, cardContentText, cardContentMainText, cardActions } = classes;
    const { actionButtonS } = buttonStyles;
    const langConfig = getLangConfig();
    const { name, balance, limit: { min, max }, currency } = item;

    return (
        <Card className={card}>
            <CardContent className={cardContent} classes={{ root: cardContentRoot }}>
                <Typography color="inherit" className={classNames(cardContentText, cardContentMainText)} align="center">{name}</Typography>
                <Typography color="inherit" className={classNames(cardContentText)} noWrap={true} align="center">{balance} {dataAPI.getCurrencyName(currency)}</Typography>
                <Typography color="inherit" className={classNames(cardContentText)} noWrap={true} align="center">{`${min} - ${max}`}</Typography>
                <CardActions className={cardActions}>
                    <Button variant="contained" size="small" color="inherit" className={actionButtonS} onClick={() => { openAssignTableDialog(name); }}>{langConfig.BUTTON_LABEL.ASSIGN_TOKEN}</Button>
                    <Button variant="contained" size="small" color="inherit" className={actionButtonS} onClick={() => { openKickLineupDialog(name); }}>{langConfig.BUTTON_LABEL.KICKOUT_PLAYER}</Button>
                </CardActions>
                <Typography color="inherit" className={cardContentText} noWrap={true} align="center">
                    <DurationClock waitingStartTime={waitingStartTime} />
                </Typography>
            </CardContent>
        </Card>
    );
};

WaitingForToken.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object,
    waitingTime: PropTypes.string,
    openAssignTableDialog: PropTypes.func.isRequired,
    openKickLineupDialog: PropTypes.func.isRequired
};

const WaitingUserTile = ({ classes, item, openAssignTableDialog, openKickLineupDialog }) => {
    const { waitingStartTime } = item;
    let panel = <WaitingForToken
        classes={classes}
        item={item}
        waitingStartTime={waitingStartTime}
        openAssignTableDialog={openAssignTableDialog}
        openKickLineupDialog={openKickLineupDialog} />;

    return (
        <div className={classes.root}>{panel}</div>
    );
}

WaitingUserTile.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object,
    openAssignTableDialog: PropTypes.func.isRequired,
    openKickLineupDialog: PropTypes.func.isRequired
};

export default withStyles(styles)(WaitingUserTile);