import {
	SET_VOICE_APP_ID,
	SET_CHANNEL_LIST,
	SET_CURRENT_CHANNEL_ID,
	SET_CHANNEL_JOIN_STATUS,
	SET_IS_ANSWER_CALL,
	SET_IS_ANCHOR_CALL,
	SET_WAITING_LIST
} from '../types';

export const setVoiceAppId = id => ({ type: SET_VOICE_APP_ID, id });
export const setChannelList = list => ({ type: SET_CHANNEL_LIST, list});
export const setCurrentChannelId = id => ({ type: SET_CURRENT_CHANNEL_ID, id });
export const setChannelJoinStatus = code => ({ type: SET_CHANNEL_JOIN_STATUS, code });
export const setIsAnswerCall = answer => ({ type: SET_IS_ANSWER_CALL, answer });
export const setIsAnchorCall = isAnchor => ({ type: SET_IS_ANCHOR_CALL, isAnchor });
export const setWaitingList = list => ({ type: SET_WAITING_LIST, list });