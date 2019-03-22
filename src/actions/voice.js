import { SET_VOICE_APP_ID, SET_CHANNEL_LIST } from '../types';

export const setVoiceAppId = id => ({ type: SET_VOICE_APP_ID, id });
export const setChannelList = list => ({ type: SET_CHANNEL_LIST, list});