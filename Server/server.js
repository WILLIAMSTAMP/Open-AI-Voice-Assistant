// Importing Express.js framework
const express = require('express');
// Importing HTTP module
const http = require('http');
// Importing Socket.io for real-time communication
const { Server } = require('socket.io');
// Importing CORS middleware
const cors = require('cors');
// Importing Google Text-to-Speech library
const textToSpeech = require('@google-cloud/text-to-speech');
// Importing MySQL promise-based library
const mysql = require('mysql2/promise');
// Importing Express session middleware
const session = require('express-session');
// Importing Passport.js for authentication
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Importing bcrypt for password hashing
const bcrypt = require('bcrypt');
// Importing node-fetch for making HTTP requests
const fetch = require('node-fetch');
// Importing path module for working with file paths
const path = require('path');
// const sessionMiddleware = require('./sessionMiddleware');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
const MySQLStore = require('express-mysql-session')(session);
// Creating an Express application instance
const app = express();
// Creating an HTTP server using Express app
const server = http.createServer(app);
const sessions = require('client-sessions');
const currentDate = new Date();
const userTypes = ['admin', 'general', 'system admin'];
require('dotenv').config();
const openaikey = process.env.OPENAI_API_KEY;
// options for the session cookie
const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'YOUR_PASSWORD_HERE',
  database: 'nova'
};
// session store
const sessionStore = new MySQLStore(options);

const sessionMiddleware = session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: true,
  saveUninitialized: true
});

app.use(sessionMiddleware);

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

// cors options for socket.io
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// middleware to check if a user is logged in
// Defining a GET route for handling requests to '/api/data'
app.get('/api/data', async function(req, res) {
  const data = { key: 'value' };
// Sending the response for the current route
  res.json(data);
});

// middleware to check if a user is logged in
passport.use(new LocalStrategy(
  async function(username, password, done) {
    const pool = await getDbPool();
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length > 0) {
      const user = users[0];
      if (await bcrypt.compare(password, user.password)) {
        console.log('Login successful');
        await pool.query('INSERT INTO conversations (sender, message, user_type) VALUES (?, ?, ?)', ['system', `User ${username} logged in.`, user.user_type]); // Include user_type here
        return done(null, user);
      } else {
        console.log('Incorrect password');
        await pool.query('INSERT INTO messages (sender, message) VALUES (?, ?)', ['system', `Failed login attempt for user ${username}.`]);
        return done(null, false, { message: 'Incorrect password.' });
      }
    } else {
      console.log('User not found');
      await pool.query('INSERT INTO messages (sender, message) VALUES (?, ?)', ['system', `Failed login attempt for unknown user ${username}.`]);
      return done(null, false, { message: 'Incorrect username.' });
    }
  }
));

let pool;

// Setup the database
async function setupDatabase() {
  const pool = await getDbPool();

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      user_type ENUM('nurse', 'resident', 'admin') NOT NULL
    )
  `;
  await pool.query(createUsersTable);

  const createConversationsTable = `
    CREATE TABLE IF NOT EXISTS conversations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender VARCHAR(255),
      message TEXT,
      user_type ENUM('nurse', 'resident', 'admin'),
      date DATETIME
    )
  `;
  await pool.query(createConversationsTable);

  const createConversationSummaryTable = `
    CREATE TABLE IF NOT EXISTS convosummary (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender VARCHAR(255),
      summary TEXT,
      user_type ENUM('nurse', 'resident', 'admin'),
      date DATETIME
    )
  `;
  await pool.query(createConversationSummaryTable);
}

async function getDbPool() {
  if (pool) return pool;

  // Create a MySQL pool to connect to the database
  pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nova',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return pool;
}

// client-side routing
app.use(express.static(path.join(__dirname, '..', 'client')));

// register a user with a username and password 
// Defining a POST route for handling requests to '/register'
app.post('/register', async function(req, res) {
  const { username, password, firstName, lastName, userType } = req.body; // add userType here

  const hashedPassword = await bcrypt.hash(password, 10);

  const pool = await getDbPool();
  // include userType in the query
  await pool.query('INSERT INTO users (username, password, first_name, last_name, user_type) VALUES (?, ?, ?, ?, ?)', 
    [username, hashedPassword, firstName, lastName, userType]);

// Sending the response for the current route
  res.sendStatus(200);
});


let users = {}; // An object to store usernames and socket IDs
// login a user with a username and password
// Defining a POST route for handling requests to '/login'
app.post('/login', function(req, res, next) {
  passport.authenticate('local', async function(err, user, info) {
    try {
      if (err) {
        throw err; // Throw the error to be caught by the error handler
      }
      if (!user) {
        console.log('Authentication failed');
        return res.status(401).json({ message: 'Authentication failed' });
      }

      req.logIn(user, async function(err) {
        try {
          if (err) {
            throw err; // Throw the error to be caught by the error handler
          }

          req.session.username = user.username;
          console.log(req.session); // log the session data

          console.log('Login successful');
          console.log(req.session.username, " has logged in");

          // Save the login event to the conversations table
          await saveMessageToDatabase('system', `User ${user.username} logged in.`, user.user_type); // Include user_type here

          io.emit('user logged in', user.username); // Send an event to the client when a user logs in

          // Moved the response here
          return res.status(200).json({ message: 'Login successful' });
        } catch (err) {
          // Handle any error that occurs during req.logIn
          console.error('Error during login:', err);
          return res.status(500).json({ message: 'An error occurred during login' });
        }
      });
    } catch (err) {
      // Handle any error that occurs during passport.authenticate
      console.error('Error during authentication:', err);
      return res.status(500).json({ message: 'An error occurred during authentication' });
    }
  })(req, res, next);
});


// Logout a user
// Defining a GET route for handling requests to '/logout'
app.get('/logout', async function(req, res) {
  console.log('Logout route called'); // Add this line
  const username = req.session.username;

  // Generate the conversation summary
  const summary = await generateConversationSummary(username);
  console.log('Generating conversation summary for username:', username); // Add this line
  console.log('Generated summary:', summary);

  // Save the summary to the convosummary table
  const userType = await getUserTypeByUsername(username); // Fetch the user's user_type
  await saveConversationSummaryToDatabase(username, summary, userType);
  console.log('Saving conversation summary:', { username, summary, userType }); // Add this line
  console.log('Conversation summary saved to the database');

  // Clear the user's session and remove from the users object
  req.logout(); // This will remove the user's session and session data
  delete users[req.sessionID];

  console.log('User logged out:', username);

  // Emit an event to notify the client about the logout
  io.emit('user logged out', username);

  // Redirect the user to the login page or any other appropriate page
// Sending the response for the current route
  res.redirect('/login');
});



// Function to generate the conversation summary
async function generateConversationSummary(username) {
  console.log('Generating conversation summary for username:', username);

  const pool = await getDbPool();
  const [messages] = await pool.query('SELECT sender, message FROM conversations WHERE sender = ? AND user_type IS NOT NULL AND user_type <> ""', [username]);

  console.log('Retrieved messages:', messages);

  // Concatenate the messages into a single summary string
  const summary = messages.map(message => `${message.sender}: ${message.message}`).join('\n');

  console.log('Generated summary:', summary);

  return summary;
}

// Function to save the conversation summary to the convosummary table
async function saveConversationSummaryToDatabase(username, summary, userType) {
  const pool = await getDbPool();

  const insertQuery = 'INSERT INTO convosummary (sender, summary, user_type, date) VALUES (?, ?, ?, NOW())';
  await pool.query(insertQuery, [username, summary, userType]);

  console.log('Conversation summary saved to the database.');
}




// serialize and deserialize the user to and from the session
passport.serializeUser(function(user, done) {
  username = user.username;
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const pool = await getDbPool();
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (users.length > 0) {
      const user = {
        id: users[0].id,
        username: users[0].username,
        password: users[0].password,
        firstName: users[0].first_name,
        lastName: users[0].last_name,
        user_type: users[0].user_type
      };
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  } catch (err) {
    done(err);
  }
});

// GOOGLE CLOUD TEXT TO SPEECH API SETUP 
// Importing Google Text-to-Speech API credentials from a JSON file (Update this path with your credentials file)
const serviceAccount = require('./GOOGLE_APPLICATION_CREDENTIALS.json');
const clientEmail = serviceAccount.client_email;
const privateKey = serviceAccount.private_key;

// text-to-speech API
async function generateSpeech(message) {
  try {
    // Update the voice configuration to use a female voice
    const request = {
      input: { text: message },
      voice: { languageCode: 'en-US', name: "en-US-Standard-F", ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Rest of the code remains the same
    const client = new textToSpeech.TextToSpeechClient({
      credentials: {
        private_key: privateKey,
        client_email: clientEmail,
      },
    });

    const [synthesizeResponse] = await client.synthesizeSpeech(request);

    return synthesizeResponse.audioContent;
  } catch (error) {
    console.error('Text-to-Speech API Error:', error);
    throw new Error('Error occurred during text-to-speech synthesis.');
  }
}


// socket.io setup 
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// isPlayingAudio is used to prevent the server from playing multiple audio files at once
let isPlayingAudio = false;

// socket.io connection
// Setting up a listener for Socket.io connection events
io.on('connection', (socket) => {
  console.log('a user connected:', socket.request.session.username);

  // Reload the session to fetch the latest data
  socket.request.session.reload(async function(err) {
    if (err) {
      console.error('Error reloading session:', err);
      return;
    }
    
    const username = socket.request.session.username;
    if (username) {
      users[socket.id] = username;
      const previousConversations = await fetchPreviousConversations(username);
      socket.emit('previous conversations', previousConversations);
    }
  });

  // Handle chat messages from the client
  socket.on('chat', async (data) => {
    const { message } = data;
    const username = users[socket.id];

    const userMessage = {
      sender: username,
      message: message,
    };

    try {
      console.log("Saving user message to database");
      await saveMessageToDatabase(userMessage.sender, userMessage.message);
      
      console.log("Fetching previous conversations");
      const previousConversations = await fetchPreviousConversations(username); 
      
      console.log("Processing message with ChatGPT");
      const botResponse = await processMessageToChatGPT(userMessage.message, username, previousConversations);
      
      console.log("Saving bot message to database");
      await saveMessageToDatabase('ChatGPT', botResponse);
      
      console.log("Generating speech");
      const botAudioBuffer = await generateSpeech(botResponse);
      console.log("Generated speech");
      
      if (!isPlayingAudio) {
        console.log("Bot response before emit:", botResponse);
        console.log("Emitting 'audio' event with botResponse:", botResponse);
        socket.emit('audio', botAudioBuffer, botResponse);
        isPlayingAudio = true;
      } else {
        setTimeout(() => {
          console.log("Emitting 'audio' event with botResponse after delay:", botResponse);
          socket.emit('audio', botAudioBuffer, botResponse);
        }, 2000);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      // Handle the error, if needed
    }
  });



// When a user logs out
socket.on('logout', async () => {
  console.log('Logout event received');

  const username = users[socket.id];

  // Generate the conversation summary
  const summary = await generateConversationSummary(username);

  console.log('Generated summary:', summary);

  // Save the summary to the convosummary table
  const userType = await getUserTypeByUsername(username); // Fetch the user's user_type
  await saveConversationSummaryToDatabase(username, summary, userType);

  console.log('Conversation summary saved to the database');

  // Clear the user's session and remove from the users object
  socket.request.session.destroy();
  delete users[socket.id];

  console.log('User logged out:', username);

  socket.emit('logout');


});

  // Handle audio playback completion
  socket.on('audioPlaybackFinished', () => {
    isPlayingAudio = false;
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    delete users[socket.id]; // Remove the username when the user disconnects
    console.log('A client disconnected');
  });
});

function isAdmin(userType) {
  return userType === 'admin';
}

async function getUserTypeByUsername(username) {
  const pool = await getDbPool();
  const [users] = await pool.query('SELECT user_type FROM users WHERE username = ?', [username]);

  if (users.length > 0) {
    return users[0].user_type;
  } else {
    return null; // User not found or user_type not available
  }
}

// Function to generate the conversation summary
async function generateConversationSummary(username) {
  console.log('Generating conversation summary for username:', username);

  const pool = await getDbPool();
  const [messages] = await pool.query('SELECT sender, message FROM conversations WHERE sender = ?', [username]);

  console.log('Retrieved messages:', messages);

  // Concatenate the messages into a single summary string
  const summary = messages.map(message => `${message.sender}: ${message.message}`).join('\n');

  console.log('Generated summary:', summary);

  return summary;
}

async function fetchPreviousConversations(username) {
  const pool = await getDbPool();
  const [conversations] = await pool.query('SELECT sender, message, user_type, date FROM conversations WHERE sender = ? AND user_type IS NOT NULL AND user_type <> ""', [username]);

  const previousConversations = conversations.map(conversation => ({
    role: 'user',
    content: conversation.message,
    date: conversation.date,
    user_type: conversation.user_type,
  }));

  return previousConversations;
}

async function fetchUserDetails(username) {
  const pool = await getDbPool();
  const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

  if (users.length > 0) {
    const user = users[0];
    // Customize the returned user details based on your database structure
    const userDetails = {
      interests: user.interests,
      // Add more user details fields as needed
    };
    return userDetails;
  } else {
    return null; // User not found
  }
}

// process message to chatGPT
async function processMessageToChatGPT(message, username, userType) {
  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  let systemMessageContent = '';
  const userDetails = await fetchUserDetails(username); // Implement the function to fetch user details from the database
  const previousConversations = await fetchPreviousConversations(username); // Fetch previous conversations for context

  if (!userDetails) {
    // If user details are not available, ask the user to provide their details
    systemMessageContent = `Hello, ${username}! I would like to get to know you better. Could you please share some information about yourself? For example, you can tell me your interests, hobbies, or any specific topics you'd like to discuss. Let's start building our conversation!`;
  } else {
    // If user details are available, use them to personalize the system message
    systemMessageContent = `Welcome back, ${username}! I'm Nova, your personal assistant. How can I assist you today?\n\n`;

    if (previousConversations.length > 0) {
      // If there are previous conversations, extract context and generate follow-up questions
      const lastConversation = previousConversations[previousConversations.length - 1];
      const lastMessage = lastConversation.message;

      // Generate follow-up questions based on the last message in the conversation
      // You can customize this logic based on your specific use case
      systemMessageContent += `Based on our previous conversation where you mentioned "${lastMessage}", can you provide more details about that? What specifically would you like to know or discuss related to "${lastMessage}"?`;
    } else {
      // If there are no previous conversations, provide a generic prompt for further interaction
      systemMessageContent += `How can I assist you today?`;
    }
  }

  const systemMessage = {
    sender: 'ChatGPT',
    message: systemMessageContent,
    date: getCurrentDate(),
  };


  // Include previous conversations in the messages array
  const messages = [
    { role: 'system', content: systemMessageContent },
    ...previousConversations,
    { role: 'user', content: message }
  ];
  

  const apiRequestBody = {
    model: 'gpt-4',
    messages: messages.map(message => ({
      role: message.role,
      content: message.content
    })),
  };

  // Rest of the code remains the same
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaikey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiRequestBody),
  });

  const data = await response.json();
  console.log('Data:', data);
  const botMessageContent = data.choices[0]?.message?.content;
  console.log('Bot message content:', botMessageContent);

  return botMessageContent;
}

// save message to database
async function saveMessageToDatabase(sender, message) {
  const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log('Saving message:', { sender, message, date: formattedDate });

  const pool = await getDbPool();
  const userType = await getUserTypeByUsername(sender); // Fetch the user's user_type

  await pool.query('INSERT INTO conversations (sender, message, user_type, date) VALUES (?, ?, ?, DATE_FORMAT(?, "%Y-%m-%d %H:%i:%s"))', [sender, message, userType, formattedDate]);
}
// Function to save the conversation summary to the convosummary table
async function saveConversationSummaryToDatabase(username, summary, userType) {
  console.log('Saving conversation summary:', { username, summary, userType });

  const pool = await getDbPool();

  const insertQuery = 'INSERT INTO convosummary (sender, summary, user_type, date) VALUES (?, ?, ?, ?)';
  const currentDate = new Date();
  await pool.query(insertQuery, [username, summary, userType, currentDate]);
  
  console.log('Conversation summary saved to the database.');
}
async function preloadBotData() {
  const pool = await getDbPool();

  // Fetch conversation summaries from the convosummary table
  const [summaries] = await pool.query('SELECT sender, summary, user_type FROM convosummary');

  // Store the summaries in a data structure accessible to the bot
  const conversationSummaries = {};
  summaries.forEach(summary => {
    const { sender, summary: summaryContent, user_type: userType } = summary;
    conversationSummaries[sender] = { summary: summaryContent, userType };
  });

  // Pass the conversation summaries to the bot for reference
  // Example: bot.setConversationSummaries(conversationSummaries);

  console.log('Bot data preloaded successfully');
}

async function startServer() {
  try {
    await setupDatabase();

    await preloadBotData();

    const port = 3001;
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

startServer();
