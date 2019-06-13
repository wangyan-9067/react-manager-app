import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import * as RTC from 'cube-rtc';

import VoiceSocket from './VoiceSocket';
import { store } from '../../store';
import {
    toggleToast,
    setIsUserAuthenticated,
    setToastMessage,
    setToastVariant,
    setToastDuration,
    toggleDialog
} from '../../actions/app';
import {
    setVoiceAppId,
    setUserLevel,
    setChannelList,
    setIsAnchorCall,
    setIncomingCallCount,
    setChannelJoinStatus,
    setIsAnswerCall,
    setWaitingList,
    setAnchorList,
    setDelegatorList,
    setAnchorsOnDutyList,
    setManagerList,
    setCurrentChannelId
} from '../../actions/voice';
import * as PROTOCOL from '../../protocols';
import * as CONSTANTS from '../../constants';
import langConfig from '../../languages/zh-cn.json';
import dataAPI from '../Data/dataAPI';
import { isObject } from '../../helpers/utils';
import { reset } from '../../helpers/appUtils';

class VoiceAPI {
    socket;

    constructor() {
        this.socket = new VoiceSocket();

        this.socket.addEventListener(Socket.EVENT_OPEN, this.onVoiceSocketOpen);
        this.socket.addEventListener(Socket.EVENT_PACKET, this.onVoiceSocketPacket);
        this.socket.addEventListener(Socket.EVENT_CLOSE, this.onVoiceSocketClose);
        this.socket.addEventListener(Socket.EVENT_DIE, this.onVoiceSocketClose);
    }

    connect() {
        this.socket.autoConnect();
    }

    close() {
        this.socket.close();
    }

    isOpen() {
        return this.socket.isOpen();
    }

    onVoiceSocketOpen() {
        store.dispatch(toggleToast(false));

        if (store.getState().managerCredential) {
            const { managerLoginname, managerPassword } = store.getState().managerCredential;

            this.login(managerLoginname, managerPassword);
        }
    }

    onVoiceSocketClose() {
        RTC.leaveRoom();
        reset();
    }

    async onVoiceSocketPacket(evt) {
        if (evt.$type !== Socket.EVENT_PACKET) {
            return;
        }

        console.log('[VoiceSocket]', evt.data);

        const { SUCCESS, REPEAT_LOGIN, DELEGATOR_NOT_IN_LINE, ERR_PWD_ERROR, ERR_NO_USER, DELEGATOR_HAS_TOKEN } = CONSTANTS.RESPONSE_CODES;
        const { CONNECTED, CONNECTING } = CONSTANTS.USER_STATE;
        const { ADD_ANCHOR, ADD_MANAGER } = CONSTANTS.MANAGER_ACTION_TYPE;
        const { isAnswerCall, currentChannelId, formValues, managerAction } = store.getState().voice;

        switch (evt.data.respId) {
            case PROTOCOL.MANAGER_LOGIN_R:
                const { code: loginStatus } = evt.data;

                if (loginStatus === SUCCESS) {
                    setVoiceAppId(evt.data.voiceAppId);
                    setUserLevel(evt.data.level);
                    RTC.init(evt.data.voiceAppId);

                    this.getAnchorList();
                    this.getAnchorsDutyList();
                    this.getManagerList();
                    this.getDelegatorList();

                    dataAPI.connect();
                } else {
                    switch (loginStatus) {
                        case REPEAT_LOGIN:
                            setToastMessage(langConfig.ERROR_MESSAGES.REPEAT_LOGIN);
                            break;
                        case ERR_PWD_ERROR:
                            setToastMessage(langConfig.ERROR_MESSAGES.PWD_ERROR);
                            break;
                        case ERR_NO_USER:
                            setToastMessage(langConfig.ERROR_MESSAGES.NO_USER);
                            break;

                        default:
                            setToastMessage(langConfig.ERROR_MESSAGES.VOICE_SERVER_LOGIN_FAIL.replace("{loginStatus}", loginStatus));
                            break;
                    }
                    setIsUserAuthenticated(false);
                    setToastVariant('error');
                    setToastDuration(null);
                    toggleToast(true);
                    reset();
                }
                break;

            case PROTOCOL.MANAGER_KICKOUT_R:
                const { code: kickoutStatus } = evt.data;

                setIsUserAuthenticated(false);
                setToastMessage(kickoutStatus === REPEAT_LOGIN ? langConfig.ERROR_MESSAGES.REPEAT_LOGIN : `Manager get kickedout ${kickoutStatus}`);
                setToastVariant('error');
                setToastDuration(null);
                toggleToast(true);
                reset();
                break;

            case PROTOCOL.CHANNEL_LIST_R:
                let callCnt = 0;
                let currentChannel;
                let channelList = evt.data.channelList;

                setChannelList(channelList);

                if (isAnswerCall) {
                    currentChannel = channelList.find(channel => channel.channelId === currentChannelId);

                    if (
                        isObject(currentChannel) &&
                        currentChannel.anchorName &&
                        (currentChannel.anchorState === CONNECTING || currentChannel.anchorState === CONNECTED)) {
                        setIsAnchorCall(true);
                    }
                }

                channelList.forEach(channel => {
                    const { clientName, anchorName, clientState, anchorState, managerName } = channel;
                    const isCallingManager = CONSTANTS.CALLING_MANAGER_STATES.findIndex(state => state === anchorState) !== -1;
                    const clientConnecting = clientName && !anchorName && clientState === CONNECTING && !managerName;
                    const anchorConnecting = clientName && anchorName && isCallingManager && anchorState === CONNECTING && !managerName;
                    const clientDealIn = clientName && !anchorName && clientState === CONNECTED & !managerName;
                    const anchorDealIn = clientName && anchorName && isCallingManager & !managerName;

                    if (clientConnecting || anchorConnecting || clientDealIn || anchorDealIn) {
                        callCnt++;
                    }
                });

                setIncomingCallCount(callCnt);
                break;

            case PROTOCOL.CHANNEL_JOIN_R:
                const { code: joinStatus } = evt.data;

                setChannelJoinStatus(joinStatus);
                setIsAnswerCall(joinStatus === 0 ? true : false);

                if (joinStatus === SUCCESS) {
                    await RTC.joinRoom(currentChannelId.toString(), store.getState().voice.voiceAppId);
                    this.sendManagerAction(CONSTANTS.MANAGER_ACTIONS.JOIN_CHANNEL, currentChannelId);
                }
                break;

            case PROTOCOL.MANAGER_ACTION_R:
                const { code: actionStatus } = evt.data;
                const { LEAVE_CHANNEL, KICKOUT_CLIENT, BLACKLIST_CLIENT } = CONSTANTS.MANAGER_ACTIONS;

                if (actionStatus === SUCCESS) {
                    switch (evt.data.action) {
                        case LEAVE_CHANNEL:
                        case KICKOUT_CLIENT:
                        case BLACKLIST_CLIENT:
                            RTC.leaveRoom();
                            setIsAnswerCall(false);
                            break;

                        default:
                            break;
                    }
                } else {
                    setToastMessage(langConfig.ERROR_MESSAGES.FAIL_MANAGER_ACTION.replace("{actionStatus}", actionStatus));
                    setToastVariant('error');
                    toggleToast(true);
                }
                break;

            case PROTOCOL.WAITING_LIST_R:
                setWaitingList(evt.data.delegatorList);
                break;

            case PROTOCOL.ANCHOR_ALL_QUERY_R:
                setAnchorList(evt.data.allAnchorsList);
                break;

            case PROTOCOL.ANCHOR_ADD_R:
                const { code: anchorAddStatus } = evt.data;
                let functionToExecute;

                if (anchorAddStatus !== SUCCESS) {
                    setToastMessage(langConfig.ERROR_MESSAGES.VOICE_SERVER_FAIL_ANCHOR_OPERATION.replace("{managerAction}", managerAction === ADD_ANCHOR ? langConfig.BUTTON_LABEL.ADD : langConfig.BUTTON_LABEL.EDIT).replace("{anchorAddStatus}", anchorAddStatus));
                    setToastVariant('error');
                    toggleToast(true);
                } else {
                    functionToExecute = managerAction === ADD_ANCHOR ? dataAPI.addAnchorToDataServer : dataAPI.updateAnchorToDataServer;
                    functionToExecute(formValues.loginname, formValues.password, formValues.nickname, formValues.iconUrl, 0);
                }
                break;

            case PROTOCOL.ANCHOR_DELETE_R:
                const { code: anchorDeleteStatus } = evt.data;

                if (anchorDeleteStatus !== SUCCESS) {
                    toggleDialog(false);
                    setToastMessage(langConfig.ERROR_MESSAGES.VOICE_SERVER_FAIL_DELETE_ANCHOR.replace("{anchorDeleteStatus}", anchorDeleteStatus));
                    setToastVariant('error');
                    toggleToast(true);
                } else {
                    toggleDialog(false);
                    dataAPI.deleteAnchorFromDataServer(formValues.loginname);
                }
                break;

            case PROTOCOL.ANCHORS_ON_DUTY_R:
                setAnchorsOnDutyList(evt.data.anchorsOnDutyList);
                break;

            case PROTOCOL.MANAGER_ALL_QUERY_R:
                setManagerList(evt.data.allManagersList);
                break;

            case PROTOCOL.MANAGER_ADD_R:
                const { code: managerAddStatus } = evt.data;

                if (managerAddStatus !== SUCCESS) {
                    setToastMessage(langConfig.ERROR_MESSAGES.VOICE_SERVER_FAIL_MANAGER_OPERATION.replace("{managerAction}", managerAction === ADD_MANAGER ? langConfig.BUTTON_LABEL.ADD : langConfig.BUTTON_LABEL.EDIT).replace("{managerAddStatus}", managerAddStatus));
                    setToastVariant('error');
                    toggleToast(true);
                } else {
                    functionToExecute = managerAction === ADD_MANAGER ? dataAPI.addManagerToDataServer : dataAPI.updateManagerToDataServer;
                    functionToExecute(formValues.loginname, formValues.password, formValues.nickname, formValues.iconUrl, formValues.level);
                    this.getManagerList();
                }
                break;

            case PROTOCOL.MANAGER_DELETE_R:
                const { code: managerDeleteStatus } = evt.data;

                if (managerDeleteStatus !== SUCCESS) {
                    toggleDialog(false);
                    setToastMessage(langConfig.ERROR_MESSAGES.VOICE_SERVER_FAIL_DELETE_MANAGER.replace("{managerDeleteStatus}", managerDeleteStatus));
                    setToastVariant('error');
                    toggleToast(true);
                } else {
                    toggleDialog(false);
                    dataAPI.deleteManagerFromDataServer(formValues.loginname);
                }
                break;

            case PROTOCOL.ASSIGN_TOKEN_TO_DELEGATOR_R:
                const { code: assignTokenStatus } = evt.data;

                if (assignTokenStatus === DELEGATOR_NOT_IN_LINE) {
                    setToastMessage(langConfig.ERROR_MESSAGES.DELEGATOR_IS_OFFLINE);
                    setToastVariant('error');
                    toggleToast(true);
                } else if (assignTokenStatus !== SUCCESS) {
                    setToastMessage(langConfig.ERROR_MESSAGES.FAIL_ASSIGN_TOKEN.replace("{assignTokenStatus}", assignTokenStatus));
                    setToastVariant('error');
                    toggleToast(true);
                }
                break;

            case PROTOCOL.KICK_DELEGATOR_R:
                const { code: kickDelegatorStatus } = evt.data;

                if (kickDelegatorStatus !== SUCCESS) {
                    setToastMessage(langConfig.ERROR_MESSAGES.FAIL_KICKOUT_DELEGATOR.replace("{kickDelegatorStatus}", kickDelegatorStatus));
                    setToastVariant('error');
                    toggleToast(true);
                }
                break;

            case PROTOCOL.QUERY_ALL_DELEGATOR_R:
                setDelegatorList(evt.data.delegatorList);
                break;

            case PROTOCOL.ADD_DELEGATOR_R:
                const { code: addDelegatorStatus } = evt.data;

                if (addDelegatorStatus !== SUCCESS) {
                    setToastMessage(langConfig.ERROR_MESSAGES.FAIL_ADD_DELEGATOR.replace("{addDelegatorStatus}", addDelegatorStatus));
                    setToastVariant('error');
                    toggleToast(true);
                } else {
                    this.getDelegatorList();
                }
                break;

            case PROTOCOL.DELETE_DELEGATOR_R:
                const { code: deleteDelegatorStatus } = evt.data;

                if (deleteDelegatorStatus === DELEGATOR_HAS_TOKEN) {
                    toggleDialog(false);
                    setToastMessage(langConfig.ERROR_MESSAGES.DELEGATOR_HAS_TOKEN);
                    setToastVariant('error');
                    toggleToast(true);
                } else if (deleteDelegatorStatus !== SUCCESS) {
                    toggleDialog(false);
                    setToastMessage(langConfig.ERROR_MESSAGES.FAIL_DELETE_DELEGATOR.replace("{deleteDelegatorStatus}", deleteDelegatorStatus));
                    setToastVariant('error');
                    toggleToast(true);
                } else {
                    toggleDialog(false);
                    this.getDelegatorList();
                }
                break;

            default:
                break;
        }
    }

    login(username, password) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.MANAGER_LOGIN, bytes => {
            bytes.writeBytes(Socket.stringToBytes(username, CONSTANTS.VALUE_LENGTH.LOGIN_NAME));
            bytes.writeBytes(Socket.stringToBytes(password, CONSTANTS.VALUE_LENGTH.PASSWORD));
        }));
    }

    logout() {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.MANAGER_LOGOUT));
    }

    getAnchorList() {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.ANCHOR_ALL_QUERY_REQ));
    }

    getAnchorsDutyList() {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.ANCHORS_ON_DUTY_REQUEST));
    }

    getManagerList() {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.MANAGER_ALL_QUERY_REQ));
    }

    getDelegatorList() {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.QUERY_ALL_DELEGATOR));
    }

    sendManagerAction(action, channelId) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.MANAGER_ACTION, bytes => {
            bytes.writeUnsignedInt(action);
            bytes.writeUnsignedInt(channelId);
        }));
    }

    assignTableToChannel(channelId, vid) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.ASSIGN_TABLE_TO_CHANNEL, bytes => {
            bytes.writeUnsignedInt(channelId);
            bytes.writeBytes(Socket.stringToBytes(vid, CONSTANTS.VALUE_LENGTH.VID));
        }));
    }

    kickoutClient(channelId) {
        this.sendManagerAction(CONSTANTS.MANAGER_ACTIONS.KICKOUT_CLIENT, channelId);
    }

    blacklistClient(channelId) {
        this.sendManagerAction(CONSTANTS.MANAGER_ACTIONS.BLACKLIST_CLIENT, channelId);
    }

    joinChannel(channelId) {
        setCurrentChannelId(channelId);

        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CHANNEL_JOIN, bytes => {
            bytes.writeUnsignedInt(channelId);
        }));
    }

    leaveChannel(channelId) {
        this.sendManagerAction(CONSTANTS.MANAGER_ACTIONS.LEAVE_CHANNEL, channelId);
    }

    toggleMuteChannel(channelId, isAnchor, muteState) {
        const { MUTE_ANCHOR, UNMUTE_ANCHOR, MUTE_CLIENT, UNMUTE_CLIENT } = CONSTANTS.MANAGER_ACTIONS;
        const { MUTE } = CONSTANTS.MUTE_STATE;
        let action;

        if (isAnchor) {
            action = muteState === MUTE ? MUTE_ANCHOR : UNMUTE_ANCHOR;
        } else {
            action = muteState === MUTE ? MUTE_CLIENT : UNMUTE_CLIENT;
        }

        this.sendManagerAction(action, channelId);
    }

    setAnchorsDuty(anchorList) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.ANCHORS_ON_DUTY_UPDATE, bytes => {
            if (Array.isArray(anchorList) && anchorList.length > 0) {
                bytes.writeUnsignedInt(anchorList.length);

                for (let i = 0; i < anchorList.length; i++) {
                    bytes.writeBytes(Socket.stringToBytes(anchorList[i], CONSTANTS.VALUE_LENGTH.LOGIN_NAME));
                }
            }
        }));
    }

    addAnchor(loginName, password, nickName, url) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.ANCHOR_ADD_REQ, bytes => {
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.VALUE_LENGTH.LOGIN_NAME));
            bytes.writeBytes(Socket.stringToBytes(password, CONSTANTS.VALUE_LENGTH.PASSWORD));
            bytes.writeBytes(Socket.stringToBytes(nickName, CONSTANTS.VALUE_LENGTH.NICK_NAME));
            bytes.writeUnsignedInt(url.length);
            bytes.writeBytes(Socket.stringToBytes(url, url.length));
        }));
    }

    deleteAnchorz(loginName) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.ANCHOR_DELETE_REQ, bytes => {
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.VALUE_LENGTH.LOGIN_NAME));
        }));
    }

    addManager(loginName, password, nickName, url, flag) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.MANAGER_ADD_REQ, bytes => {
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.VALUE_LENGTH.LOGIN_NAME));
            bytes.writeBytes(Socket.stringToBytes(password, CONSTANTS.VALUE_LENGTH.PASSWORD));
            bytes.writeBytes(Socket.stringToBytes(nickName, CONSTANTS.VALUE_LENGTH.NICK_NAME));
            bytes.writeUnsignedInt(url.length);
            bytes.writeBytes(Socket.stringToBytes(url, url.length));
            bytes.writeByte(flag);
        }));
    }

    deleteManager(loginName) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.MANAGER_DELETE, bytes => {
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.VALUE_LENGTH.LOGIN_NAME));
        }));
    }

    addDelegator(loginName, password, tel) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.ADD_DELEGATOR, bytes => {
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.VALUE_LENGTH.LOGIN_NAME));
            bytes.writeBytes(Socket.stringToBytes(password, CONSTANTS.VALUE_LENGTH.PASSWORD));
            bytes.writeBytes(Socket.stringToBytes(tel, CONSTANTS.VALUE_LENGTH.TEL));
        }));
    }

    deleteDelegator(loginName) {
        this.writeBytes(Socket.createCMD(PROTOCOL.DELETE_DELEGATOR, bytes => {
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.VALUE_LENGTH.LOGIN_NAME));
        }));
    }

    assignTokenToDelegator(delegatorName) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.ASSIGN_TOKEN_TO_DELEGATOR, bytes => {
            bytes.writeBytes(Socket.stringToBytes(delegatorName, CONSTANTS.VALUE_LENGTH.LOGIN_NAME));
        }));
    }

    kickDelegator(delegatorName) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.KICK_DELEGATOR, bytes => {
            bytes.writeBytes(Socket.stringToBytes(delegatorName, CONSTANTS.VALUE_LENGTH.LOGIN_NAME));
        }));
    }
}

const voiceAPI = new VoiceAPI();

export default voiceAPI;