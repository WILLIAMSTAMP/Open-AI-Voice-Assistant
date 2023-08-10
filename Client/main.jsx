import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import io from 'socket.io-client';
import SocketContext from './SocketContext';
import ChatGPT from './ChatGPT';
import Login from './Login';
import RegisterForm from './RegisterForm';
import Home from './Home';

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', { withCredentials: true });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  return (
    <React.StrictMode>
      <SocketContext.Provider value={socket}>
        <Router basename="/OpenAI-ChatBot">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chatbot" element={<ChatGPT />} />
          </Routes>
        </Router>
      </SocketContext.Provider>
    </React.StrictMode>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);