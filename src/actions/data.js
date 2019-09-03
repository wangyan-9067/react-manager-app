import {
	SET_TABLE_LIST,
	SET_KICK_OUT_CLIENT,
	SET_BET_HISTORY,
	SET_TABLE_LIMIT,
	SET_BET_HISTORY_INFO,
	SET_BET_HISTORY_USER_PID,
	SET_BET_HISTORY_TABLE_PAGE_INDEX,
	SET_BET_HISTORY_SEARCH_FIELDS,
	UPDATE_PLAYER_BALANCE,
  SET_ANCHOR_BET,
	SET_TABLE_JETTON,
	RESET_JETTON_BETS
} from '../types';

export const setTableList = table => ({ type: SET_TABLE_LIST, table });
export const setKickoutClient = data => ({ type: SET_KICK_OUT_CLIENT, data });
export const setBetHistory = (keyField, payload) => ({ type: SET_BET_HISTORY, keyField, payload });
export const setTableLimit = (vid, data) => ({ type: SET_TABLE_LIMIT, vid, data });
export const setBetHistoryInfo = info => ({ type: SET_BET_HISTORY_INFO, info });
export const setBetHistoryUserPid = pid => ({ type: SET_BET_HISTORY_USER_PID, pid });
export const setBetHistoryTablePageIndex = index => ({ type: SET_BET_HISTORY_TABLE_PAGE_INDEX, index });
export const setBetHistorySearchFields = fields => ({ type: SET_BET_HISTORY_SEARCH_FIELDS, fields });
export const setPlayerBalance = data => ({ type: UPDATE_PLAYER_BALANCE, data });
export const setAnchorBet = data => ( { type: SET_ANCHOR_BET, data });
export const setTableJetton = data => ( { type: SET_TABLE_JETTON, data });
export const resetJettonAndBets = vid => ({ type: RESET_JETTON_BETS, vid });