import {
	SET_VOICE_APP_ID,
	SET_CHANNEL_LIST,
	SET_CURRENT_CHANNEL_ID,
	SET_CHANNEL_JOIN_STATUS
} from '../types';
  
const initialState = {
	voiceAppId: null,
	channelList: [],
	currentChannelId: null,
	channelJoinStatus: null
};

export default function voice(state = initialState, action) {
	switch (action.type) {
		case SET_VOICE_APP_ID:
			const voiceAppId = action.id;
			return { ...state, voiceAppId };

		case SET_CHANNEL_LIST:
			const channelList = action.list;
			return { ...state, channelList };

		case SET_CURRENT_CHANNEL_ID:
			const currentChannelId = action.id;
			return { ...state, currentChannelId };

		case SET_CHANNEL_JOIN_STATUS:
			const channelJoinStatus = action.code;
			return { ...state, channelJoinStatus };
    default:
    	return state;
	}
};
  