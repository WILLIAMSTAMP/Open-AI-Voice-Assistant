import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import SocketContext from './SocketContext';

function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = io('http://localhost:3001', { withCredentials: true });
      setSocket(newSocket);
    }

    // return a cleanup function to be run when the component unmounts
    // return () => newSocket.disconnect();
    return () => newSocket.disconnect();
  }, [socket]); // add 'socket' as a dependency of useEffect

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;