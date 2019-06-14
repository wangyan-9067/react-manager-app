import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

import DataSocket from './DataSocket';
import { store } from '../../store';
import {
    toggleToast,
    setIsUserAuthenticated,
    setToastMessage,
    setToastVariant,
    setToastDuration
} from '../../actions/app';
import { setTableList, setTableLimit, setPlayerBalance } from '../../actions/data';
import { setFormValues } from '../../actions/voice';
import * as PROTOCOL from '../../protocols';
import * as CONSTANTS from '../../constants';
import langConfig from '../../languages/zh-cn.json';
import { reset } from '../../helpers/appUtils';
import voiceAPI from '../Voice/voiceAPI';
import nullGateAPI from '../NullGate/nullGateAPI';

class DataAPI {
    socket;

    constructor() {
        this.socket = new DataSocket();

        this.socket.addEventListener(Socket.EVENT_OPEN, this.onDataSocketOpen);
        this.socket.addEventListener(Socket.EVENT_PACKET, this.onDataSocketPacket);
        this.socket.addEventListener(Socket.EVENT_CLOSE, this.onDataSocketClose);
        this.socket.addEventListener(Socket.EVENT_DIE, this.onDataSocketClose);
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

    onDataSocketOpen = () => {
        let { managerCredential } = store.getState().app;

        if (managerCredential) {
            this.login(managerCredential.managerLoginname, managerCredential.managerPassword);
        }
    }

    onDataSocketClose() {
        reset();
    }

    onDataSocketPacket = (evt) => {
        if (evt.$type !== Socket.EVENT_PACKET) {
            return;
        }

        console.log('[DataSocket]', evt.data);

        const { SUCCESS, ERR_NO_LOGIN } = CONSTANTS.GAME_SERVER_RESPONSE_CODES;
        const { tableList } = store.getState().data;
        const { currentChannelId, managerAction } = store.getState().voice;

        switch (evt.data.respId) {
            case PROTOCOL.CDS_OPERATOR_LOGIN_R:
                const { code: loginStatus } = evt.data;

                if (loginStatus !== SUCCESS) {
                    store.dispatch(setIsUserAuthenticated(false));
                    store.dispatch(setToastMessage(langConfig.ERROR_MESSAGES.DATA_SERVER_LOGIN_FAIL.replace("{loginStatus}", loginStatus)));
                    store.dispatch(setToastVariant('error'));
                    store.dispatch(setToastDuration(null));
                    store.dispatch(toggleToast(true));
                    reset();
                } else {
                    store.dispatch(toggleToast(false));
                    store.dispatch(setIsUserAuthenticated(true));
                    nullGateAPI.connect();
                }
                break;

            case PROTOCOL.CDS_CONTROL_REQ_VIDEO_RES:
                const initialTableData = evt.data.videoStatusList;

                if (Array.isArray(initialTableData)) {
                    initialTableData.forEach(table => {
                        let { vid, dealerName, gameCode, gmType, status } = table;

                        store.dispatch(setTableList({
                            vid,
                            dealerName,
                            gameCode,
                            gmType,
                            gameStatus: status
                        }));
                    });
                }
                break;

            case PROTOCOL.CDS_CLIENT_LIST:
                store.dispatch(setTableList({
                    vid: evt.data.vid,
                    seatedPlayerNum: evt.data.seatedPlayerNum,
                    tableOwner: evt.data.username,
                    account: evt.data.account
                }));
                break;

            case PROTOCOL.CDS_VIDEO_STATUS:
                store.dispatch(setTableList({
                    vid: evt.data.vid,
                    gameStatus: evt.data.gameStatus,
                    gameCode: evt.data.gmcode,
                    tableOwner: evt.data.username,
                    status: evt.data.videoStatus,
                    dealerName: evt.data.deal
                }));
                break;

            case PROTOCOL.CDS_CLIENT_ENTER_TABLE_NOTIFY:
                const currentTable = tableList.find(table => table.vid === evt.data.vid);
                store.dispatch(setTableList({
                    vid: evt.data.vid,
                    username: evt.data.username,
                    account: evt.data.currentAmount,
                    seatedPlayerNum: currentTable.seatedPlayerNum + 1
                }));
                break;

            case PROTOCOL.CDS_CLIENT_LEAVE_TABLE_NOTIFY:
                store.dispatch(setTableList({
                    vid: evt.data.vid,
                    dealerName: '',
                    gameCode: '',
                    gmType: '',
                    gameStatus: 0,
                    seatedPlayerNum: 0,
                    account: 0,
                    tableOwner: '',
                    status: 0
                }));
                store.dispatch(setTableLimit(evt.data.vid, []));
                break;

            case PROTOCOL.CDS_OPERATOR_CONTROL_CONTRACT_TABLE_R:
                const { code: assignTableStatus } = evt.data;

                if (assignTableStatus === SUCCESS) {
                    voiceAPI.assignTableToChannel(currentChannelId, evt.data.vid);
                } else {
                    store.dispatch(setToastMessage(langConfig.ERROR_MESSAGES.FAIL_ASSIGN_TABLE_TO_PLAYER_IMMEDIATE.replace("{assignTableStatus}", assignTableStatus)));
                    store.dispatch(setToastVariant('error'));
                    store.dispatch(toggleToast(true));
                }
                break;

            case PROTOCOL.CDS_OPERATOR_CONTROL_CONTRACT_TABLE_EBAC:
                store.dispatch(setToastMessage(langConfig.ERROR_MESSAGES.FAIL_ASSIGN_TABLE_TO_PLAYER.replace("{username}", evt.data.username)));
                store.dispatch(setToastVariant('error'));
                store.dispatch(setToastDuration(null));
                store.dispatch(toggleToast(true));
                break;

            case PROTOCOL.CDS_OPERATOR_CONTROL_KICKOUT_CLIENT_R:
                const { reason: kickoutReason } = evt.data;

                if (kickoutReason === SUCCESS || kickoutReason === ERR_NO_LOGIN) {
                    if (managerAction === CONSTANTS.MANAGER_ACTION_TYPE.KICKOUT_CLIENT) {
                        voiceAPI.kickoutClient(currentChannelId);
                    } else {
                        voiceAPI.blacklistClient(currentChannelId);
                    }
                } else {
                    store.dispatch(setToastMessage(langConfig.ERROR_MESSAGES.FAIL_KICKOUT_PLAYER.replace("{kickoutReason}", kickoutReason)));
                    store.dispatch(setToastVariant('error'));
                    store.dispatch(toggleToast(true));
                }
                break;

            case PROTOCOL.CDS_TABLE_LIMIT:
                store.dispatch(setTableLimit(evt.data.vid, evt.data.tableLimit));
                break;

            case PROTOCOL.CDS_ACTION_R:
                const { code: cdsActionStatus } = evt.data;
                let message = '';

                if (cdsActionStatus !== SUCCESS) {
                    // display error message
                    switch (evt.data.reqCmd) {
                        case PROTOCOL.CDS_ADD_ANCHOR:
                            message = langConfig.ERROR_MESSAGES.USER_OPERATION.ADD_ANCHOR;
                            break;

                        case PROTOCOL.CDS_UPDATE_ANCHOR:
                            message = langConfig.ERROR_MESSAGES.USER_OPERATION.EDIT_ANCHOR;
                            break;

                        case PROTOCOL.CDS_REMOVE_ANCHOR:
                            message = langConfig.ERROR_MESSAGES.USER_OPERATION.DELETE_ANCHOR;
                            break;

                        case PROTOCOL.CDS_ADD_MANAGER:
                            message = langConfig.ERROR_MESSAGES.USER_OPERATION.ADD_MANAGER;
                            break;

                        case PROTOCOL.CDS_UPDATE_MANAGER:
                            message = langConfig.ERROR_MESSAGES.USER_OPERATION.EDIT_MANAGER;
                            break;

                        case PROTOCOL.CDS_REMOVE_MANAGER:
                            message = langConfig.ERROR_MESSAGES.USER_OPERATION.DELETE_MANAGER;
                            break;

                        default:
                            break;
                    }

                    if (message) {
                        store.dispatch(setToastMessage(langConfig.ERROR_MESSAGES.USER_OPERATION_FAIL.replace("{message}", message).replace("{cdsActionStatus}", cdsActionStatus)));
                        store.dispatch(setToastVariant('error'));
                        store.dispatch(toggleToast(true));
                    }
                } else {
                    // retrieve latest list
                    switch (evt.data.reqCmd) {
                        case PROTOCOL.CDS_ADD_ANCHOR:
                        case PROTOCOL.CDS_UPDATE_ANCHOR:
                        case PROTOCOL.CDS_REMOVE_ANCHOR:
                            voiceAPI.getAnchorList();
                            break;

                        case PROTOCOL.CDS_ADD_MANAGER:
                        case PROTOCOL.CDS_UPDATE_MANAGER:
                        case PROTOCOL.CDS_REMOVE_MANAGER:
                            voiceAPI.getManagerList();
                            break;

                        default:
                            break;
                    }
                }

                store.dispatch(setFormValues({
                    loginname: '',
                    nickname: '',
                    password: '',
                    iconUrl: '',
                    level: '',
                    tel: ''
                }));
                break;

            case PROTOCOL.CDS_UPDATE_PLAYER_AMOUNT_R:
                store.dispatch(setPlayerBalance({
                    username: evt.data.username,
                    balance: evt.data.account
                }));
                break;

            default:
                break;
        }
    }

    login(username, password) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CDS_OPERATOR_LOGIN, bytes => {
            bytes.writeUnsignedShort();
            bytes.writeUnsignedShort();
            bytes.writeBytes(Socket.stringToBytes('', CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID));
            bytes.writeBytes(Socket.stringToBytes(username, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
            bytes.writeBytes(Socket.stringToBytes(password, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_PSW));
            bytes.writeUnsignedInt();
        }));
    }

    logout() {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CDS_OPERATOR_LOGOUT));
    }

    addAnchorToDataServer(loginName, password, nickName, url, flag) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CDS_ADD_ANCHOR, bytes => {
            bytes.writeUnsignedShort();
            bytes.writeUnsignedShort();
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
            bytes.writeBytes(Socket.stringToBytes(nickName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_NICK_NAME));
            bytes.writeBytes(Socket.stringToBytes(password, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_PSW));
            bytes.writeByte(flag);
            bytes.writeBytes(Socket.stringToBytes(url, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_URL));
        }));
    }

    updateAnchorToDataServer(loginName, password, nickName, url, flag) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CDS_UPDATE_ANCHOR, bytes => {
            bytes.writeUnsignedShort();
            bytes.writeUnsignedShort();
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
            bytes.writeBytes(Socket.stringToBytes(nickName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_NICK_NAME));
            bytes.writeBytes(Socket.stringToBytes(password, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_PSW));
            bytes.writeByte(flag);
            bytes.writeBytes(Socket.stringToBytes(url, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_URL));
        }));
    }

    deleteAnchorFromDataServer(loginName) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CDS_REMOVE_ANCHOR, bytes => {
            bytes.writeUnsignedShort();
            bytes.writeUnsignedShort();
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
        }));
    }

    addManagerToDataServer(loginName, password, nickName, url, flag) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CDS_ADD_MANAGER, bytes => {
            bytes.writeUnsignedShort();
            bytes.writeUnsignedShort();
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
            bytes.writeBytes(Socket.stringToBytes(nickName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_NICK_NAME));
            bytes.writeBytes(Socket.stringToBytes(password, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_PSW));
            bytes.writeByte(flag);
            bytes.writeBytes(Socket.stringToBytes(url, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_URL));
        }));
    }

    updateManagerToDataServer(loginName, password, nickName, url, flag) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CDS_UPDATE_MANAGER, bytes => {
            bytes.writeUnsignedShort();
            bytes.writeUnsignedShort();
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
            bytes.writeBytes(Socket.stringToBytes(nickName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_NICK_NAME));
            bytes.writeBytes(Socket.stringToBytes(password, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_PSW));
            bytes.writeByte(flag);
            bytes.writeBytes(Socket.stringToBytes(url, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_URL));
        }));
    }

    deleteManagerFromDataServer(loginName) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CDS_REMOVE_MANAGER, bytes => {
            bytes.writeUnsignedShort();
            bytes.writeUnsignedShort();
            bytes.writeBytes(Socket.stringToBytes(loginName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
        }));
    }

    assignTable(vid, clientName) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CDS_OPERATOR_CONTROL_CONTRACT_TABLE, bytes => {
            bytes.writeUnsignedShort();
            bytes.writeUnsignedShort();
            bytes.writeBytes(Socket.stringToBytes(vid, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID));
            bytes.writeBytes(Socket.stringToBytes(clientName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
            bytes.writeByte(CONSTANTS.CONTRACT_MODE.OWNER);
        }));
    }

    kickoutClientFromDataServer(vid, clientName) {
        this.socket.writeBytes(Socket.createCMD(PROTOCOL.CDS_OPERATOR_CONTROL_KICKOUT_CLIENT, bytes => {
            bytes.writeUnsignedShort();
            bytes.writeUnsignedShort();
            bytes.writeBytes(Socket.stringToBytes(vid, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID));
            bytes.writeBytes(Socket.stringToBytes(clientName, CONSTANTS.DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
            bytes.writeByte(0);
        }));
    }
}

const dataAPI = new DataAPI();

export default dataAPI;