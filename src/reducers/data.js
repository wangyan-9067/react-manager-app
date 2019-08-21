import {
    SET_TABLE_LIST,
    SET_KICK_OUT_CLIENT,
    SET_BET_HISTORY,
    RESET_ACTION,
    SET_TABLE_LIMIT,
    SET_BET_HISTORY_INFO,
    SET_BET_HISTORY_USER_PID,
    SET_BET_HISTORY_TABLE_PAGE_INDEX,
    SET_BET_HISTORY_SEARCH_FIELDS,
    UPDATE_PLAYER_BALANCE,
    SET_ANCHOR_BET,
    SET_TABLE_JETTON
} from '../types';

const initialState = {
    tableList: [],
    clientToKickOut: {
        vid: '',
        clientName: ''
    },
    betHistory: {
        byId: [],
        byHash: {}
    },
    tableLimit: {
        byId: [],
        byHash: {}
    },
    betHistoryInfo: {
        total: 0,
        numPerPage: 0
    },
    betHistoryUserPid: '',
    betHistoryTablePageIndex: 0,
    betHistoryTableSearchFields: {
        loginname: '',
        gmCode: ''
    },
    player: {
        username: '',
        balance: 0
    },
    anchorBets: {},
    jettons: {}
};

export default function data(state = initialState, action) {
    console.log(state, action)
    switch (action.type) {
        case SET_TABLE_LIST:
            const tableToUpdate = action.table;
            const targetIndex = state.tableList.findIndex((item) => item.vid === tableToUpdate.vid);

            if (targetIndex > -1) {
                // Update existing table
                const updatedTableList = state.tableList.map(table => {
                    if (table.vid === tableToUpdate.vid) {
                        return { ...table, ...tableToUpdate };
                    }
                    return table;
                });

                return {
                    ...state,
                    tableList: updatedTableList
                };
            } else {
                // Add new table
                return {
                    ...state,
                    tableList: [...state.tableList, tableToUpdate]
                };
            }

        case SET_KICK_OUT_CLIENT:
            const clientToKickOut = {
                vid: action.data.vid,
                clientName: action.data.clientName
            };
            return { ...state, clientToKickOut };

        case SET_BET_HISTORY:
            const { keyField, payload: historyData } = action;
            const byId = [];
            const byHash = {};

            if (Array.isArray(historyData) && historyData.length > 0 && keyField) {
                for (const value of historyData) {
                    byId.push(value[keyField]);
                    byHash[value[keyField]] = value;
                }
            }

            return {
                ...state,
                betHistory: {
                    byId,
                    byHash
                }
            };

        case SET_TABLE_LIMIT:
            const { data: tableLimitData, vid: tableId } = action;
            const tableIds = [];
            const tableLimitList = {};
            let tempTableLimit = state.tableLimit;
            if (Array.isArray(tableLimitData) && tableLimitData.length > 0) {
                tableIds.push(tableId);
                tempTableLimit.byId.push(tableId);
                tempTableLimit.byHash[tableId] = tableLimitData;
                tableLimitList[tableId] = tableLimitData;
            }
            return {
                ...state,
                tableLimit: tempTableLimit
            };

        case SET_BET_HISTORY_INFO:
            const betHistoryInfo = {
                total: parseInt(action.info.total),
                numPerPage: parseInt(action.info.numPerPage)
            };

            return { ...state, betHistoryInfo };

        case SET_BET_HISTORY_USER_PID:
            const betHistoryUserPid = action.pid;
            return { ...state, betHistoryUserPid };

        case SET_BET_HISTORY_TABLE_PAGE_INDEX:
            const betHistoryTablePageIndex = action.index;
            return { ...state, betHistoryTablePageIndex };

        case SET_BET_HISTORY_SEARCH_FIELDS:
            const betHistoryTableSearchFields = {
                loginname: action.fields.loginname,
                gmCode: action.fields.gmCode
            };
            return { ...state, betHistoryTableSearchFields };
        case UPDATE_PLAYER_BALANCE:        
            state.tableList.map(table => {
                if(table.tableOwner === action.data.username) {
                    table.account = action.data.balance;
                }
            })
            return {
                ...state, player: {
                    username: action.data.username,
                    balance: action.data.balance
                }
            };
        case RESET_ACTION:
            return initialState;
        case SET_ANCHOR_BET:
            let tempAnchorBets = state.anchorBets;
            tempAnchorBets[action.data.vid] = action.data;
            return { ...state, anchorBets: { ...tempAnchorBets} };
        case SET_TABLE_JETTON:
            let tempJettons = state.jettons;
            tempJettons[action.data.vid] = action.data;
            return { ...state, jettons: tempJettons };
        default:
            return state;
    }
};
