import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import * as RTC from 'cube-rtc';

import React from 'react';
import { connect } from 'react-redux';

import VoiceSocket from './services/Voice/VoiceSocket';
import DataSocket from './services/Data/DataSocket';
import { MenuBar } from './components';
import {
  setVoiceAppId,
  setChannelList,
  setCurrentChannelId,
  setChannelJoinStatus,
  setIsAnswerCall,
  setWaitingList
} from './actions/voice';
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
  CDS_OPERATOR_LOGIN
} from './protocols';
import { VALUE_LENGTH, MANAGER_ACTIONS, MUTE_STATE, DATA_SERVER_VALUE_LENGTH } from './constants';
import './App.css';

const MANAGER_USERNAME = 'alice';
const MANAGER_PASSWORD = 'aliceTest';
const voiceSocket = new VoiceSocket();
const dataSocket = new DataSocket();

const sendManagerAction = (action, channelId) => {
  voiceSocket.writeBytes(Socket.createCMD(MANAGER_ACTION, bytes => {
    bytes.writeUnsignedInt(action);
    bytes.writeUnsignedInt(channelId);
  }));
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
          voiceAppId,
          currentChannelId,
          setChannelJoinStatus,
          setIsAnswerCall,
          setWaitingList
        } = this.props;

        switch(evt.data.respId) {
          case MANAGER_LOGIN_R:
            setVoiceAppId(evt.data.voiceAppId);
            RTC.init(evt.data.voiceAppId);
          break;

          case CHANNEL_LIST_R:
            setChannelList(evt.data.channelList);
          break;

          case CHANNEL_JOIN_R:
            const { code: joinStatus } = evt.data;

            setChannelJoinStatus(joinStatus);
            setIsAnswerCall(joinStatus === 0 ? true : false);

            if (joinStatus === 0) {
              await RTC.joinRoom(currentChannelId, voiceAppId);
              sendManagerAction(MANAGER_ACTIONS.JOIN_CHANNEL, currentChannelId);
            }
          break;

          case MANAGER_ACTION_R:
            const { code: actionStatus, action } = evt.data;
            const { LEAVE_CHANNEL, KICKOUT_CLIENT, BLACKLIST_CLIENT } = MANAGER_ACTIONS;

            if (actionStatus === 0) {
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

      voiceSocket.writeBytes(Socket.createCMD(CDS_OPERATOR_LOGIN, bytes => {
        bytes.writeUnsignedShort();
        bytes.writeUnsignedShort();
        bytes.writeBytes(Socket.stringToBytes('V010', VL_VIDEO_ID));
        bytes.writeBytes(Socket.stringToBytes(MANAGER_USERNAME, VL_USER_NAME));
        bytes.writeBytes(Socket.stringToBytes(MANAGER_PASSWORD, VL_PSW));
      }));
    });
    dataSocket.addEventListener(Socket.EVENT_PACKET, async (evt) => {
    });

    voiceSocket.autoConnect();
    // dataSocket.autoConnect();
  }

  joinChannel = channelId => {
    this.props.setCurrentChannelId(channelId);

    voiceSocket.writeBytes(Socket.createCMD(CHANNEL_JOIN, bytes => {
      bytes.writeUnsignedInt(channelId);
    }));
  }

  leaveChannel = channelId => {
    sendManagerAction(MANAGER_ACTIONS.LEAVE_CHANNEL, channelId);
  }

  assignTableToChannel = (channelId, vid) => {
    voiceSocket.writeBytes(Socket.createCMD(ASSIGN_TABLE_TO_CHANNEL, bytes => {
      bytes.writeUnsignedInt(channelId);
      bytes.writeBytes(Socket.stringToBytes(vid, VALUE_LENGTH.VID));
    }));
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

    sendManagerAction(action, channelId);
  }

  kickoutClient = channelId => {
    sendManagerAction(MANAGER_ACTIONS.KICKOUT_CLIENT, channelId);
  }

  blacklistClient = channelId => {
    sendManagerAction(MANAGER_ACTIONS.BLACKLIST_CLIENT, channelId);
  }

  render() {
    return (
      <div className="App">
        <MenuBar 
          joinChannel={this.joinChannel}
          leaveChannel={this.leaveChannel}
          assignTableToChannel={this.assignTableToChannel}
          toggleMuteChannel={this.toggleMuteChannel}
          kickoutClient={this.kickoutClient}
          blacklistClient={this.blacklistClient}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { voiceAppId, channelList, currentChannelId } = state.voice;
  return ({
    voiceAppId,
    channelList,
    currentChannelId
  });
};

const mapDispatchToProps = dispatch => ({
  setVoiceAppId: id => dispatch(setVoiceAppId(id)),
  setChannelList: list => dispatch(setChannelList(list)),
  setCurrentChannelId: id => dispatch(setCurrentChannelId(id)),
  setChannelJoinStatus: code => dispatch(setChannelJoinStatus(code)),
  setIsAnswerCall: answer => dispatch(setIsAnswerCall(answer)),
  setWaitingList: list => dispatch(setWaitingList(list))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
