import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import * as RTC from 'cube-rtc';

import React from 'react';
import { connect } from 'react-redux';

import { MenuBar, MessageBar } from './components';
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
  setUserLevel
} from './actions/voice';
import {
  setTableList
} from './actions/data';
import {
  setToastMessage,
  setToastVariant,
  setToastDuration,
  toggleToast,
  toggleDialog,
  setIsUserAuthenticated,
  setManagerCredential
} from './actions/app';
import {
  MANAGER_LOGIN_R,
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
  CDS_TABLE_LIMIT
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

class App extends React.Component {
  onVoiceSocketOpen = evt => {
    if (isObject(this.props.managerCredential)) {
      const { voice: voiceSocket, managerCredential: { managerLoginname, managerPassword } } = this.props;
      voiceServerLoginCMD(managerLoginname, managerPassword, voiceSocket);
    }
  }

  onVoiceSocketPacket = async (evt) => {
    if (evt.$type === Socket.EVENT_PACKET) {
      console.log(`${Socket.EVENT_PACKET} data:`, evt.data);

      const { SUCCESS, REPEAT_LOGIN } = RESPONSE_CODES;
      const {
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
        managerCredential,
        setUserLevel,
        setIsUserAuthenticated
      } = this.props;

      switch(evt.data.respId) {
        case MANAGER_LOGIN_R:
          const { code: loginStatus, voiceAppId, level } = evt.data;
          const { managerLoginname, managerPassword } = managerCredential;

          if (loginStatus === SUCCESS) {
            if (voiceAppId) {
              setVoiceAppId(voiceAppId);
              RTC.init(voiceAppId);

              this.getAnchorList();
              this.getAnchorsDutyList();
              this.getManagerList();
              setUserLevel(level);

              if (dataSocket.readyState === Socket.ReadyState.OPEN) {
                toggleToast(false);
                dataServerLoginCMD(managerLoginname, managerPassword, dataSocket);
              } else {
                dataSocket.close();
                await dataSocket.autoConnect();
                dataServerLoginCMD(managerLoginname, managerPassword, dataSocket);
              }
            } else {
              handleLoginFailure({
                setIsUserAuthenticated,
                setToastMessage,
                setToastVariant,
                setToastDuration,
                toggleToast,
                message: "[VoiceServer] 沒有AppId, 請聯絡管理員"
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
              message: "經理重覆登入"
            });

            this.reset();
          } else {
            handleLoginFailure({
              setIsUserAuthenticated,
              setToastMessage,
              setToastVariant,
              setToastDuration,
              toggleToast,
              message: "[VoiceServer] 無法登入, 請聯絡管理員"
            });

            this.reset();
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

          if (joinStatus === RESPONSE_CODES.SUCCESS) {
            await RTC.joinRoom(currentChannelId, voiceAppId);
            this.sendManagerAction(MANAGER_ACTIONS.JOIN_CHANNEL, currentChannelId);
          }
        break;

        case MANAGER_ACTION_R:
          const { code: actionStatus, action } = evt.data;
          const { LEAVE_CHANNEL, KICKOUT_CLIENT, BLACKLIST_CLIENT } = MANAGER_ACTIONS;

          if (actionStatus === RESPONSE_CODES.SUCCESS) {
            switch(action) {
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
          setWaitingList(evt.data.clientList);
        break;

        case ANCHOR_ALL_QUERY_R:
          setAnchorList(evt.data.allAnchorsList);
        break;

        case ANCHOR_ADD_R:
          const { code: anchorAddStatus } = evt.data;

          if (anchorAddStatus !== RESPONSE_CODES.SUCCESS) {
            setToastMessage('無法加入主播!');
            setToastVariant('error');
            toggleToast(true);
          } else {
            this.getAnchorList();
          }
        break;

        case ANCHOR_DELETE_R:
          const { code: anchorDeleteStatus } = evt.data;

          if (anchorDeleteStatus !== RESPONSE_CODES.SUCCESS) {
            toggleDialog(false);
            setToastMessage('無法刪除主播!');
            setToastVariant('error');
            toggleToast(true);
          } else {
            toggleDialog(false);
            this.getAnchorList();
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

          if (managerAddStatus !== RESPONSE_CODES.SUCCESS) {
            setToastMessage('無法加入經理!');
            setToastVariant('error');
            toggleToast(true);
          } else {
            this.getManagerList();
          }
        break;

        case MANAGER_DELETE_R:
          const { code: managerDeleteStatus } = evt.data;

          if (managerDeleteStatus !== RESPONSE_CODES.SUCCESS) {
            toggleDialog(false);
            setToastMessage('無法刪除經理!');
            setToastVariant('error');
            toggleToast(true);
          } else {
            toggleDialog(false);
            this.getManagerList();
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
      setIsUserAuthenticated
    } = this.props;

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
      break;

      case CDS_OPERATOR_LOGIN_R:
        const { code: loginStatus } = evt.data;

        if (loginStatus === GAME_SERVER_RESPONSE_CODES.SUCCESS) {
          this.getBetHistory();
        } else {
          handleLoginFailure({
            setIsUserAuthenticated,
            setToastMessage,
            setToastVariant,
            setToastDuration,
            toggleToast,
            message: "[DataServer] 無法登入, 請聯絡管理員"
          });

          this.reset();
        }
      break;

      case CDS_OPERATOR_CONTROL_CONTRACT_TABLE_R:
        const { code: assignTableStatus, vid } = evt.data;

        if (assignTableStatus === GAME_SERVER_RESPONSE_CODES.SUCCESS) {
          this.assignTableToChannel(currentChannelId, vid);
        } else {
          setToastMessage('無法將玩家配對到桌枱!');
          setToastVariant('error');
          toggleToast(true);
        }
      break;

      case CDS_OPERATOR_CONTROL_CONTRACT_TABLE_EBAC:
        const { username } = evt.data;

        setToastMessage(`無法將玩家${username}配對到桌枱!`);
        setToastVariant('error');
        setToastDuration(null);
        toggleToast(true);
      break;

      case CDS_OPERATOR_CONTROL_KICKOUT_CLIENT_R:
        const { reason: kickoutReason } = evt.data;

        if (kickoutReason === GAME_SERVER_RESPONSE_CODES.SUCCESS || kickoutReason === GAME_SERVER_RESPONSE_CODES.ERR_NO_LOGIN) {
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
      
      // TODO: waiting for game server update
      case CDS_TABLE_LIMIT:
      break;

      case CDS_BET_HIST_R:
      break;

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

    await voiceSocket.autoConnect();
    await dataSocket.autoConnect();
  }

  componentWillUnmount() {
    const { voice: voiceSocket, data: dataSocket } = this.props;

    voiceSocket.removeEventListener(Socket.EVENT_OPEN, this.onVoiceSocketOpen);
    voiceSocket.removeEventListener(Socket.EVENT_PACKET, this.onVoiceSocketPacket);
    voiceSocket.removeEventListener(Socket.EVENT_CLOSE, this.onVoiceSocketClose);
    voiceSocket.removeEventListener(Socket.EVENT_DIE, this.onVoiceSocketDie);

    dataSocket.removeEventListener(Socket.EVENT_OPEN, this.onDataSocketOpen);
    dataSocket.removeEventListener(Socket.EVENT_PACKET, this.onDataSocketPacket);
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

  getBetHistory = (gmCode = '', gmType = '', beginTime = '', endTime = '') => {
    const { data: dataSocket } = this.props;

    dataSocket.writeBytes(Socket.createCMD(CDS_BET_HIST, bytes => {
      bytes.writeUnsignedShort();
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes('V010', DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID));
      bytes.writeBytes(Socket.stringToBytes('', DATA_SERVER_VALUE_LENGTH.VL_TIMESTAMP));
      bytes.writeBytes(Socket.stringToBytes('', DATA_SERVER_VALUE_LENGTH.VL_TIMESTAMP));
      bytes.writeBytes(Socket.stringToBytes('', DATA_SERVER_VALUE_LENGTH.VL_GAME_CODE));
      bytes.writeUnsignedShort();
      bytes.writeBytes(Socket.stringToBytes('', DATA_SERVER_VALUE_LENGTH.VL_GM_TYPE));
      bytes.writeBytes(Socket.stringToBytes('', DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
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

  getManagerList = () => {
    const { voice: voiceSocket } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(MANAGER_ALL_QUERY_REQ));
  }

  addManager = (loginName, password, nickName, url, flag = 1) => {
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

  onClose = (evt, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.props.toggleToast(false);
  }

  logout = () => {
    const { voice: voiceSocket, data: dataSocket, setManagerCredential, setIsUserAuthenticated } = this.props;

    voiceSocket.writeBytes(Socket.createCMD(MANAGER_LOGOUT));
    voiceSocket.close();

    dataSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_LOGOUT));
    dataSocket.close();

    RTC.leaveRoom();
    setManagerCredential(null);
    setIsUserAuthenticated(false);
  }

  render() {
    const { open, variant, message, duration, managerCredential: { managerLoginname }, managerLevel } = this.props;
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
        />
        <MessageBar
          variant={variant}
          message={message}
          duration={duration}
          isOpen={open}
          onClose={this.onClose}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { voiceAppId, channelList, currentChannelId, managerAction, managerLevel, isAnswerCall } = state.voice;
  const { tableList } = state.data;
  const { variant, message, duration, open, managerCredential } = state.app;
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
    isAnswerCall
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
  setUserLevel: level => dispatch(setUserLevel(level))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
