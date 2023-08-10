import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3001', { withCredentials: true });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        credentials: 'include', // Add this line to include cookies in the request
      });

      if (response.ok) {
        // Login successful, navigate to the chatbot page
        // emit the 'user logged in' event
        if (socket) {
          socket.emit('user logged in', username);
        }
        navigate('/chatbot');
      } else {
        // Login failed, handle the error
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Login failed. Please try again.';
        setErrorMessage(errorMessage); // Store the error message in state
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'An error occurred during login. Please try again.';
      setErrorMessage(errorMessage); // Store the error message in state
    }
  };

  const containerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '5px',
    padding: '20px',
    maxWidth: '300px',
    margin: 'auto',
  };

  const logoContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    paddingBottom: '20px', // Added padding to the bottom of the logo container
    width: '350px',
    margin: 'auto',
  };

  const logoStyle = {
    width: '200%', // Take up the full width of the logo container
    height: 'auto', // Keep the original aspect ratio
  };

  const fieldStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    boxSizing: 'border-box',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  return (
    <div className="login-page-background">
      <div style={logoContainerStyle}>
        <img src="./assets/images/Frame 1.png" alt="Your logo" style={logoStyle} />
      </div>
      <div style={containerStyle}>
        <label style={fieldStyle}>
          Username:
          <input type="text" style={fieldStyle} value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Password:
          <input type="password" style={fieldStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div style={buttonContainerStyle}>
          <button style={fieldStyle} onClick={handleLogin}>Login</button>
          <button style={fieldStyle} onClick={() => navigate('/register')}>Register</button>
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display the error message */}
      </div>
    </div>
  );
}

export default LoginForm;