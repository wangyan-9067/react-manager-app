import {
	SET_TABLE_LIST
} from '../types';
  
const initialState = {
	tableList: []
};

export default function data(state = initialState, action) {
	switch (action.type) {
		case SET_TABLE_LIST:
			const table = action.table;
			const newState = { ...state };
			const newTableList = newState.tableList;

			const targetIndex = newTableList.findIndex((item, index) => {
				if (item.vid === table.vid) {
					return index;
				}
			});

			if (targetIndex > -1) {
				newTableList[targetIndex] = table;
			} else {
				newTableList.push(table);
			}

			return { 
				...state,
				tableList: newTableList
			};

    default:
    	return state;
	}
};
  