import {
	SET_TABLE_LIST,
	SET_KICK_OUT_CLIENT,
	SET_BET_HISTORY,
	SET_TABLE_LIMIT
} from '../types';

export const setTableList = table => ({ type: SET_TABLE_LIST, table });
export const setKickoutClient = data => ({ type: SET_KICK_OUT_CLIENT, data });
export const setBetHistory = (keyField, payload) => ({ type: SET_BET_HISTORY, keyField, payload });
export const setTableLimit = (vid, data) => ({ type: SET_TABLE_LIMIT, vid, data });