import { SET_VOICE_APP_ID, SET_CHANNEL_LIST } from '../types'
  
const initialState = {
	voiceAppId: null,
	channelList: []
};

export default function voice(state = initialState, action) {
	switch (action.type) {
		case SET_VOICE_APP_ID:
			const voiceAppId = action.id;
			return { ...state, voiceAppId };

		case SET_CHANNEL_LIST:
			const channelList = action.list;
			return { ...state, channelList };

    default:
    	return state;
	}
};
  