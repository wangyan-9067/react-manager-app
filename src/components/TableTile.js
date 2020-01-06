import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import Moment from 'react-moment';


import PopoverList from './PopoverList';
import TextList from './TextList';
import { DATA_SERVER_VIDEO_STATUS, DATA_SERVER_GAME_STATUS, PLAYTYPE, SUPPORT_PLAYTYPE } from '../constants';
import { isObject, isNonEmptyArray, formatAmount } from '../helpers/utils';
import { getLangConfig } from '../helpers/appUtils';
import dataAPI from '../services/Data/dataAPI';

const styles = {
    root: {
        backgroundColor: '#fff'
    },
    cardHeader: {
        display: 'flex',
        padding: '12px',
        alignItems: 'center',
        backgroundColor: '#13C636',
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    redCardHeader: {
        backgroundColor: '#F82021',
    },
    cardContent: {
        textAlign: 'left',
        color: '#818181'
    },
    cardActionButton: {
        margin: '0 auto',
        // backgroundColor: '#E2E2E2',
        // color: '#6C6C6C'
    },
    tableNo: {
        flex: '0 0 auto'
    },
    tableStatus: {
        flex: '1 1 auto'
    },
    tableValue: {
        fontWeight: 'bold',
        padding: '2px',
        wordWrap: 'break-word',
        maxWidth: '10rem',
        display: 'inline-block'
    },
    fieldWrapper: {
        alignItems: 'center'
    },
    greenColor: {
        color: '#13C636'
    },
    redColor: {
        color: '#F82021'
    }
};

const Stopwatch = ({ datetime, duration }) => {
    const tempDate = new Date(0, 0, 0, 0, 0, 0);
    const now = new Date();
    const [time, setTime] = useState(new Date(tempDate.getTime() + now.getTime() - datetime.getTime() + duration));
    const tick = () => {
        setTime(new Date(time.getTime() + duration));
    }
    let timer;

    useEffect(() => {
        timer = setInterval(() => tick(), 1000);

        return () => {
            clearInterval(timer);
        }
    })

    return (
        <Moment format="HH:mm:ss">{time}</Moment>
    );
}

const getTableStatus = tableReserved => {
    const langConfig = getLangConfig();

    switch (tableReserved) {
        case false:
            return langConfig.TABLE_STATUS_LABEL.FREE;

        case true:
            return langConfig.TABLE_STATUS_LABEL.CONTRACTED;

        default:
            return '';
    }
};

const getGameStatus = status => {
    const { CLOSED, CAN_BET, DISPATCH_CARD, LAST_CALL, TURN_CARD, NEW_SHOE, PAUSE_BET } = DATA_SERVER_GAME_STATUS;
    const langConfig = getLangConfig();

    switch (status) {
        case CLOSED:
            return langConfig.GAME_STATUS_LABEL.CLOSED;

        case CAN_BET:
            return langConfig.GAME_STATUS_LABEL.CAN_BET;

        case DISPATCH_CARD:
            return langConfig.GAME_STATUS_LABEL.DISPATCH_CARD;

        case LAST_CALL:
            return langConfig.GAME_STATUS_LABEL.LAST_CALL;

        case TURN_CARD:
            return langConfig.GAME_STATUS_LABEL.TURN_CARD;

        case NEW_SHOE:
            return langConfig.GAME_STATUS_LABEL.NEW_SHOE;

        case PAUSE_BET:
            return langConfig.GAME_STATUS_LABEL.PAUSE_BET;

        default:
            return '-';
    }
};

const getPlayTypeText = playtype => {
    const { BANKER, PLAYER, TIE, BANKER_PAIR, PLAYER_PAIR, BANKER_NO_COMMISSION, BANKER_DRAGON_BONUS, PLAYER_DRAGON_BONUS, SUPER_SIX, ANY_PAIR, PERFECT_PAIR, BIG, SMALL } = PLAYTYPE;
    const langConfig = getLangConfig();

    switch (playtype) {
        case BANKER:
            return langConfig.PLAY_TYPE_LABEL.BANKER;

        case PLAYER:
            return langConfig.PLAY_TYPE_LABEL.PLAYER;

        case TIE:
            return langConfig.PLAY_TYPE_LABEL.TIE;

        case BANKER_PAIR:
            return langConfig.PLAY_TYPE_LABEL.BANKER_PAIR;

        case PLAYER_PAIR:
            return langConfig.PLAY_TYPE_LABEL.PLAYER_PAIR;

        case BANKER_NO_COMMISSION:
            return langConfig.PLAY_TYPE_LABEL.BANKER_NO_COMMISSION;

        case BANKER_DRAGON_BONUS:
            return langConfig.PLAY_TYPE_LABEL.BANKER_DRAGON_BONUS;

        case PLAYER_DRAGON_BONUS:
            return langConfig.PLAY_TYPE_LABEL.PLAYER_DRAGON_BONUS;

        case SUPER_SIX:
            return langConfig.PLAY_TYPE_LABEL.SUPER_SIX;

        case ANY_PAIR:
            return langConfig.PLAY_TYPE_LABEL.ANY_PAIR;

        case PERFECT_PAIR:
            return langConfig.PLAY_TYPE_LABEL.PERFECT_PAIR;
        case BIG:
            return langConfig.PLAY_TYPE_LABEL.BIG;
        case SMALL:
            return langConfig.PLAY_TYPE_LABEL.SMALL;

        default:
            return;
    }
}

// const getAnchorByVid = (vid, anchorsOnDutyList) => {
// 	const targetAnchor = anchorsOnDutyList.find(anchor => anchor.vid === vid);
// 	return targetAnchor ? targetAnchor.anchorName : '-';
// };

const getTableLimitList = (vid, tableLimit) => {
    // const playtypeList = Object.values(PLAYTYPE);
    const hashTableList = tableLimit.byHash[vid];
    if (isNonEmptyArray(hashTableList)) {
        // eslint-disable-next-line
        return hashTableList.filter(value => {
            if (SUPPORT_PLAYTYPE.includes(value.playtype)) {
                return value;
            }
        });
    }

    return [];
}

const DataItem = ({ item }) => {
    const { playtype, min, max } = item;

    return (
        <ListItem>
            <ListItemText
                primary={`${getPlayTypeText(playtype)}: $${min} - $${max}`}
            />
        </ListItem>
    );
};

DataItem.proptype = {
    item: PropTypes.object.isRequired
};

const TableTile = ({ classes, item, anchorsOnDutyList, toggleDialog, setKickoutClient, channelList, tableLimit, anchorBets, jettons }) => {
    const { cardContent, tableNo, tableStatus, tableValue, cardActionButton, fieldWrapper } = classes;
    const { vid, dealerName, gameCode, status, tableOwner, gameStatus, seatedPlayerNum, startDatetime } = item;
    const currentChannel = channelList.find(channel => channel.vid === vid);
    const { anchorName = '-', currency = '', vid: channelVid = '', clientName } = currentChannel || {};
    const currencyName = dataAPI.getCurrencyName(currency);
    const tableLimitList = getTableLimitList(vid, tableLimit);
    const langConfig = getLangConfig();

    const totalNotValidBet = tableOwner && (anchorBets && anchorBets[vid]) ? anchorBets[vid].totalNotValidBet : 0;
    const totalPayout = tableOwner && (jettons && jettons[vid]) ? jettons[vid].totalPayout : 0;

    let textColor = '';
    if (totalPayout > 0) {
        textColor = classes.greenColor;
    } else if (totalPayout < 0) {
        textColor = classes.redColor;
    }

    const tableLimitDisplay = tableLimitList.length > 0 ? (
        <PopoverList buttonText={langConfig.TABLE_LIMIT_LIST}>
            <TextList list={tableLimitList} dataItem={DataItem} />
        </PopoverList>
    ) : <span className={tableValue}>-</span>

    // TODO: 顯示牌靴

    const tableReserved = !!tableOwner || !!clientName;
    const tableTileClasses = classNames.bind(classes);
    const tileHeaderClass = tableTileClasses({
        cardHeader: true,
        redCardHeader: tableReserved
    });

    return (
        <Card className={classes.root}>
            <div className={tileHeaderClass}>
                <div className={tableNo}>{vid}</div>
                <div className={tableStatus}>{getTableStatus(tableReserved)}</div>
            </div>
            <CardContent className={cardContent}>
                <Typography color="inherit"><span>{langConfig.SEAT_NUMBER}</span><span className={tableValue}>{seatedPlayerNum}/7</span></Typography>
                <Typography color="inherit"><span>{langConfig.GAME_CODE}</span><span className={tableValue}>{gameCode || '-'}</span></Typography>
                <Typography color="inherit"><span>{langConfig.DEALER}</span><span className={tableValue}>{dealerName || '-'}</span></Typography>
                <Typography color="inherit"><span>{langConfig.ANCHOR}</span><span className={tableValue}>{/* getAnchorByVid(vid, anchorsOnDutyList) */}{anchorName}</span></Typography>
                {
                    tableLimitList.length > 0 ?
                        <Grid container spacing={8} alignItems="flex-end" className={fieldWrapper}>
                            <Grid item><Typography color="inherit">{langConfig.TABLE_LIMIT}</Typography></Grid>
                            <Grid item>{tableLimitDisplay}</Grid>
                        </Grid> : <Typography color="inherit"><span>{langConfig.TABLE_LIMIT}</span><span className={tableValue}>-</span></Typography>

                }
                <Typography color="inherit"><span>{langConfig.TABLE_OWNER}</span><span className={tableValue}>{tableOwner || '-'}</span></Typography>
                <Typography color="inherit"><span>{langConfig.GAME_STATUS}</span><span className={tableValue}>{getGameStatus(gameStatus)}</span></Typography>
                <Typography color="inherit"><span>{langConfig.GAME_TIME}</span><span className={tableValue}>{gameStatus === 1 ? <Stopwatch datetime={startDatetime} duration={1000} /> : '-'}</span></Typography>
                <Typography color="inherit"><span>{langConfig.GAME_TOTAL_BET}</span><span className={tableValue}>{formatAmount(totalNotValidBet, currencyName)}</span></Typography>
                <Typography color="inherit"><span>{langConfig.GAME_TOTAL_PAYOUT}</span><span className={classNames(tableValue, textColor)}>{(totalPayout > 0 ? '+' : '') + formatAmount(totalPayout, currencyName)}</span></Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant="contained"
                    size="medium"
                    color={status !== DATA_SERVER_VIDEO_STATUS.FREE ? 'primary' : 'inherit'}
                    className={cardActionButton}
                    onClick={() => {
                        setKickoutClient({
                            vid,
                            clientName: tableOwner
                        });
                        toggleDialog(true);
                    }}
                    disabled={status === DATA_SERVER_VIDEO_STATUS.FREE}
                >
                    {langConfig.KICKOUT_CLIENT}
                </Button>
            </CardActions>
        </Card>
    );
}

TableTile.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    anchorsOnDutyList: PropTypes.array,
    toggleDialog: PropTypes.func,
    setKickoutClient: PropTypes.func,
    channelList: PropTypes.array,
    tableLimit: PropTypes.object,
    anchorBets: PropTypes.object,
    jettons: PropTypes.object,
};

export default withStyles(styles)(TableTile);