import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
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

import AudioButton from '../components/AudioButton';
import { toggleToast, setToastMessage, setToastVariant } from '../actions/app';
import { compareArray, convertObjectListToArrayList, formatAmount } from '../helpers/utils';
import { PLAYTYPE } from '../constants';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  }
});

const TablePaginationActions  = ({ classes, count, page, rowsPerPage, theme, onChangePage }) => {
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
      Math.max(0, Math.ceil(count / rowsPerPage) - 1),
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
  theme: PropTypes.object.isRequired,
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
  }
});

const getPlayType = playtype => {
  const {	BANKER, PLAYER, TIE, BANKER_PAIR, PLAYER_PAIR, BANKER_NO_COMMISSION, BANKER_DRAGON_BONUS, PLAYER_DRAGON_BONUS, SUPER_SIX, ANY_PAIR, PERFECT_PAIR } = PLAYTYPE;
  
  switch (playtype) {
    case BANKER:
      return '庄';

    case PLAYER:
      return '闲';

    case TIE:
      return '和';

    case BANKER_PAIR:
      return '闲对';

    case PLAYER_PAIR:
      return '庄对';
      
    case BANKER_NO_COMMISSION:
      return '庄免佣';

    case BANKER_DRAGON_BONUS:
      return '庄龙宝';

    case PLAYER_DRAGON_BONUS:
      return '闲龙宝';

    case SUPER_SIX:
      return '超级六';

    case ANY_PAIR:
      return '任意对子';

    case PERFECT_PAIR:
      return '完美对子';
    
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

const BetHistory = ({ classes, betHistory, toggleToast, setToastMessage, setToastVariant }) => {
  let betHistoryList = convertObjectListToArrayList(betHistory.byHash);

  const { root, cellRoot, cellWidth, tableWrapper, table } = classes;
  const [rows, setRows] = useState(betHistoryList);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const prevRows = usePrevious(betHistoryList);

  const handleChangePage = (event, page) => {
    setPage(page);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(event.target.value);
  };

  useEffect(() => {
    const flattenArrays = {
      prev: prevRows,
      current: betHistoryList
    };

    if (!compareArray(flattenArrays.prev, flattenArrays.current)) {
      setRows(flattenArrays.current);
    }
  });

  return (
    <Paper className={root}>
      <div className={tableWrapper}>
        <Table className={table}>
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">訂單號</TableCell>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">局號</TableCell>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">時間</TableCell>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">結果</TableCell>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">重播</TableCell>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">玩家</TableCell>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">主播</TableCell>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">玩法</TableCell>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">總投注</TableCell>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">派彩</TableCell>
              <TableCell classes={{ root: cellRoot }} component="th" scope="row" align="center">狀態</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              const betHistoryClasses = classNames.bind(classes);
              const profitClasses = betHistoryClasses({
                profitClass: row.profit > 0,
                lossClass: row.profit < 0
              });

              return (
                <TableRow key={row.billno}>
                  <TableCell classes={{ root: cellRoot }} className={cellWidth} align="center">{row.billno}</TableCell>
                  <TableCell classes={{ root: cellRoot }} className={cellWidth} align="center">{row.gmcode}</TableCell>
                  <TableCell classes={{ root: cellRoot }} className={cellWidth} align="center">
                    <Moment format="YYYY-MM-DD HH:mm:ss">
                      {row.betTime * 1000}
                    </Moment>
                  </TableCell>
                  <TableCell classes={{ root: cellRoot }} align="center">庄 {row.bankerVal} 閑 {row.playerVal}</TableCell>
                  <TableCell classes={{ root: cellRoot }} align="center"><AudioButton gmcode={row.gmcode} toggleToast={toggleToast} setToastMessage={setToastMessage} setToastVariant={setToastVariant} /></TableCell>
                  <TableCell classes={{ root: cellRoot }} align="center">{row.name}</TableCell>
                  <TableCell classes={{ root: cellRoot }} align="center">-</TableCell>
                  <TableCell classes={{ root: cellRoot }} align="center">{getPlayType(row.playtype)}</TableCell>
                  <TableCell classes={{ root: cellRoot }} align="center">{formatAmount(row.amount)}</TableCell>
                  <TableCell classes={{ root: cellRoot }} className={profitClasses} align="center">{row.profit > 0 ? '+' : ''}{formatAmount(row.profit)}</TableCell>
                  <TableCell classes={{ root: cellRoot }} align="center">{row.flag === 0 ? '未派彩' : '已派彩'}</TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={rows.length}
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
  );
};

BetHistory.prototype = {
	classes: PropTypes.object.isRequired
};

const StyledBetHistory = withStyles(styles)(BetHistory);

const mapStateToProps = state => {
  const { betHistory } = state.data;

  return ({
    betHistory
  });
};

const mapDispatchToProps = dispatch => ({
  toggleToast: toggle => dispatch(toggleToast(toggle)),
  setToastMessage: message => dispatch(setToastMessage(message)),
  setToastVariant: variant => dispatch(setToastVariant(variant))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledBetHistory);