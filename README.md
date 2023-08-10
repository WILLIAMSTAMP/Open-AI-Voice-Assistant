# Nova - Your AI+Voice Virtual Assistant ![Screenshot 2023-06-25 011940](https://github.com/WILLIAMSTAMP/Open-AI-Voice-Assistant/assets/100212618/937c22b4-3c3b-4993-8aa7-f72e09145e96)

Nova is an innovative AI-powered virtual assistant that aims to revolutionize the way we interact with technology. With advanced natural language processing capabilities and a friendly personality, Nova is here to simplify your life and provide personalized support through verbal communication.

## Key Features

- **Conversational Interface:** Engage in natural, human-like conversations with Nova.
- **Personalized Assistance:** Nova adapts to your preferences, learns from your interactions, and tailors its responses to meet your needs.
- **Task Automation:** Delegate repetitive tasks to Nova, allowing you to focus on more important matters.
- **Knowledge Base:** Tap into Nova's vast knowledge base for instant access to information on various topics.
- **Intuitive Voice Commands:** Control your devices, schedule appointments, set reminders, and more using simple voice commands (coming soon).
- **Seamless Integration:** Nova seamlessly integrates with popular platforms and services, making it a versatile assistant for all your needs (coming soon).

## Personalized Conversational Experience with Nova
Nova is designed to offer a highly personalized and engaging conversational experience. By recording users' conversations and remembering details about the user and the context of their interactions, Nova tailors its responses and support to individual preferences and needs.

### Conversation Summaries
After each session, when the user logs out, Nova creates a summary of the conversation. This summary includes key points, topics discussed, user preferences, and other contextually relevant information. By maintaining a record of these summaries, Nova builds a continuous understanding of the user's interactions and needs over time.

These conversation summaries enable Nova to:

- **Provide Contextual Support:** Nova can reference previous conversations to offer more relevant and personalized assistance.
- **Learn and Adapt:** By analyzing conversation summaries, Nova learns from the user's behavior and preferences to continually improve its support.
- **Enhance User Engagement:** By recognizing the user's history and preferences, Nova fosters a more engaging and interactive experience.

### Privacy Considerations
Nova's conversation recording and summarization feature is built with privacy in mind. All conversations are handled securely, and users have control over their data. For more details on privacy and data handling, please refer to the [Privacy Policy](PRIVACY_POLICY.md).

By utilizing conversation summaries, Nova aims to unlock a new level of productivity and convenience, making it a truly intelligent and adaptive virtual assistant that grows with you.

## Database Setup
To set up the SQL database for Nova, follow these steps using SQL Workbench:

- **Download and Install SQL Workbench:** If you don't have SQL Workbench installed, you can download it from [here](https://www.mysql.com/products/workbench/). Follow the installation instructions for your operating system.
- **Create a New Connection:** Open SQL Workbench and click on the "+" button to create a new connection. Enter the following details:
  - **Connection Name:** Name your connection (e.g., "NovaDB").
  - **Hostname:** "localhost" (as used in the code).
  - **Port:** The default MySQL port is 3306.
  - **Username & Password:** Use "root" as the username and user your password.
  - **Create the Database:** Execute the following SQL command to create the Nova database:
    ```sql
    CREATE DATABASE nova;
    USE nova;
    ```
  - **Create Tables:** The necessary tables are automatically created by the server code. Refer to `server.js` for the database setup(line 38 - 44)
  - **Configure Application:** The connection properties are already defined in the code with the following details:
    - **Host:** "localhost"
    - **User:** "root"
    - **Password:** "YOUR PASSWORD" (Also update password on line 42 in server.js)
    - **Database:** "nova"
    - **Connection Limit:** 10
    Ensure that these details are consistent with your database setup.

## Getting Started

### Prerequisites

Before starting, ensure that you have Node.js installed on your system. If not, download and install it from [here](https://nodejs.org/).

### Step 1: Clone the Repository

\```
git clone https://github.com/WILLIAMSTAMP/Open-AI-Voice-Assistant.git
\```

### Step 2: Install Dependencies
Navigate to both the server and client folders and run:

\```
npm install
\```

### Step 3: Configure OpenAI API Key
The application comes with a `.env` file containing:

\```
OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"
\```

Replace the placeholder with your own OpenAI API key.

### Step 4: Configure Google Text-to-Speech API
To integrate the Google Cloud Text-to-Speech API with Nova, follow these steps:

### Step 1: Create a Google Cloud Platform (GCP) Project

1. Navigate to [Google Cloud Platform Console](https://console.cloud.google.com/).
2. Click on "CREATE PROJECT" and enter a project name and other details.
3. Click "CREATE" to create the project.

### Step 2: Enable Text-to-Speech API

1. In the left-hand menu, go to "APIs & Services" > "Dashboard."
2. Click "ENABLE APIS AND SERVICES."
3. Search for "Text-to-Speech API" and click on it.
4. Press the "ENABLE" button to activate the API for your project.

### Step 3: Create Credentials

1. Go to "APIs & Services" > "Credentials."
2. Click "Create credentials" and select "Service account."
3. Fill in the required information and click "CREATE."
4. Assign the necessary roles, such as "Text-to-Speech User," and click "CONTINUE."
5. Click "DONE" to create the service account.

### Step 4: Download JSON Key File

1. In the "Credentials" tab, find the service account you just created and click the pencil icon to edit it.
2. Go to the "KEYS" tab and click "ADD KEY" > "Create new key."
3. Choose "JSON" as the key type and click "CREATE."
4. The JSON key file will be downloaded to your computer.

### Step 5: Configure Nova Application

1. Place the downloaded JSON key file in the root of the server folder of Nova.
2. Update line 311 of the \`server.js\` code with the path to the JSON file:

   \```
   const serviceAccount = require('YOUR_API_CREDENTIALS_PATH.json');
   \```

### Step 6: Install Google Cloud Text-to-Speech Client Library

If not already installed, add the Google Cloud Text-to-Speech client library to your project:

\```
npm install --save @google-cloud/text-to-speech
\```

Now, Nova should be configured to use Google Cloud Text-to-Speech API for text-to-speech functionality.

Please replace the placeholders with the actual values relevant to your setup.

### Step 5: Run the Nova Server
From the server folder, run:

\```
node server

NOTE: you will get this error when running server before you register a user. 

(base) PS C:\Users\William\Desktop\Open-AI-Voice-Assistant\Server> node server
Bot data preloaded successfully
Server is running on http://localhost:3001
a user connected: undefined
Error reloading session: Error: failed to load session
    at C:\Users\William\Desktop\Open-AI-Voice-Assistant\Server\node_modules\express-session\session\session.js:94:26
    at C:\Users\William\Desktop\Open-AI-Voice-Assistant\Server\node_modules\express-mysql-session\index.js:435:38

Just create a new user and log in after running client.  

\```

### Step 6: Access Nova's Web Interface
Open your browser and navigate to:

\```
http://localhost:5173/OpenAI-ChatBot/register
\```
and register a new user.

## Contributing

See [Contributing Guidelines](CONTRIBUTING.md) for details on how to contribute to Nova.

## License

Nova is released under the MIT License. Feel free to use, modify, and distribute it according to the terms of the license.

## Contact

Have questions or feedback? Contact us at nova-support@example.com or join our Discord community at discord.gg/nova. We'd love to hear from you!

