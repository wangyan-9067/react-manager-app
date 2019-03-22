import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import * as RTC from 'cube-rtc';

import React from 'react';
import { connect } from 'react-redux';

import VoiceSocket from './services/Voice/VoiceSocket';
import { MenuBar } from './components';
import { setVoiceAppId, setChannelList } from './actions/voice';
import { MANAGER_LOGIN, MANAGER_LOGIN_R, CHANNEL_LIST_R } from './protocols';
import { VALUE_LENGTH } from './constants';
import './App.css';

const MANAGER_USERNAME = 'alice';
const MANAGER_PASSWORD = 'alice';
const voiceSocket = new VoiceSocket();

class App extends React.Component {
  async componentDidMount() {
    voiceSocket.addEventListener(Socket.EVENT_OPEN, evt => {
      voiceSocket.writeBytes(Socket.createCMD(MANAGER_LOGIN, bytes => {
        bytes.writeUTFBytes(MANAGER_USERNAME);
        bytes.position = VALUE_LENGTH.LOGIN_NAME;
        bytes.writeUTFBytes(MANAGER_PASSWORD);
      }));
    });
    
    voiceSocket.addEventListener(Socket.EVENT_PACKET, evt => {
      if (evt.$type === Socket.EVENT_PACKET) {
        console.log(`${Socket.EVENT_PACKET} data:`, evt.data);

        const { setVoiceAppId, setChannelList } = this.props;

        switch(evt.data.respId) {
          case MANAGER_LOGIN_R:
            setVoiceAppId(evt.data.voiceAppId);
            RTC.init(evt.data.voiceAppId);
          break;
          
          case CHANNEL_LIST_R:
            setChannelList(evt.data.channelList);
          break;

          default:
          break;
        }
      }
    });

    voiceSocket.autoConnect();
  }

  render() {
    return (
      <div className="App">
        <MenuBar />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { voiceAppId, channelList } = state.voice;
  return ({
    voiceAppId: voiceAppId,
    channelList: channelList
  });
};

const mapDispatchToProps = dispatch => ({
  setVoiceAppId: id => dispatch(setVoiceAppId(id)),
  setChannelList: list => dispatch(setChannelList(list))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
