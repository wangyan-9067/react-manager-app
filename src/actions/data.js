import {
	SET_TABLE_LIST,
	SET_KICK_OUT_CLIENT
} from '../types';

export const setTableList = table => ({ type: SET_TABLE_LIST, table });
export const setKickoutClient = data => ({ type: SET_KICK_OUT_CLIENT, data });