import {
    SET_VOICE_APP_ID,
    SET_CHANNEL_LIST,
    SET_CURRENT_CHANNEL_ID,
    SET_IS_ANSWER_CALL,
    SET_IS_ANCHOR_CALL,
    SET_WAITING_LIST,
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
    incomingCallCount: 0
};

export default function voice(state = initialState, action) {
    switch (action.type) {
        case SET_VOICE_APP_ID:
            const voiceAppId = action.id;
            return { ...state, voiceAppId };

        case SET_CHANNEL_LIST:
            // const channelList = sortChannelList(action.list);
            return { ...state, channelList: action.list };

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

        case SET_ANCHOR_LIST:
            const anchorList = action.list;
            return { ...state, anchorList };

        case SET_MANAGER_ACTION:
            const managerAction = action.action;
            return { ...state, managerAction };

        case SET_ANCHORS_ON_DUTY_LIST:
            const anchorsOnDutyList = action.list;
            return { ...state, anchorsOnDutyList };

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

function sortChannelList(channelList) {
    channelList.sort(function(a, b) {
        if (a.vid && b.vid) {
            return a.vid > b.vid ? 1 : -1;
        } else if (a.vid || b.vid) {
            return a.vid ? -1 : 1;
        } else {
            return 0;
        }
    });

    return channelList;
}