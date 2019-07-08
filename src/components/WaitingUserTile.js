import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import { getLangConfig } from '../helpers/appUtils';

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
    tokenCard: {
        border: '3px solid #139727',
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
    cardContentText: {
        fontSize: '16px'
    },
    cardContentMainText: {
        color: '#1779E6',
        fontWeight: 'bold',
        fontSize: '1.3rem'
    },
    cardContentSubText: {
        color: '#139727',
        fontWeight: 'bold',
        margin: '5px 0'
    },
    actionButton: {
        color: '#FFFFFF',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        borderRadius: '18px',
        width: '80%',
        margin: '16px auto',
        padding: '2px 0',
        backgroundColor: '#1779E6',
        '&:hover': {
            backgroundColor: '#1779E6',
            borderColor: '#1779E6',
        }
    },
    kickButton: {
        margin: '0 auto',
        backgroundColor: '#FE0000',
        '&:hover': {
            backgroundColor: '#FE0000',
            borderColor: '#FE0000',
        }
    }
});

const WaitingForToken = ({ classes, item, waitingTime, openAssignTableDialog }) => {
    const { card, cardContentRoot, cardContent, cardContentText, cardContentMainText, actionButton } = classes;
    const langConfig = getLangConfig();
    const { name, balance, limit: { min, max } } = item;

    return (
        <Card className={card}>
            <CardContent className={cardContent} classes={{ root: cardContentRoot }}>
                <Typography color="inherit" className={classNames(cardContentText, cardContentMainText)} noWrap={true} align="center">{name}</Typography>
                <Typography color="inherit" className={classNames(cardContentText)} noWrap={true} align="center">{balance}</Typography>
                <Typography color="inherit" className={classNames(cardContentText)} noWrap={true} align="center">{`${min} - ${max}`}</Typography>
                <CardActions>
                    <Button variant="contained" size="medium" color="inherit" className={actionButton} onClick={() => { openAssignTableDialog(name); }}>{langConfig.BUTTON_LABEL.ASSIGN_TOKEN}</Button>
                </CardActions>
                <Typography color="inherit" className={cardContentText} noWrap={true} align="center">{waitingTime}</Typography>
            </CardContent>
        </Card>
    );
};

WaitingForToken.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object,
    waitingTime: PropTypes.string,
    openAssignTableDialog: PropTypes.func.isRequired
};

const WaitingUserTile = ({ classes, item, assignTokenToDelegator, openAssignTableDialog, kickDelegator }) => {
    const [waitingTime, setWaitingTime] = useState({});
    const { waitingStartTime } = item;
    let panel = <WaitingForToken
        classes={classes}
        item={item}
        waitingTime={waitingTime[item.name]}
        openAssignTableDialog={openAssignTableDialog} />;

    useEffect(() => {
        const updatedWaitingTime = {};
        updatedWaitingTime[item.name] = moment.utc(moment().diff(moment(waitingStartTime * 1000))).format("HH:mm:ss");
        setWaitingTime({ ...waitingTime, ...updatedWaitingTime });
    });

    return (
        <div className={classes.root}>{panel}</div>
    );
}

WaitingUserTile.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object,
    openAssignTableDialog: PropTypes.func.isRequired
};

export default withStyles(styles)(WaitingUserTile);