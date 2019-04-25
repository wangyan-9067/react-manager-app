import {
	SET_VOICE_APP_ID,
	SET_CHANNEL_LIST,
	SET_CURRENT_CHANNEL_ID,
	SET_CHANNEL_JOIN_STATUS,
	SET_IS_ANSWER_CALL,
	SET_IS_ANCHOR_CALL,
	SET_WAITING_LIST,
	SET_ANCHOR_LIST,
	SET_MANAGER_ACTION,
	SET_ANCHORS_ON_DUTY_LIST,
	SET_MANAGER_LIST,
	SET_MANAGER_LEVEL,
	SET_DELEGATOR_LIST,
	SET_FORM_VALUES
} from '../types';

export const setVoiceAppId = id => ({ type: SET_VOICE_APP_ID, id });
export const setChannelList = list => ({ type: SET_CHANNEL_LIST, list});
export const setCurrentChannelId = id => ({ type: SET_CURRENT_CHANNEL_ID, id });
export const setChannelJoinStatus = code => ({ type: SET_CHANNEL_JOIN_STATUS, code });
export const setIsAnswerCall = answer => ({ type: SET_IS_ANSWER_CALL, answer });
export const setIsAnchorCall = isAnchor => ({ type: SET_IS_ANCHOR_CALL, isAnchor });
export const setWaitingList = list => ({ type: SET_WAITING_LIST, list });
export const setAnchorList = list => ({ type: SET_ANCHOR_LIST, list });
export const setManagerAction = action => ({ type: SET_MANAGER_ACTION, action });
export const setAnchorsOnDutyList = list => ({ type: SET_ANCHORS_ON_DUTY_LIST, list });
export const setManagerList = list => ({ type: SET_MANAGER_LIST, list });
export const setUserLevel = level => ({ type: SET_MANAGER_LEVEL, level });
export const setDelegatorList = list => ({ type: SET_DELEGATOR_LIST, list });
export const setFormValues = values => ({type: SET_FORM_VALUES, values});