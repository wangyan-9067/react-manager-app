import {
	SET_VOICE_APP_ID,
	SET_CHANNEL_LIST,
	SET_CURRENT_CHANNEL_ID,
	SET_CHANNEL_JOIN_STATUS
} from '../types';

export const setVoiceAppId = id => ({ type: SET_VOICE_APP_ID, id });
export const setChannelList = list => ({ type: SET_CHANNEL_LIST, list});
export const setCurrentChannelId = id => ({ type: SET_CURRENT_CHANNEL_ID, id });
export const setChannelJoinStatus = code => ({ type: SET_CHANNEL_JOIN_STATUS, code });