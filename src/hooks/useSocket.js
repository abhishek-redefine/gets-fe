import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (serverPath) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io(serverPath);

    socketIo.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socketIo.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Cleanup on unmount
    return () => {
      socketIo.disconnect();
    };
  }, [serverPath]);

  return socket;
};

export default useSocket;
