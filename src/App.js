import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import * as RTC from 'cube-rtc';

import React from 'react';
import { connect } from 'react-redux';

import NullGateSocket from './services/NullGate/NullGateSocket';
import { MenuBar, MessageBar, LoadingIndicator } from './components';
import {
  setVoiceAppId,
  setChannelList,
  setCurrentChannelId,
  setChannelJoinStatus,
  setIsAnswerCall,
  setWaitingList,
  setAnchorList,
  setAnchorsOnDutyList,
  setManagerList,
  setIsAnchorCall,
  setUserLevel,
  setDelegatorList,
  setFormValues
} from './actions/voice';
import {
  setTableList,
  setBetHistory,
  setTableLimit
} from './actions/data';
import {
  setToastMessage,
  setToastVariant,
  setToastDuration,
  toggleToast,
  toggleDialog,
  setIsUserAuthenticated,
  setManagerCredential,
  resetAction,
  toggleLoading
} from './actions/app';
import {
  MANAGER_LOGIN_R,
  MANAGER_KICKOUT_R,
  CHANNEL_LIST_R,
  CHANNEL_JOIN,
  CHANNEL_JOIN_R,
  MANAGER_ACTION,
  MANAGER_ACTION_R,
  ASSIGN_TABLE_TO_CHANNEL,
  WAITING_LIST_R,
  ANCHOR_ALL_QUERY_REQ,
  ANCHOR_ALL_QUERY_R,
  ANCHOR_ADD_REQ,
  ANCHOR_ADD_R,
  ANCHOR_DELETE_REQ,
  ANCHOR_DELETE_R,
  ANCHORS_ON_DUTY_UPDATE,
  ANCHORS_ON_DUTY_REQUEST,
  ANCHORS_ON_DUTY_R,
  MANAGER_ALL_QUERY_REQ,
  MANAGER_ALL_QUERY_R,
  MANAGER_ADD_REQ,
  MANAGER_ADD_R,
  MANAGER_DELETE,
  MANAGER_DELETE_R,
  MANAGER_LOGOUT,
  ASSIGN_TOKEN_TO_DELEGATOR,
  ASSIGN_TOKEN_TO_DELEGATOR_R,
  KICK_DELEGATOR,
  KICK_DELEGATOR_R,
  QUERY_ALL_DELEGATOR,
  QUERY_ALL_DELEGATOR_R,
  ADD_DELEGATOR,
  ADD_DELEGATOR_R,
  DELETE_DELEGATOR,
  DELETE_DELEGATOR_R,
  CDS_OPERATOR_LOGIN_R,
  CDS_OPERATOR_LOGOUT,
  CDS_CLIENT_LIST,
  CDS_OPERATOR_CONTROL_CONTRACT_TABLE,
  CDS_OPERATOR_CONTROL_CONTRACT_TABLE_R,
  CDS_OPERATOR_CONTROL_CONTRACT_TABLE_EBAC,
  CDS_OPERATOR_CONTROL_KICKOUT_CLIENT,
  CDS_OPERATOR_CONTROL_KICKOUT_CLIENT_R,
  CDS_BET_HIST,
  CDS_BET_HIST_R,
  CDS_CONTROL_REQ_VIDEO_RES,
  CDS_VIDEO_STATUS,
  CDS_CLIENT_ENTER_TABLE_NOTIFY,
  CDS_CLIENT_LEAVE_TABLE_NOTIFY,
  CDS_TABLE_LIMIT,
  CDS_ADD_MANAGER,
  CDS_REMOVE_MANAGER,
  CDS_UPDATE_MANAGER,
  CDS_ADD_ANCHOR,
  CDS_REMOVE_ANCHOR,
  CDS_UPDATE_ANCHOR,
  CDS_ACTION_R,
  GATE_REQUEST_CACHE,
  GATE_FORWARD_MSG
} from './protocols';
import {
  VALUE_LENGTH,
  MANAGER_ACTIONS,
  MUTE_STATE,
  DATA_SERVER_VALUE_LENGTH,
  CONTRACT_MODE,
  RESPONSE_CODES,
  MANAGER_ACTION_TYPE,
  GAME_SERVER_RESPONSE_CODES,
  USER_STATE
} from './constants';
import { isObject } from './helpers/utils';
import { voiceServerLoginCMD, dataServerLoginCMD, handleLoginFailure } from './helpers/appUtils';
import './App.css';

const nullGate = new NullGateSocket();

const nullGateLoginCMD = () => {
  nullGate.writeBytes(Socket.createCMD(GATE_REQUEST_CACHE));
};

const nullGateForwardMsgCMD = () => {
  nullGate.writeBytes(Socket.createCMD(GATE_FORWARD_MSG, bytes => {
    bytes.writeBytes(Socket.stringToBytes('TSTHK123', DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
  }));
}

class App extends React.Component {
  onVoiceSocketOpen = evt => {
    this.props.toggleToast(false);

    if (isObject(this.props.managerCredential)) {
      const { voice: voiceSocket, managerCredential: { managerLoginname, managerPassword } } = this.props;
      voiceServerLoginCMD(managerLoginname, managerPassword, voiceSocket);
    }
  }

  onVoiceSocketPacket = async (evt) => {
    if (evt.$type === Socket.EVENT_PACKET) {
      console.log(`${Socket.EVENT_PACKET} data:`, evt.data);

      const { SUCCESS, REPEAT_LOGIN, DELEGATOR_NOT_IN_LINE, ERR_PWD_ERROR, ERR_NO_USER, DELEGATOR_HAS_TOKEN } = RESPONSE_CODES;
      const { ADD_ANCHOR, ADD_MANAGER } = MANAGER_ACTION_TYPE;
      const {
        voiceAppId,
        setVoiceAppId,
        setChannelList,
        currentChannelId,
        setChannelJoinStatus,
        setIsAnswerCall,
        setWaitingList,
        setAnchorList,
        setAnchorsOnDutyList,
        setToastMessage,
        setToastVariant,
        toggleToast,
        toggleDialog,
        setManagerList,
        setIsAnchorCall,
        isAnswerCall,
        data: dataSocket,
        setUserLevel,
        setIsUserAuthenticated,
        setDelegatorList,
        managerAction,
        formValues
      } = this.props;

      switch(evt.data.respId) {
        case MANAGER_LOGIN_R:
          const { code: loginStatus } = evt.data;

          if (loginStatus === SUCCESS) {
            if (evt.data.voiceAppId) {
              setVoiceAppId(evt.data.voiceAppId);
              RTC.init(evt.data.voiceAppId);

              this.getAnchorList();
              this.getAnchorsDutyList();
              this.getManagerList();
              this.getDelegatorList();
              setUserLevel(evt.data.level);

              await dataSocket.autoConnect();
            } else {
              handleLoginFailure({
                setIsUserAuthenticated,
                setToastMessage,
                setToastVariant,
                setToastDuration,
                toggleToast,
                message: "沒有AppId, 請聯絡管理員!"
              });

              this.reset();
            }
          } else if (loginStatus === REPEAT_LOGIN) {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: "經理重覆登入!"
            });

            this.reset();
          } else if (loginStatus === ERR_PWD_ERROR) {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: "用戶名/密碼錯誤!"
            });
            
            this.reset();
          } else if (loginStatus === ERR_NO_USER) {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: "沒有此用戶!"
            });

            this.reset();
          } else {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: `[VoiceServer] 無法登入, 請聯絡管理員! (code: ${loginStatus})`
            });

            this.reset();
          }
        break;

        case MANAGER_KICKOUT_R:
          const { code: kickoutStatus } = evt.data;

          if (kickoutStatus === REPEAT_LOGIN) {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: "經理重覆登入!"
            });
          }
        break;

        case CHANNEL_LIST_R:
          setChannelList(evt.data.channelList);

          if (isAnswerCall) {
            const currentChannel = evt.data.channelList.find(channel => channel.channelId === currentChannelId);
            
            if (
              isObject(currentChannel) && 
              currentChannel.anchorName && 
              (currentChannel.anchorState === USER_STATE.CONNECTING || currentChannel.anchorState === USER_STATE.CONNECTED)) {
                setIsAnchorCall(true);
            }
          }
        break;

        case CHANNEL_JOIN_R:
          const { code: joinStatus } = evt.data;

          setChannelJoinStatus(joinStatus);
          setIsAnswerCall(joinStatus === 0 ? true : false);

          if (joinStatus === SUCCESS) {
            await RTC.joinRoom(currentChannelId, voiceAppId);
            this.sendManagerAction(MANAGER_ACTIONS.JOIN_CHANNEL, currentChannelId);
          }
        break;

        case MANAGER_ACTION_R:
          const { code: actionStatus } = evt.data;
          const { LEAVE_CHANNEL, KICKOUT_CLIENT, BLACKLIST_CLIENT } = MANAGER_ACTIONS;

          if (actionStatus === SUCCESS) {
            switch(evt.data.action) {
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
            setToastMessage(`經理操作不能執行! (code: ${actionStatus})`);
            setToastVariant('error');
            toggleToast(true);
          }
        break;

        case WAITING_LIST_R:
          setWaitingList(evt.data.delegatorList);
        break;

        case ANCHOR_ALL_QUERY_R:
          setAnchorList(evt.data.allAnchorsList);
        break;

        case ANCHOR_ADD_R:
          const { code: anchorAddStatus } = evt.data;
          let functionToExecute;

          if (anchorAddStatus !== SUCCESS) {
            setToastMessage(`[VoiceServer] 無法${managerAction === ADD_ANCHOR ? "加入" : "編輯"}主播! (code: ${anchorAddStatus})`);
            setToastVariant('error');
            toggleToast(true);
          } else {
            functionToExecute = managerAction === ADD_ANCHOR ? this.addAnchorToDataServer : this.updateAnchorToDataServer;
            functionToExecute(formValues.loginname, formValues.password, formValues.nickname, formValues.iconUrl, 0);
            // this.getAnchorList();
          }
        break;

        case ANCHOR_DELETE_R:
          const { code: anchorDeleteStatus } = evt.data;

          if (anchorDeleteStatus !== SUCCESS) {
            toggleDialog(false);
            setToastMessage(`[VoiceServer] 無法刪除主播! (code: ${anchorDeleteStatus})`);
            setToastVariant('error');
            toggleToast(true);
          } else {
            toggleDialog(false);
            this.deleteAnchorFromDataServer(formValues.loginname);
            // this.getAnchorList();
          }
        break;

        case ANCHORS_ON_DUTY_R:
          setAnchorsOnDutyList(evt.data.anchorsOnDutyList);
        break;

        case MANAGER_ALL_QUERY_R:
          setManagerList(evt.data.allManagersList);
        break;

        case MANAGER_ADD_R:
          const { code: managerAddStatus } = evt.data;

          if (managerAddStatus !== SUCCESS) {
            setToastMessage(`[VoiceServer] 無法${managerAction === ADD_MANAGER ? "加入" : "編輯"}經理! (code: ${managerAddStatus})`);
            setToastVariant('error');
            toggleToast(true);
          } else {
            functionToExecute = managerAction === ADD_MANAGER ? this.addManagerToDataServer : this.updateManagerToDataServer;
            functionToExecute(formValues.loginname, formValues.password, formValues.nickname, formValues.iconUrl, formValues.level);
            this.getManagerList();
          }
        break;

        case MANAGER_DELETE_R:
          const { code: managerDeleteStatus } = evt.data;

          if (managerDeleteStatus !== SUCCESS) {
            toggleDialog(false);
            setToastMessage(`[VoiceServer] 無法刪除經理! (code: ${managerDeleteStatus})`);
            setToastVariant('error');
            toggleToast(true);
          } else {
            toggleDialog(false);
            this.deleteManagerFromDataServer(formValues.loginname);
            // this.getManagerList();
          }
        break;

        case ASSIGN_TOKEN_TO_DELEGATOR_R:
          const { code: assignTokenStatus } = evt.data;
          
          if (assignTokenStatus === DELEGATOR_NOT_IN_LINE) {
            setToastMessage('代理並不在線!');
            setToastVariant('error');
            toggleToast(true);
          } else if (assignTokenStatus !== SUCCESS) {
            setToastMessage(`不能成功派籌, 請聯絡管理員! (code: ${assignTokenStatus})`);
            setToastVariant('error');
            toggleToast(true);
          }
        break;

        case KICK_DELEGATOR_R:
          const { code: kickDelegatorStatus } = evt.data;
          
          if (kickDelegatorStatus !== SUCCESS) {
            setToastMessage(`不能成功踢走代理, 請聯絡管理員! (code: ${kickDelegatorStatus})`);
            setToastVariant('error');
            toggleToast(true);
          }
        break;

        case QUERY_ALL_DELEGATOR_R:
          setDelegatorList(evt.data.delegatorList);
        break;

        case ADD_DELEGATOR_R:
          const { code: addDelegatorStatus } = evt.data;

          if (addDelegatorStatus !== SUCCESS) {
            setToastMessage(`無法加入代理! (code: ${addDelegatorStatus})`);
            setToastVariant('error');
            toggleToast(true);
          } else {
            this.getDelegatorList();
          }
        break;

        case DELETE_DELEGATOR_R:
          const { code: deleteDelegatorStatus } = evt.data;

          if (deleteDelegatorStatus === DELEGATOR_HAS_TOKEN) {
            toggleDialog(false);
            setToastMessage("代理已拿籌, 不能刪除此代理記錄!");
            setToastVariant('error');
            toggleToast(true);
          } else if (deleteDelegatorStatus !== SUCCESS) {
            toggleDialog(false);
            setToastMessage(`無法刪除代理! (code: ${deleteDelegatorStatus})`);
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
  }

  onVoiceSocketClose = () => {
    RTC.leaveRoom();
  }

  onVoiceSocketDie = () => {
    RTC.leaveRoom();
  }

  onDataSocketOpen = evt => {
    this.props.toggleToast(false);

    if (isObject(this.props.managerCredential)) {
      const { data: dataSocket, managerCredential: { managerLoginname, managerPassword } } = this.props;
      dataServerLoginCMD(managerLoginname, managerPassword, dataSocket);
    }
  }

  onDataSocketPacket = evt => {
    if (evt.$type === Socket.EVENT_PACKET) {
      console.log(`${Socket.EVENT_PACKET} data:`, evt.data);
    }

    const {
      setTableList,
      currentChannelId,
      setToastMessage,
      setToastVariant,
      toggleToast,
      managerAction,
      tableList,
      setIsUserAuthenticated,
      setBetHistory,
      toggleLoading,
      setTableLimit
    } = this.props;
    const { SUCCESS, ERR_NO_LOGIN } = GAME_SERVER_RESPONSE_CODES;

    switch(evt.data.respId) {
      case CDS_CONTROL_REQ_VIDEO_RES:
        const initialTableData = evt.data.videoStatusList;

        if (Array.isArray(initialTableData)) {
          initialTableData.forEach(table => {
            let { vid, dealerName, gameCode, gmType, status } = table;

            setTableList({
              vid,
              dealerName,
              gameCode,
              gmType,
              gameStatus: status
            });
          });
        }
      break;

      case CDS_CLIENT_LIST:
        setTableList({
          vid: evt.data.vid,
          seatedPlayerNum: evt.data.seatedPlayerNum,
          tableOwner: evt.data.username,
          account: evt.data.account
        });
      break;

      case CDS_VIDEO_STATUS:
        setTableList({
          vid: evt.data.vid,
          gameStatus: evt.data.gameStatus,
          gameCode: evt.data.gmcode,
          tableOwner: evt.data.username,
          status: evt.data.videoStatus,
          dealerName: evt.data.deal
        });
      break;

      case CDS_CLIENT_ENTER_TABLE_NOTIFY:
        const currentTable = tableList.find(table => table.vid === evt.data.vid);

        setTableList({
          vid: evt.data.vid,
          username: evt.data.username,
          account: evt.data.currentAmount,
          seatedPlayerNum: currentTable.seatedPlayerNum + 1
        });
      break;

      case CDS_CLIENT_LEAVE_TABLE_NOTIFY:
        setTableList({
          vid: evt.data.vid,
          dealerName: '',
          gameCode: '',
          gmType: '',
          gameStatus: 0,
          seatedPlayerNum: 0,
          account: 0,
          tableOwner: '',
          status: 0
        });
        setTableLimit(evt.data.vid, []);
      break;

      case CDS_OPERATOR_LOGIN_R:
        const { code: loginStatus } = evt.data;

        if (loginStatus !== SUCCESS) {
          handleLoginFailure({
            setIsUserAuthenticated,
            setToastMessage,
            setToastVariant,
            setToastDuration,
            toggleToast,
            message: `[DataServer] 無法登入, 請聯絡管理員 (code: ${loginStatus})`
          });

          this.reset();
        }
      break;

      case CDS_OPERATOR_CONTROL_CONTRACT_TABLE_R:
        const { code: assignTableStatus } = evt.data;

        if (assignTableStatus === SUCCESS) {
          this.assignTableToChannel(currentChannelId, evt.data.vid);
        } else {
          setToastMessage(`無法將玩家配對到桌枱! (code: ${assignTableStatus})`);
          setToastVariant('error');
          toggleToast(true);
        }
      break;

      case CDS_OPERATOR_CONTROL_CONTRACT_TABLE_EBAC:
        setToastMessage(`無法將玩家${evt.data.username}配對到桌枱!`);
        setToastVariant('error');
        setToastDuration(null);
        toggleToast(true);
      break;

      case CDS_OPERATOR_CONTROL_KICKOUT_CLIENT_R:
        const { reason: kickoutReason } = evt.data;

        if (kickoutReason === SUCCESS || kickoutReason === ERR_NO_LOGIN) {
          if (managerAction === MANAGER_ACTION_TYPE.KICKOUT_CLIENT) {
            this.kickoutClient(currentChannelId);
          } else {
            this.blacklistClient(currentChannelId);
          }
        } else {
          setToastMessage(`無法將玩家踢出桌枱/加入黑名單! (Reason: ${kickoutReason})`);
          setToastVariant('error');
          toggleToast(true);
        }
      break;
      
      case CDS_TABLE_LIMIT:
        setTableLimit(evt.data.vid, evt.data.tableLimit);
      break;

      case CDS_BET_HIST_R:
        setBetHistory('billno', evt.data.betHistList);
        toggleLoading(false);
      break;

      case CDS_ACTION_R:
        const { code: cdsActionStatus } = evt.data;
        let message = '';

        if (cdsActionStatus !== SUCCESS) {
          // rollback record from Voice Server
          // switch(evt.data.reqCmd) {
          //   case CDS_ADD_ANCHOR:
          //   case CDS_UPDATE_ANCHOR:
          //   case CDS_REMOVE_ANCHOR:
          //     this.deleteAnchor(formValues.loginname);
          //   break;

          //   case CDS_ADD_MANAGER:
          //   case CDS_UPDATE_MANAGER:
          //   case CDS_REMOVE_MANAGER:
          //     this.deleteManager(formValues.loginname);
          //   break;

          //   default:
          //   break;
          // }

          // display error message
          switch(evt.data.reqCmd) {
            case CDS_ADD_ANCHOR:
              message = "加入主播";
            break;

            case CDS_UPDATE_ANCHOR:
              message = "編輯主播";
            break;

            case CDS_REMOVE_ANCHOR:
              message = "刪除主播";
            break;

            case CDS_ADD_MANAGER:
              message = "加入經理";
            break;

            case CDS_UPDATE_MANAGER:
              message = "編輯經理";
            break;

            case CDS_REMOVE_MANAGER:
              message = "刪除經理";
            break;

            default:
            break;
          }

          if (message) {
            setToastMessage(`[DataServer] 無法${message}! (code: ${cdsActionStatus})`);
            setToastVariant('error');
            toggleToast(true);
          }
        } else {
          // retrieve latest list
          switch(evt.data.reqCmd) {
            case CDS_ADD_ANCHOR:
            case CDS_UPDATE_ANCHOR:
            case CDS_REMOVE_ANCHOR:
              this.getAnchorList();
            break;

            case CDS_ADD_MANAGER:
            case CDS_UPDATE_MANAGER:
            case CDS_REMOVE_MANAGER:
              this.getManagerList();
            break;

            default:
            break;
          }
        }

        this.resetFormValues();
      break;

      default:
      break;
    }
  }

  onNullGateSocketOpen = evt => {
    nullGateLoginCMD();
  }

  onNullGateSocketPacket = evt => {
    if (evt.$type === Socket.EVENT_PACKET) {
      console.log(`${Socket.EVENT_PACKET} data:`, evt.data);
    }

    switch(evt.data.respId) {
      default:
      break;
    }
  }

  // TODO: move to appUtils
  reset = () => {
    const { voice: voiceSocket, data: dataSocket, setManagerCredential, setIsUserAuthenticated } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(MANAGER_LOGOUT));
    voiceSocket.close();
    dataSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_LOGOUT));
    dataSocket.close();

    setManagerCredential(null);
    setIsUserAuthenticated(false);
  }

  async componentDidMount() {
    const { voice: voiceSocket, data: dataSocket } = this.props;

    voiceSocket.addEventListener(Socket.EVENT_OPEN, this.onVoiceSocketOpen);
    voiceSocket.addEventListener(Socket.EVENT_PACKET, this.onVoiceSocketPacket);
    voiceSocket.addEventListener(Socket.EVENT_CLOSE, this.onVoiceSocketClose);
    voiceSocket.addEventListener(Socket.EVENT_DIE, this.onVoiceSocketDie);

    dataSocket.addEventListener(Socket.EVENT_OPEN, this.onDataSocketOpen);
    dataSocket.addEventListener(Socket.EVENT_PACKET, this.onDataSocketPacket);

    nullGate.addEventListener(Socket.EVENT_OPEN, this.onNullGateSocketOpen);
    nullGate.addEventListener(Socket.EVENT_PACKET, this.onNullGateSocketPacket);

    await voiceSocket.autoConnect();
    // await dataSocket.autoConnect();
    await nullGate.autoConnect();
  }

  componentWillUnmount() {
    const { voice: voiceSocket, data: dataSocket } = this.props;

    voiceSocket.removeEventListener(Socket.EVENT_OPEN, this.onVoiceSocketOpen);
    voiceSocket.removeEventListener(Socket.EVENT_PACKET, this.onVoiceSocketPacket);
    voiceSocket.removeEventListener(Socket.EVENT_CLOSE, this.onVoiceSocketClose);
    voiceSocket.removeEventListener(Socket.EVENT_DIE, this.onVoiceSocketDie);

    dataSocket.removeEventListener(Socket.EVENT_OPEN, this.onDataSocketOpen);
    dataSocket.removeEventListener(Socket.EVENT_PACKET, this.onDataSocketPacket);

    nullGate.removeEventListener(Socket.EVENT_OPEN, this.onNullGateSocketOpen);
    nullGate.removeEventListener(Socket.EVENT_PACKET, this.onNullGateSocketPacket);
  }

  joinChannel = channelId => {
    const { setCurrentChannelId, voice: voiceSocket } = this.props;
    setCurrentChannelId(channelId);

    voiceSocket.writeBytes(Socket.createCMD(CHANNEL_JOIN, bytes => {
      bytes.writeUnsignedInt(channelId);
    }));
  }

  sendManagerAction = (action, channelId) => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(MANAGER_ACTION, bytes => {
      bytes.writeUnsignedInt(action);
      bytes.writeUnsignedInt(channelId);
    }));
  }

  assignTable = (vid, clientName)=> {
    const { data: dataSocket } = this.props;

    dataSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_CONTROL_CONTRACT_TABLE, bytes => {
      bytes.writeUnsignedShort();
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes(vid, DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID));
      bytes.writeBytes(Socket.stringToBytes(clientName, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
      bytes.writeByte(CONTRACT_MODE.OWNER);
    }));
  }

  assignTableToChannel = (channelId, vid) => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(ASSIGN_TABLE_TO_CHANNEL, bytes => {
      bytes.writeUnsignedInt(channelId);
      bytes.writeBytes(Socket.stringToBytes(vid, VALUE_LENGTH.VID));
    }));
  }

  leaveChannel = channelId => {
    this.sendManagerAction(MANAGER_ACTIONS.LEAVE_CHANNEL, channelId);
  }

  toggleMuteChannel = (channelId, isAnchor, muteState) => {
    const { MUTE_ANCHOR, UNMUTE_ANCHOR, MUTE_CLIENT, UNMUTE_CLIENT } = MANAGER_ACTIONS;
    const { MUTE } = MUTE_STATE;
    let action;

    if (isAnchor) {
      action = muteState === MUTE ? MUTE_ANCHOR : UNMUTE_ANCHOR;
    } else {
      action = muteState === MUTE ? MUTE_CLIENT : UNMUTE_CLIENT;
    }

    this.sendManagerAction(action, channelId);
  }

  kickoutClientFromDataServer = (vid, clientName) => {
    const { data: dataSocket } = this.props;

    dataSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_CONTROL_KICKOUT_CLIENT, bytes => {
      bytes.writeUnsignedShort();
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes(vid, DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID));
      bytes.writeBytes(Socket.stringToBytes(clientName, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
      bytes.writeByte(0);
    }));
  }

  kickoutClient = channelId => {
    this.sendManagerAction(MANAGER_ACTIONS.KICKOUT_CLIENT, channelId);
  }

  blacklistClient = channelId => {
    this.sendManagerAction(MANAGER_ACTIONS.BLACKLIST_CLIENT, channelId);
  }

  getBetHistory = (gmCode = '', vid = 'V010', gmType = '', beginTime = '', endTime = '') => {
    const { data: dataSocket, managerCredential: { managerLoginname } } = this.props;

    dataSocket.writeBytes(Socket.createCMD(CDS_BET_HIST, bytes => {
      bytes.writeUnsignedShort();
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes(vid, DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID));
      bytes.writeBytes(Socket.stringToBytes('', DATA_SERVER_VALUE_LENGTH.VL_TIMESTAMP));
      bytes.writeBytes(Socket.stringToBytes('', DATA_SERVER_VALUE_LENGTH.VL_TIMESTAMP));
      bytes.writeBytes(Socket.stringToBytes(gmCode, DATA_SERVER_VALUE_LENGTH.VL_GAME_CODE));
      bytes.writeUnsignedShort(0);
      bytes.writeBytes(Socket.stringToBytes(gmType, DATA_SERVER_VALUE_LENGTH.VL_GM_TYPE));
      bytes.writeBytes(Socket.stringToBytes(managerLoginname, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
    }));
  }

  setAnchorsDuty = (anchorList) => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(ANCHORS_ON_DUTY_UPDATE, bytes => {
      if (Array.isArray(anchorList) && anchorList.length > 0) {
        bytes.writeUnsignedInt(anchorList.length);

        for(let i = 0; i < anchorList.length; i++) {
          bytes.writeBytes(Socket.stringToBytes(anchorList[i], VALUE_LENGTH.LOGIN_NAME));
        }
      }
    }));
  }

  getAnchorsDutyList = () => {
    const { voice: voiceSocket } = this.props;
    voiceSocket.writeBytes(Socket.createCMD(ANCHORS_ON_DUTY_REQUEST));
  }

  getAnchorList = () => {
    const { voice: voiceSocket } = this.props;
    voiceSocket.writeBytes(Socket.createCMD(ANCHOR_ALL_QUERY_REQ));
  }

  addAnchor = (loginName, password, nickName, url) => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(ANCHOR_ADD_REQ, bytes => {
      bytes.writeBytes(Socket.stringToBytes(loginName, VALUE_LENGTH.LOGIN_NAME));
      bytes.writeBytes(Socket.stringToBytes(password, VALUE_LENGTH.PASSWORD));
      bytes.writeBytes(Socket.stringToBytes(nickName, VALUE_LENGTH.NICK_NAME));
      bytes.writeUnsignedInt(url.length);
      bytes.writeBytes(Socket.stringToBytes(url, url.length));
    }));
  }

  deleteAnchor = loginName => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(ANCHOR_DELETE_REQ, bytes => {
      bytes.writeBytes(Socket.stringToBytes(loginName, VALUE_LENGTH.LOGIN_NAME));
    }));
  }

  getManagerList = () => {
    const { voice: voiceSocket } = this.props;
    voiceSocket.writeBytes(Socket.createCMD(MANAGER_ALL_QUERY_REQ));
  }

  addManager = (loginName, password, nickName, url, flag) => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(MANAGER_ADD_REQ, bytes => {
      bytes.writeBytes(Socket.stringToBytes(loginName, VALUE_LENGTH.LOGIN_NAME));
      bytes.writeBytes(Socket.stringToBytes(password, VALUE_LENGTH.PASSWORD));
      bytes.writeBytes(Socket.stringToBytes(nickName, VALUE_LENGTH.NICK_NAME));
      bytes.writeUnsignedInt(url.length);
      bytes.writeBytes(Socket.stringToBytes(url, url.length));
      bytes.writeByte(flag);
    }));
  }

  deleteManager = loginName => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(MANAGER_DELETE, bytes => {
      bytes.writeBytes(Socket.stringToBytes(loginName, VALUE_LENGTH.LOGIN_NAME));
    }));
  }

  addAnchorToDataServer = (loginName, password, nickName, url, flag) => {
    const { data: dataSocket } = this.props;

    dataSocket.writeBytes(Socket.createCMD(CDS_ADD_ANCHOR, bytes => {
      bytes.writeUnsignedShort();
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes(loginName, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
      bytes.writeBytes(Socket.stringToBytes(nickName, DATA_SERVER_VALUE_LENGTH.VL_NICK_NAME));
      bytes.writeBytes(Socket.stringToBytes(password, DATA_SERVER_VALUE_LENGTH.VL_PSW));
      bytes.writeByte(flag);
      bytes.writeBytes(Socket.stringToBytes(url, DATA_SERVER_VALUE_LENGTH.VL_URL));
    }));
  }

  deleteAnchorFromDataServer = loginName => {
    const { data: dataSocket } = this.props;

    dataSocket.writeBytes(Socket.createCMD(CDS_REMOVE_ANCHOR, bytes => {
      bytes.writeUnsignedShort();
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes(loginName, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
    }));
  }

  updateAnchorToDataServer = (loginName, password, nickName, url, flag) => {
    const { data: dataSocket } = this.props;

    dataSocket.writeBytes(Socket.createCMD(CDS_UPDATE_ANCHOR, bytes => {
      bytes.writeUnsignedShort();
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes(loginName, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
      bytes.writeBytes(Socket.stringToBytes(nickName, DATA_SERVER_VALUE_LENGTH.VL_NICK_NAME));
      bytes.writeBytes(Socket.stringToBytes(password, DATA_SERVER_VALUE_LENGTH.VL_PSW));
      bytes.writeByte(flag);
      bytes.writeBytes(Socket.stringToBytes(url, DATA_SERVER_VALUE_LENGTH.VL_URL));
    }));
  }

  addManagerToDataServer = (loginName, password, nickName, url, flag) => {
    const { data: dataSocket } = this.props;

    dataSocket.writeBytes(Socket.createCMD(CDS_ADD_MANAGER, bytes => {
      bytes.writeUnsignedShort();
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes(loginName, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
      bytes.writeBytes(Socket.stringToBytes(nickName, DATA_SERVER_VALUE_LENGTH.VL_NICK_NAME));
      bytes.writeBytes(Socket.stringToBytes(password, DATA_SERVER_VALUE_LENGTH.VL_PSW));
      bytes.writeByte(flag);
      bytes.writeBytes(Socket.stringToBytes(url, DATA_SERVER_VALUE_LENGTH.VL_URL));
    }));
  }

  deleteManagerFromDataServer = loginName => {
    const { data: dataSocket } = this.props;

    dataSocket.writeBytes(Socket.createCMD(CDS_REMOVE_MANAGER, bytes => {
      bytes.writeUnsignedShort();
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes(loginName, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
    }));
  }

  updateManagerToDataServer = (loginName, password, nickName, url, flag) => {
    const { data: dataSocket } = this.props;

    dataSocket.writeBytes(Socket.createCMD(CDS_UPDATE_MANAGER, bytes => {
      bytes.writeUnsignedShort();
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes(loginName, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
      bytes.writeBytes(Socket.stringToBytes(nickName, DATA_SERVER_VALUE_LENGTH.VL_NICK_NAME));
      bytes.writeBytes(Socket.stringToBytes(password, DATA_SERVER_VALUE_LENGTH.VL_PSW));
      bytes.writeByte(flag);
      bytes.writeBytes(Socket.stringToBytes(url, DATA_SERVER_VALUE_LENGTH.VL_URL));
    }));
  }

  getDelegatorList = () => {
    const { voice: voiceSocket } = this.props;
    voiceSocket.writeBytes(Socket.createCMD(QUERY_ALL_DELEGATOR));
  }

  addDelegator = (loginName, password, tel) => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(ADD_DELEGATOR, bytes => {
      bytes.writeBytes(Socket.stringToBytes(loginName, VALUE_LENGTH.LOGIN_NAME));
      bytes.writeBytes(Socket.stringToBytes(password, VALUE_LENGTH.PASSWORD));
      bytes.writeBytes(Socket.stringToBytes(tel, VALUE_LENGTH.TEL));
    }));
  }

  deleteDelegator = loginName => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(DELETE_DELEGATOR, bytes => {
      bytes.writeBytes(Socket.stringToBytes(loginName, VALUE_LENGTH.LOGIN_NAME));
    }));
  }

  logout = () => {
    const { voice: voiceSocket, data: dataSocket, resetAction } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(MANAGER_LOGOUT));
    voiceSocket.close();

    dataSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_LOGOUT));
    dataSocket.close();

    RTC.leaveRoom();
    resetAction();
  }

  assignTokenToDelegator = delegatorName => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(ASSIGN_TOKEN_TO_DELEGATOR, bytes => {
      bytes.writeBytes(Socket.stringToBytes(delegatorName, VALUE_LENGTH.LOGIN_NAME));
    }));
  }

  kickDelegator = delegatorName => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(KICK_DELEGATOR, bytes => {
      bytes.writeBytes(Socket.stringToBytes(delegatorName, VALUE_LENGTH.LOGIN_NAME));
    }));
  }

  onClose = (evt, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.props.toggleToast(false);
  }

  resetFormValues = () => {
    this.props.setFormValues({
      loginname: '',
      nickname: '',
      password: '',
      iconUrl: '',
      level: '',
      tel: ''
    });
  }

  render() {
    const { open, variant, message, duration, managerCredential: { managerLoginname }, managerLevel, toggleLoading, showLoading } = this.props;

    return (
      <div className="App">
        <MenuBar
          joinChannel={this.joinChannel}
          leaveChannel={this.leaveChannel}
          assignTable={this.assignTable}
          assignTableToChannel={this.assignTableToChannel}
          toggleMuteChannel={this.toggleMuteChannel}
          kickoutClientFromDataServer={this.kickoutClientFromDataServer}
          kickoutClient={this.kickoutClient}
          blacklistClient={this.blacklistClient}
          getAnchorList={this.getAnchorList}
          addAnchor={this.addAnchor}
          deleteAnchor={this.deleteAnchor}
          setAnchorsDuty={this.setAnchorsDuty}
          getAnchorsDutyList={this.getAnchorsDutyList}
          getManagerList={this.getManagerList}
          addManager={this.addManager}
          deleteManager={this.deleteManager}
          logout={this.logout}
          managerLoginname={managerLoginname}
          managerLevel={managerLevel}
          getBetHistory={this.getBetHistory}
          toggleLoading={toggleLoading}
          assignTokenToDelegator={this.assignTokenToDelegator}
          kickDelegator={this.kickDelegator}
          getDelegatorList={this.getDelegatorList}
          addDelegator={this.addDelegator}
          deleteDelegator={this.deleteDelegator}
        />
        <MessageBar
          variant={variant}
          message={message}
          duration={duration}
          isOpen={open}
          onClose={this.onClose}
        />
        <LoadingIndicator showLoading={showLoading} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { voiceAppId, channelList, currentChannelId, managerAction, managerLevel, isAnswerCall, formValues } = state.voice;
  const { tableList } = state.data;
  const { variant, message, duration, open, managerCredential, showLoading } = state.app;
  return ({
    voiceAppId,
    channelList,
    currentChannelId,
    variant,
    message,
    duration,
    open,
    managerAction,
    managerCredential,
    managerLevel,
    tableList,
    isAnswerCall,
    showLoading,
    formValues
  });
};

const mapDispatchToProps = dispatch => ({
  setVoiceAppId: id => dispatch(setVoiceAppId(id)),
  setChannelList: list => dispatch(setChannelList(list)),
  setCurrentChannelId: id => dispatch(setCurrentChannelId(id)),
  setChannelJoinStatus: code => dispatch(setChannelJoinStatus(code)),
  setIsAnswerCall: answer => dispatch(setIsAnswerCall(answer)),
  setWaitingList: list => dispatch(setWaitingList(list)),
  setAnchorList: list => dispatch(setAnchorList(list)),
  setTableList: table => dispatch(setTableList(table)),
  setToastMessage: message => dispatch(setToastMessage(message)),
  setToastVariant: variant => dispatch(setToastVariant(variant)),
  setToastDuration: duration => dispatch(setToastDuration(duration)),
  toggleToast: toggle => dispatch(toggleToast(toggle)),
  setAnchorsOnDutyList: list => dispatch(setAnchorsOnDutyList(list)),
  toggleDialog: toggle => dispatch(toggleDialog(toggle)),
  setIsUserAuthenticated: status => dispatch(setIsUserAuthenticated(status)),
  setManagerCredential: credential => dispatch(setManagerCredential(credential)),
  setManagerList: list => dispatch(setManagerList(list)),
  setIsAnchorCall: isAnchor => dispatch(setIsAnchorCall(isAnchor)),
  setUserLevel: level => dispatch(setUserLevel(level)),
  setBetHistory: (keyField, payload) => dispatch(setBetHistory(keyField, payload)),
  resetAction: () => dispatch(resetAction()),
  toggleLoading: toggle => dispatch(toggleLoading(toggle)),
  setTableLimit: (vid, data) => dispatch(setTableLimit(vid, data)),
  setDelegatorList: list => dispatch(setDelegatorList(list)),
  setFormValues: values => dispatch(setFormValues(values))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
