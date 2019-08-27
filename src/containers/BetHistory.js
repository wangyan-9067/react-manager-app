import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Typography from '@material-ui/core/Typography';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

import { toggleToast, setToastMessage, setToastVariant } from '../actions/app';
import { setBetHistoryTablePageIndex } from '../actions/data';
import { compareArray, convertObjectListToArrayList, formatAmount } from '../helpers/utils';
import { getLangConfig } from '../helpers/appUtils';
import { PLAYTYPE } from '../constants';
import voiceAPI from '../services/Voice/voiceAPI';
import VideoDialog from '../components/VideoDialog';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    }
});

const TablePaginationActions = ({ classes, count, page, rowsPerPage, theme, onChangePage }) => {
    const handleFirstPageButtonClick = event => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = event => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = event => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = event => {
        onChangePage(
            event,
            Math.max(0, Math.ceil(count / rowsPerPage) - 1)
        );
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="First Page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="Previous Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Next Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Last Page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
);

const styles = theme => ({
    root: {
        width: '100%'
    },
    cellRoot: {
        padding: '4px 0px 4px 12px',
        color: '#818181',
        fontWeight: 'bold',
        fontSize: '0.85rem'
    },
    cellWidth: {
        width: '75px'
    },
    table: {
        minWidth: 500,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    profitClass: {
        color: '#ED4217'
    },
    lossClass: {
        color: '#13C636'
    },
    playerIcon: {
        color: '#3970B0'
    }
});

const getPlayType = playtype => {
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
            return '';
    }
};

const usePrevious = value => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

const BetHistory = ({
    classes,
    betHistory,
    toggleToast,
    setToastMessage,
    setToastVariant,
    betHistoryUserPid,
    betHistoryInfo,
    setBetHistoryTablePageIndex,
    betHistoryTablePageIndex,
    betHistoryTableSearchFields
}) => {
    let betHistoryList = convertObjectListToArrayList(betHistory.byHash);

    const { root, cellRoot, cellWidth, tableWrapper, table, playerIcon } = classes;
    const { numPerPage, total } = betHistoryInfo;
    const [rows, setRows] = useState(betHistoryList);
    const [page, setPage] = useState(betHistoryTablePageIndex);
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(numPerPage);
    const [row, setRow] = useState({});
    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const prevRows = usePrevious(betHistoryList.slice());
    const noRecordDisplay = rows.length === 0;
    const langConfig = getLangConfig();
    const handleChangePage = (event, page) => {
        const { loginname, gmCode } = betHistoryTableSearchFields;
        voiceAPI.getBetHistory(loginname, gmCode, page + 1);
        setBetHistoryTablePageIndex(page);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(event.target.value);
    };

    const closeVideoDialog = () => {
        setVideoDialogOpen(false);
    }

    const openVideoDialog = (row) => {
        setRow(row);
        setVideoDialogOpen(true);
    }

    useEffect(() => {
        const flattenArrays = {
            prev: prevRows,
            current: betHistoryList
        };

        if (!compareArray(flattenArrays.prev, flattenArrays.current)) {
            setRows(flattenArrays.current);
        }

        const { numPerPage } = betHistoryInfo;

        if (Number.isInteger(numPerPage) && numPerPage > 0 && rowsPerPage !== numPerPage) {
            setRowsPerPage(numPerPage);
        }

        if (page !== betHistoryTablePageIndex) {
            setPage(betHistoryTablePageIndex);
        }
    });

    return (
        <Fragment>
            <Paper className={root}>
                <div className={tableWrapper}>
                    <Table className={table}>
                        <TableHead>
                            <TableRow>
                                <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">{langConfig.BET_HISTORY_LABEL.BILL_NO}</TableCell>
                                <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">{langConfig.BET_HISTORY_LABEL.GAME_CODE}</TableCell>
                                <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">{langConfig.BET_HISTORY_LABEL.TIME}</TableCell>
                                <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">{langConfig.BET_HISTORY_LABEL.RESULT}</TableCell>
                                <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">{langConfig.BET_HISTORY_LABEL.REPLAY}</TableCell>
                                <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">{langConfig.BET_HISTORY_LABEL.ANCHOR}</TableCell>
                                <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">{langConfig.BET_HISTORY_LABEL.PLAY_TYPE}</TableCell>
                                <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">{langConfig.BET_HISTORY_LABEL.TOTAL_BET}</TableCell>
                                <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">{langConfig.BET_HISTORY_LABEL.FLAG}</TableCell>
                                <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">{langConfig.BET_HISTORY_LABEL.GAME_STATUS}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => {
                                const betHistoryClasses = classNames.bind(classes);
                                const profitClasses = betHistoryClasses({
                                    profitClass: row.profit > 0,
                                    lossClass: row.profit < 0
                                });
                                var remark = row.remark;
                                if (remark) {
                                    remark = remark.split(",");
                                    if (remark.length > 0) {
                                        remark = remark[0].split(":");
                                    }
                                }
                                return (
                                    <TableRow key={row.billno}>
                                        <TableCell classes={{ root: cellRoot }} className={cellWidth} align="center">{row.billno}</TableCell>
                                        <TableCell classes={{ root: cellRoot }} className={cellWidth} align="center">{row.gmcode}</TableCell>
                                        <TableCell classes={{ root: cellRoot }} className={cellWidth} align="center">{row.betTime}</TableCell>
                                        <TableCell classes={{ root: cellRoot }} align="center">{langConfig.BANKER} {row.bankerVal} {langConfig.PLAYER} {row.playerVal}</TableCell>
                                        <TableCell classes={{ root: cellRoot }} align="center"><IconButton classes={{ root: playerIcon }} onClick={() => openVideoDialog(row)}><PlayCircleFilledIcon /></IconButton></TableCell>
                                        <TableCell classes={{ root: cellRoot }} align="center">{remark.length > 1 ? remark[1] : '-'}</TableCell>
                                        <TableCell classes={{ root: cellRoot }} align="center">{getPlayType(row.playtype)}</TableCell>
                                        <TableCell classes={{ root: cellRoot }} align="center">{formatAmount(row.amount)}</TableCell>
                                        <TableCell classes={{ root: cellRoot }} className={profitClasses} align="center">{row.profit > 0 ? '+' : ''}{formatAmount(row.profit)}</TableCell>
                                        <TableCell classes={{ root: cellRoot }} align="center">{row.flag === 0 ? langConfig.BET_HISTORY_LABEL.FLAG_STATUS.UNPAID : langConfig.BET_HISTORY_LABEL.FLAG_STATUS.PAID}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {noRecordDisplay && (
                                <TableRow>
                                    <TableCell colSpan={12}>
                                        <Typography color="inherit" align="center">{langConfig.BET_HISTORY_LABEL.NO_RECORD}</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[]}
                                    colSpan={12}
                                    // count={rows.length}
                                    count={total}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActionsWrapped}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </Paper>
            <VideoDialog open={videoDialogOpen} onClose={closeVideoDialog} row={row}/>
        </Fragment>
    );
};

BetHistory.propTypes = {
    classes: PropTypes.object.isRequired,
    betHistory: PropTypes.object,
    toggleToast: PropTypes.func,
    setToastMessage: PropTypes.func,
    setToastVariant: PropTypes.func,
    betHistoryUserPid: PropTypes.string,
    betHistoryInfo: PropTypes.object,
    setBetHistoryTablePageIndex: PropTypes.func,
    betHistoryTablePageIndex: PropTypes.number,
    betHistoryTableSearchFields: PropTypes.object
};

const StyledBetHistory = withStyles(styles)(BetHistory);

const mapStateToProps = state => {
    const { betHistory, betHistoryUserPid, betHistoryInfo, betHistoryTablePageIndex, betHistoryTableSearchFields } = state.data;

    return ({
        betHistory,
        betHistoryUserPid,
        betHistoryInfo,
        betHistoryTablePageIndex,
        betHistoryTableSearchFields
    });
};

const mapDispatchToProps = dispatch => ({
    toggleToast: toggle => dispatch(toggleToast(toggle)),
    setToastMessage: message => dispatch(setToastMessage(message)),
    setToastVariant: variant => dispatch(setToastVariant(variant)),
    setBetHistoryTablePageIndex: index => dispatch(setBetHistoryTablePageIndex(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledBetHistory);