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
  setChannelJoinStatus
} from './actions/voice';
import {
  MANAGER_LOGIN,
  MANAGER_LOGIN_R,
  CHANNEL_LIST_R,
  CHANNEL_JOIN,
  CHANNEL_JOIN_R,
  MANAGER_ACTION,
  MANAGER_ACTION_R
} from './protocols';
import { VALUE_LENGTH } from './constants';
import './App.css';

const MANAGER_USERNAME = 'alice';
const MANAGER_PASSWORD = 'aliceTest';
const voiceSocket = new VoiceSocket();

class App extends React.Component {
  async componentDidMount() {
    voiceSocket.addEventListener(Socket.EVENT_OPEN, evt => {
      voiceSocket.writeBytes(Socket.createCMD(MANAGER_LOGIN, bytes => {
        bytes.writeBytes(Socket.stringToBytes(MANAGER_USERNAME, VALUE_LENGTH.LOGIN_NAME));
        bytes.writeBytes(Socket.stringToBytes(MANAGER_PASSWORD, VALUE_LENGTH.PASSWORD));
      }));
    });

    voiceSocket.addEventListener(Socket.EVENT_PACKET, evt => {
      if (evt.$type === Socket.EVENT_PACKET) {
        console.log(`${Socket.EVENT_PACKET} data:`, evt.data);

        const { setVoiceAppId, setChannelList, voiceAppId, currentChannelId } = this.props;

        switch(evt.data.respId) {
          case MANAGER_LOGIN_R:
            setVoiceAppId(evt.data.voiceAppId);
            RTC.init(evt.data.voiceAppId);
          break;

          case CHANNEL_LIST_R:
            setChannelList(evt.data.channelList);
          break;

          case CHANNEL_JOIN_R:
            setChannelJoinStatus(evt.data.code);

            if (evt.data.code === 0) {
              RTC.joinRoom(currentChannelId, voiceAppId);
            }
          break;

          case MANAGER_ACTION_R:
            if (evt.data.code === 0) {
              RTC.leaveRoom();
            }
          break;

          default:
          break;
        }
      }
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
    voiceSocket.writeBytes(Socket.createCMD(MANAGER_ACTION, bytes => {
      bytes.writeUnsignedInt(1);
      bytes.writeUnsignedInt(channelId);
    }));
  }

  render() {
    return (
      <div className="App">
        <MenuBar joinChannel={this.joinChannel} leaveChannel={this.leaveChannel} />
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
  setChannelJoinStatus: code => dispatch(setChannelJoinStatus(code))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
