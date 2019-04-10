import React from 'react';

import VoiceSocket from '../services/Voice/VoiceSocket';
import DataSocket from '../services/Data/DataSocket';

const voiceSocket = new VoiceSocket();
const dataSocket = new DataSocket();

const SocketContext = React.createContext();
const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider
      value={{
        voice: voiceSocket,
        data: dataSocket
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const SocketConsumer = SocketContext.Consumer;

export { SocketProvider as ContextProvider, SocketConsumer as ContextConsumer };
