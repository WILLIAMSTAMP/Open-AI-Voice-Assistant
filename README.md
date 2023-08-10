# Open-AI-Voice-Assistant# Nova - Your AI-Powered Virtual Assistant
!![Screenshot 2023-06-25 011940](https://github.com/WILLIAMSTAMP/Open-AI-Voice-Assistant/assets/100212618/937c22b4-3c3b-4993-8aa7-f72e09145e96)
)

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

1. **Download and Install SQL Workbench:** If you don't have SQL Workbench installed, you can download it from [here](https://www.mysql.com/products/workbench/). Follow the installation instructions for your operating system.

2. **Create a New Connection:** Open SQL Workbench and click on the "+" button to create a new connection. Enter the following details:
   - **Connection Name:** Name your connection (e.g., "NovaDB").
   - **Hostname:** "localhost" (as used in the code).
   - **Port:** The default MySQL port is 3306.
   - **Username & Password:** Use "root" as the username and leave the password field empty (as used in the code).

3. **Create the Database:** Execute the following SQL command to create the Nova database:
   ```sql
   CREATE DATABASE nova;
   USE nova;
   ```

4. **Create Tables:** Create the necessary tables by executing the SQL commands provided in the `database.sql` file in the repository.

5. **Configure Application:** The connection properties are already defined in the code with the following details:
   - **Host:** "localhost"
   - **User:** "root"
   - **Password:** "" (YOUR_PASSWORD)
   - **Database:** "nova"
   - **Connection Limit:** 10

   Ensure that these details are consistent with your database setup.

## Getting Started

### Step 1: Clone the Repository

\```
git clone (https://github.com/WILLIAMSTAMP/Open-AI-Voice-Assistant.git)
\```

### Step 2: Install Dependencies

Navigate to both the server and client folders and run:

\```
npm install
\```

### Step 3: Configure OpenAI API Key

The application comes with a \`.env\` file containing:

\```
OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"
\```

Replace the placeholder with your own OpenAI API key.

### Step 4: Configure Google Text-to-Speech API

Place the Google Cloud Text-to-Speech API credentials \`.json\` file in the root of the server folder. Then, update line 311 of the \`server.js\` code:

\```
const serviceAccount = require('YOUR_API_CREDENTIALS_PATH.json');
\```

### Step 5: Run the Nova Server

From the server folder, run:

\```
npm run start-server
\```

### Step 6: Access Nova's Web Interface

Open your browser and navigate to:

\```
(http://localhost:5173/OpenAI-ChatBot/register) and register a new user
\```

## Contributing

See [Contributing Guidelines](CONTRIBUTING.md) for details on how to contribute to Nova.

## License

Nova is released under the MIT License. Feel free to use, modify, and distribute it according to the terms of the license.

## Contact

Have questions or feedback? Contact us at nova-support@example.com or join our Discord community at discord.gg/nova. We'd love to hear from you!

