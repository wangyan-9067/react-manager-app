import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import * as RTC from 'cube-rtc';

import React from 'react';
import { connect } from 'react-redux';

import VoiceSocket from './services/Voice/VoiceSocket';
import { MenuBar } from './components';
import {
  setVoiceAppId,
  setChannelList,
  setCurrentChannelId,
  setChannelJoinStatus,
  setIsAnswerCall
} from './actions/voice';
import {
  MANAGER_LOGIN,
  MANAGER_LOGIN_R,
  CHANNEL_LIST_R,
  CHANNEL_JOIN,
  CHANNEL_JOIN_R,
  MANAGER_ACTION,
  MANAGER_ACTION_R,
  ASSIGN_TABLE_TO_CHANNEL
} from './protocols';
import { VALUE_LENGTH, MANAGER_ACTIONS, MUTE_STATE } from './constants';
import './App.css';

const MANAGER_USERNAME = 'alice';
const MANAGER_PASSWORD = 'aliceTest';
const voiceSocket = new VoiceSocket();

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

        const { setVoiceAppId, setChannelList, voiceAppId, currentChannelId, setChannelJoinStatus, setIsAnswerCall } = this.props;

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

            if (actionStatus === 0) {
              switch(action) {
                case MANAGER_ACTIONS.LEAVE_CHANNEL:
                  RTC.leaveRoom();
                  setIsAnswerCall(false);
                break;

                default:
                break;
              }
            }
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

    voiceSocket.autoConnect();
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

  render() {
    return (
      <div className="App">
        <MenuBar 
          joinChannel={this.joinChannel}
          leaveChannel={this.leaveChannel}
          assignTableToChannel={this.assignTableToChannel}
          toggleMuteChannel={this.toggleMuteChannel}
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
  setIsAnswerCall: answer => dispatch(setIsAnswerCall(answer))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
