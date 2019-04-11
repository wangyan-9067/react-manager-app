import {
	SET_TABLE_LIST,
	SET_KICK_OUT_CLIENT
} from '../types';
  
const initialState = {
	tableList: [],
	clientToKickOut: {
		vid: '',
		clientName: ''
	}
};

export default function data(state = initialState, action) {
	switch (action.type) {
		case SET_TABLE_LIST:
			let newTable;
			const table = action.table;
			const newState = Object.assign({}, state);
			const newTableList = newState.tableList;
			const targetIndex = newTableList.findIndex((item) => item.vid === table.vid);

			if (targetIndex > -1) {
				newTable = { ...newTableList[targetIndex], ...table };
				newTableList[targetIndex] = newTable;
			} else {
				newTableList.push(table);
			}

			return {
				...state,
				tableList: newTableList
			};

		case SET_KICK_OUT_CLIENT:
			const clientToKickOut = {
				vid: action.data.vid,
				clientName: action.data.clientName
			};
			return { ...state, clientToKickOut };

    default:
    	return state;
	}
};
  