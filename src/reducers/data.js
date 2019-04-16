import {
	SET_TABLE_LIST,
	SET_KICK_OUT_CLIENT,
	SET_BET_HISTORY
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
	}
};

export default function data(state = initialState, action) {
	switch (action.type) {
		case SET_TABLE_LIST:
			const tableToUpdate = action.table;
			const targetIndex = state.tableList.findIndex((item) => item.vid === tableToUpdate.vid);

			if (targetIndex > -1) {
				// Update existing table
				const updatedTableList = state.tableList.map(table => {
					if (table.vid === tableToUpdate.vid){
						return { ...table, ...tableToUpdate };
					}
					return table;
				})

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

    default:
    	return state;
	}
};
  