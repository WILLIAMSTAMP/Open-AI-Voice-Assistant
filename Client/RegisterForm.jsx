import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState('nurse'); // Default value is 'nurse'
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        userType: userType, // Include userType in the request body
      }),
    });

    if (response.ok) {
      navigate('/login');
    } else {
      // Registration failed, handle the error
      // ...
    }
  };

  const userTypeOptions = ['nurse', 'resident', 'admin'];

  
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
    paddingBottom: '20px', 
    width: '350px',
    margin: 'auto',
  };

  const logoStyle = {
    width: '100%', 
    height: 'auto', 
  };

  const fieldStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    boxSizing: 'border-box',
  };

  return (
    <div className="register-page-background">
      <div style={logoContainerStyle}>
        <img src="./assets/images/Frame 1.png" alt="Your logo" style={logoStyle} />
      </div>
      <div style={containerStyle}>
        <label style={fieldStyle}>
          First Name:
          <input type="text" style={fieldStyle} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Last Name:
          <input type="text" style={fieldStyle} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Username:
          <input type="text" style={fieldStyle} value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label style={fieldStyle}>
          Password:
          <input type="password" style={fieldStyle} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div style={fieldStyle}>
          User Type:
          {userTypeOptions.map(option => (
            <label key={option} style={{ display: 'block' }}>
              <input
                type="radio"
                name="userType"
                value={option}
                checked={userType === option}
                onChange={(e) => setUserType(e.target.value)}
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
        <button style={fieldStyle} onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default RegisterForm;