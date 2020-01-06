import moment from 'moment';

import { getLangConfig } from '../helpers/appUtils';
import {
    SET_VOICE_APP_ID,
    SET_CHANNEL_LIST,
    SET_CURRENT_CHANNEL_ID,
    SET_IS_ANSWER_CALL,
    SET_IS_ANCHOR_CALL,
    SET_WAITING_LIST,
    SET_VIP_WAITING_LIST,
    SET_ANCHOR_LIST,
    SET_MANAGER_ACTION,
    SET_ANCHORS_ON_DUTY_LIST,
    SET_MANAGER_LIST,
    SET_MANAGER_LEVEL,
    RESET_ACTION,
    SET_DELEGATOR_LIST,
    SET_FORM_VALUES,
    SET_INCOMING_CALL_COUNT
} from '../types';

const initialState = {
    voiceAppId: null,
    channelList: [],
    currentChannelId: null,
    isAnswerCall: false,
    isAnchorCall: null,
    waitingList: [],
    vipWaitingList: [],
    anchorList: [],
    managerAction: '',
    anchorsOnDutyList: [],
    managerList: [],
    managerLevel: 1,
    delegatorList: [],
    formValues: {
        loginname: '',
        nickname: '',
        password: '',
        iconUrl: '',
        level: '',
        tel: ''
    },
    incomingCallCount: 0,
    channelLogs: null
};

export default function voice(state = initialState, action) {
    switch (action.type) {
        case SET_VOICE_APP_ID:
            const voiceAppId = action.id;
            return { ...state, voiceAppId };

        case SET_CHANNEL_LIST: {
            const channelLogs = updateAnchorActionState(state.channelLogs, action.list);
            return { ...state, channelLogs: channelLogs, channelList: action.list };
        }

        case SET_CURRENT_CHANNEL_ID:
            const currentChannelId = action.id;
            return { ...state, currentChannelId };

        case SET_IS_ANSWER_CALL:
            const isAnswerCall = action.answer;
            return { ...state, isAnswerCall };

        case SET_IS_ANCHOR_CALL:
            const isAnchorCall = action.isAnchor;
            return { ...state, isAnchorCall };

        case SET_WAITING_LIST:
            const waitingList = action.list;
            return { ...state, waitingList };

        case SET_VIP_WAITING_LIST:
            const vipWaitingList = action.list;
            return { ...state, vipWaitingList };

        case SET_ANCHOR_LIST:
            const anchorList = action.list;
            return { ...state, anchorList };

        case SET_MANAGER_ACTION:
            const managerAction = action.action;
            return { ...state, managerAction };

        case SET_ANCHORS_ON_DUTY_LIST: {
            const anchorsOnDutyList = action.list;
            const channelLogs = updateAnchorOnlineState(state.channelLogs, anchorsOnDutyList);
            return { ...state, channelLogs: channelLogs, anchorsOnDutyList };
        }

        case SET_MANAGER_LIST:
            const managerList = action.list;
            return { ...state, managerList };

        case SET_MANAGER_LEVEL:
            return { ...state, managerLevel: action.level };

        case RESET_ACTION:
            return initialState;

        case SET_DELEGATOR_LIST:
            const delegatorList = action.list;
            return { ...state, delegatorList };

        case SET_FORM_VALUES:
            const { loginname, nickname, password, iconUrl, level, tel } = action.values;
            const formValues = {
                loginname,
                nickname,
                password,
                iconUrl,
                level,
                tel
            };

            return { ...state, formValues };

        case SET_INCOMING_CALL_COUNT:
            const incomingCallCount = action.count;
            return { ...state, incomingCallCount };

        default:
            return state;
    }
};

function updateAnchorActionState(channelLogs, channelList) {
    const langConfig = getLangConfig();
    const time = moment().format('LTS');

    if (!channelLogs) {
        channelLogs = {};

        for (let i = 0; i < channelList.length; i++) {
            let channel = channelList[i];

            channelLogs[channel.vid] = {
                vid: channel.vid,
                anchorName: channel.anchorName,
                anchorState: channel.anchorState,
                isAnchorOnline: null,
                messages: []
            };
        }
    } else {
        for (let i = 0; i < channelList.length; i++) {
            let channel = channelList[i];
            let vid = channel.vid;

            if (channelLogs[vid].anchorState !== channel.anchorState && (channel.anchorState > 2 || channelLogs[vid].anchorState > 2)) {
                channelLogs[vid] = {
                    ...channelLogs[vid],
                    anchorState: channel.anchorState,
                    messages: channel.anchorState > 2 ? channelLogs[vid].messages.concat([
                        langConfig.ANCHOR_LIST_LABEL.ANCHOR_CALLING_MANAGER.replace('{0}', channel.anchorName).replace('{1}', langConfig.TELEBET_TILE_LABEL.ANCHOR_STATE_ACTIONS[`REASON_${channel.anchorState}`]) + ' ' + time
                    ]) : channelLogs[vid].messages // if calling manager, add a log message; if reset state, no need to add message
                };
            }
        }
    }

    return channelLogs;
}

function updateAnchorOnlineState(channelLogs, anchorsOnDutyList) {
    const langConfig = getLangConfig();
    const time = moment().format('LTS');

    if (channelLogs) {
        for(let vid in channelLogs) {
            let anchor = anchorsOnDutyList.find(anchor => anchor.vid === vid);
            let channelLog = channelLogs[vid];

            if (channelLog.isAnchorOnline === null) {
                channelLogs[vid] = {
                    ...channelLog,
                    isAnchorOnline: !!anchor
                };
            } else if (channelLog.isAnchorOnline !== !!anchor) {
                channelLogs[vid] = {
                    ...channelLog,
                    anchorName: anchor ? anchor.anchorName : '',
                    isAnchorOnline: !!anchor,
                    messages: channelLog.isAnchorOnline === null ? channelLog.messages : channelLog.messages.concat([
                        langConfig.ANCHOR_LIST_LABEL[!!anchor ? "ANCHOR_LOGIN" : "ANCHOR_LOGOUT"].replace('{0}', channelLog.anchorName || anchor.anchorName).replace('{1}', vid) + ' ' + time
                    ]) // if new login, add a log message; if already login, no need to add message
                };
            }
        }
    }

    return channelLogs;
}