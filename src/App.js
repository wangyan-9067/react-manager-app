import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import React from 'react';

import VoiceSocket from './Services/Voice/VoiceSocket';
import { MenuBar } from './Components';
import './App.css';

const voiceSocket = new VoiceSocket();

class App extends React.Component {
  async componentDidMount() {
    voiceSocket.addEventListener(Socket.EVENT_OPEN, evt => {
      console.log("onSocketOpen", evt);
    });

    voiceSocket.addEventListener(Socket.EVENT_PACKET, evt => {
      if (evt.$type === Socket.EVENT_PACKET) {
        console.log("onSocketData", evt);
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

export default App;
