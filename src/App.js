import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import * as RTC from 'cube-rtc';

import React from 'react';
import { connect } from 'react-redux';

import VoiceSocket from './services/Voice/VoiceSocket';
import DataSocket from './services/Data/DataSocket';
import { MenuBar, MessageBar } from './components';
import {
  setVoiceAppId,
  setChannelList,
  setCurrentChannelId,
  setChannelJoinStatus,
  setIsAnswerCall,
  setWaitingList,
  setAnchorList,
  setAnchorsOnDutyList
} from './actions/voice';
import {
  setTableList
} from './actions/data';
import {
  setToastMessage,
  setToastVariant,
  setToastDuration,
  toggleToast,
  toggleDialog
} from './actions/app';
import {
  MANAGER_LOGIN,
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
  CDS_OPERATOR_LOGIN,
  CDS_OPERATOR_LOGIN_R,
  CDS_CLIENT_LIST,
  CDS_OPERATOR_CONTROL_CONTRACT_TABLE,
  CDS_OPERATOR_CONTROL_CONTRACT_TABLE_R,
  CDS_OPERATOR_CONTROL_CONTRACT_TABLE_EBAC,
  CDS_OPERATOR_CONTROL_KICKOUT_CLIENT,
  CDS_OPERATOR_CONTROL_KICKOUT_CLIENT_R,
  CDS_BET_HIST
} from './protocols';
import {
  VALUE_LENGTH,
  MANAGER_ACTIONS,
  MUTE_STATE,
  DATA_SERVER_VALUE_LENGTH,
  CONTRACT_MODE,
  RESPONSE_CODES,
  MANAGER_ACTION_TYPE
} from './constants';
import './App.css';

const MANAGER_USERNAME = 'alicehui2';
const MANAGER_PASSWORD = 'aliceTest2';
const voiceSocket = new VoiceSocket();
const dataSocket = new DataSocket();

const sendManagerAction = (action, channelId) => {
  voiceSocket.writeBytes(Socket.createCMD(MANAGER_ACTION, bytes => {
    bytes.writeUnsignedInt(action);
    bytes.writeUnsignedInt(channelId);
  }));
};

const getAnchorList = () => {
  voiceSocket.writeBytes(Socket.createCMD(ANCHOR_ALL_QUERY_REQ));
};

const addAnchor = (loginName, password, nickName, url) => {
  voiceSocket.writeBytes(Socket.createCMD(ANCHOR_ADD_REQ, bytes => {
    bytes.writeBytes(Socket.stringToBytes(loginName, VALUE_LENGTH.LOGIN_NAME));
    bytes.writeBytes(Socket.stringToBytes(password, VALUE_LENGTH.PASSWORD));
    bytes.writeBytes(Socket.stringToBytes(nickName, VALUE_LENGTH.NICK_NAME));
    bytes.writeUnsignedInt(url.length);
    bytes.writeBytes(Socket.stringToBytes(url, url.length));
  }));
};

const deleteAnchor = loginName => {
  voiceSocket.writeBytes(Socket.createCMD(ANCHOR_DELETE_REQ, bytes => {
    bytes.writeBytes(Socket.stringToBytes(loginName, VALUE_LENGTH.LOGIN_NAME));
  }));
};

const assignTable = (vid, clientName)=> {
  dataSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_CONTROL_CONTRACT_TABLE, bytes => {
    bytes.writeUnsignedShort();
    bytes.writeUnsignedShort();
    bytes.writeBytes(Socket.stringToBytes(vid, DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID));
    bytes.writeBytes(Socket.stringToBytes(clientName, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
    bytes.writeByte(CONTRACT_MODE.OWNER);
  }));
};

const assignTableToChannel = (channelId, vid) => {
  voiceSocket.writeBytes(Socket.createCMD(ASSIGN_TABLE_TO_CHANNEL, bytes => {
    bytes.writeUnsignedInt(channelId);
    bytes.writeBytes(Socket.stringToBytes(vid, VALUE_LENGTH.VID));
  }));
};

const leaveChannel = channelId => {
  sendManagerAction(MANAGER_ACTIONS.LEAVE_CHANNEL, channelId);
};

const toggleMuteChannel = (channelId, isAnchor, muteState) => {
  const { MUTE_ANCHOR, UNMUTE_ANCHOR, MUTE_CLIENT, UNMUTE_CLIENT } = MANAGER_ACTIONS;
  const { MUTE } = MUTE_STATE;
  let action;

  if (isAnchor) {
    action = muteState === MUTE ? MUTE_ANCHOR : UNMUTE_ANCHOR;
  } else {
    action = muteState === MUTE ? MUTE_CLIENT : UNMUTE_CLIENT;
  }

  sendManagerAction(action, channelId);
};

const kickoutClientFromDataServer = (vid, clientName) => {
  dataSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_CONTROL_KICKOUT_CLIENT, bytes => {
    bytes.writeUnsignedShort();
    bytes.writeUnsignedShort();
    bytes.writeBytes(Socket.stringToBytes(vid, DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID));
    bytes.writeBytes(Socket.stringToBytes(clientName, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
    bytes.writeByte(0);
  }));
};

const kickoutClient = channelId => {
  sendManagerAction(MANAGER_ACTIONS.KICKOUT_CLIENT, channelId);
};

const blacklistClient = channelId => {
  sendManagerAction(MANAGER_ACTIONS.BLACKLIST_CLIENT, channelId);
};

const getBetHistory = (gmCode = '', gmType = '', beginTime = '', endTime = '') => {
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
};

const setAnchorsDuty = (anchorList) => {
  voiceSocket.writeBytes(Socket.createCMD(ANCHORS_ON_DUTY_UPDATE, bytes => {
    if (Array.isArray(anchorList) && anchorList.length > 0) {
      bytes.writeUnsignedInt(anchorList.length);

      for(let i = 0; i < anchorList.length; i++) {
        bytes.writeBytes(Socket.stringToBytes(anchorList[i], VALUE_LENGTH.LOGIN_NAME));
      }
    }
  }));
};

const getAnchorsDutyList = () => {
  voiceSocket.writeBytes(Socket.createCMD(ANCHORS_ON_DUTY_REQUEST));
};

class App extends React.Component {
  async componentDidMount() {
    voiceSocket.addEventListener(Socket.EVENT_OPEN, evt => {
      voiceSocket.writeBytes(Socket.createCMD(MANAGER_LOGIN, bytes => {
        bytes.writeBytes(Socket.stringToBytes(MANAGER_USERNAME, VALUE_LENGTH.LOGIN_NAME));
        bytes.writeBytes(Socket.stringToBytes(MANAGER_PASSWORD, VALUE_LENGTH.PASSWORD));
      }));
    });

    voiceSocket.addEventListener(Socket.EVENT_PACKET, async (evt) => {
      if (evt.$type === Socket.EVENT_PACKET) {
        console.log(`${Socket.EVENT_PACKET} data:`, evt.data);

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
          toggleDialog
        } = this.props;

        switch(evt.data.respId) {
          case MANAGER_LOGIN_R:
            const { voiceAppId } = evt.data;

            if (voiceAppId) {
              setVoiceAppId(voiceAppId);
              RTC.init(voiceAppId);
            }

            getAnchorList();
            getAnchorsDutyList();
          break;

          case CHANNEL_LIST_R:
            setChannelList(evt.data.channelList);
          break;

          case CHANNEL_JOIN_R:
            const { code: joinStatus } = evt.data;

            setChannelJoinStatus(joinStatus);
            setIsAnswerCall(joinStatus === 0 ? true : false);

            if (joinStatus === RESPONSE_CODES.SUCCESS) {
              await RTC.joinRoom(currentChannelId, voiceAppId);
              sendManagerAction(MANAGER_ACTIONS.JOIN_CHANNEL, currentChannelId);
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
              getAnchorList();
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
              getAnchorList();
            }
          break;

          case ANCHORS_ON_DUTY_R:
            setAnchorsOnDutyList(evt.data.anchorsOnDutyList);
          break;

          default:
          break;
        }
      }
    });

    voiceSocket.addEventListener(Socket.EVENT_CLOSE, () => {
      RTC.leaveRoom();
    });

    voiceSocket.addEventListener(Socket.EVENT_DIE, () => {
      RTC.leaveRoom();
    });

    dataSocket.addEventListener(Socket.EVENT_OPEN, evt => {
      const { VL_VIDEO_ID, VL_USER_NAME, VL_PSW } = DATA_SERVER_VALUE_LENGTH;

      dataSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_LOGIN, bytes => {
        bytes.writeUnsignedShort();
        bytes.writeUnsignedShort();
        bytes.writeBytes(Socket.stringToBytes('', VL_VIDEO_ID));
        bytes.writeBytes(Socket.stringToBytes(MANAGER_USERNAME, VL_USER_NAME));
        bytes.writeBytes(Socket.stringToBytes(MANAGER_PASSWORD, VL_PSW));
        bytes.writeUnsignedInt();
      }));
    });
    
    dataSocket.addEventListener(Socket.EVENT_PACKET, evt => {
      if (evt.$type === Socket.EVENT_PACKET) {
        console.log(`${Socket.EVENT_PACKET} data:`, evt.data);
      }

      const {
        setTableList,
        currentChannelId,
        setToastMessage,
        setToastVariant,
        toggleToast,
        managerAction
      } = this.props;

      switch(evt.data.respId) {
        case CDS_CLIENT_LIST:
          setTableList(evt.data);
        break;

        case CDS_OPERATOR_LOGIN_R:
          const { code: loginStatus } = evt.data;

          if (loginStatus === RESPONSE_CODES.SUCCESS) {
            getBetHistory();
          }
        break;

        case CDS_OPERATOR_CONTROL_CONTRACT_TABLE_R:
          const { code: assignTableStatus, vid } = evt.data;

          if (assignTableStatus === RESPONSE_CODES.SUCCESS) {
            assignTableToChannel(currentChannelId, vid);
          } else {
            setToastMessage('無法將玩家配對到桌枱!');
            setToastVariant('error');
            toggleToast(true);
          }
        break;

        case CDS_OPERATOR_CONTROL_CONTRACT_TABLE_EBAC:
          // TODO: get reason table
          const { username } = evt.data;

          setToastMessage(`無法將玩家${username}配對到桌枱!`);
          setToastVariant('error');
          setToastDuration(null);
          toggleToast(true);
        break;

        case CDS_OPERATOR_CONTROL_KICKOUT_CLIENT_R:
          const { reason: kickoutReason } = evt.data;

          if (kickoutReason === RESPONSE_CODES.SUCCESS) {
            if (managerAction === MANAGER_ACTION_TYPE.KICKOUT_CLIENT) {
              kickoutClient(currentChannelId);
            } else {
              blacklistClient(currentChannelId);
            }
          } else {
            setToastMessage('無法將玩家踢出桌枱/加入黑名單!');
            setToastVariant('error');
            toggleToast(true);
          }
        break;

        // TODO need to handle CDS_VIDEO_STATUS

        default:
        break;
      }
    });

    voiceSocket.autoConnect();
    dataSocket.autoConnect();
  }

  joinChannel = channelId => {
    this.props.setCurrentChannelId(channelId);

    voiceSocket.writeBytes(Socket.createCMD(CHANNEL_JOIN, bytes => {
      bytes.writeUnsignedInt(channelId);
    }));
  }

  onClose = () => {
    this.props.toggleToast(false);
  }

  render() {
    const { open, variant, message, duration } = this.props;
    return (
      <div className="App">
        <MenuBar 
          joinChannel={this.joinChannel}
          leaveChannel={leaveChannel}
          assignTable={assignTable}
          assignTableToChannel={assignTableToChannel}
          toggleMuteChannel={toggleMuteChannel}
          kickoutClientFromDataServer={kickoutClientFromDataServer}
          kickoutClient={kickoutClient}
          blacklistClient={blacklistClient}
          getAnchorList={getAnchorList}
          addAnchor={addAnchor}
          deleteAnchor={deleteAnchor}
          setAnchorsDuty={setAnchorsDuty}
          getAnchorsDutyList={getAnchorsDutyList}
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
  const { voiceAppId, channelList, currentChannelId, managerAction } = state.voice;
  const { variant, message, duration, open } = state.app;
  return ({
    voiceAppId,
    channelList,
    currentChannelId,
    variant,
    message,
    duration,
    open,
    managerAction
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
  toggleDialog: toggle => dispatch(toggleDialog(toggle))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
