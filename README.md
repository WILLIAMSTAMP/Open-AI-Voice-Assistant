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

\```bash
git clone https://github.com/nova-ai-assistant/nova.git
\```

### Step 2: Install Dependencies

Navigate to both the server and client folders and run:

\```bash
npm install
\```

### Step 3: Configure OpenAI API Key

The application comes with a \`.env\` file containing:

\```env
OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"
\```

Replace the placeholder with your own OpenAI API key.

### Step 4: Configure Google Text-to-Speech API

Place the Google Cloud Text-to-Speech API credentials \`.json\` file in the root of the server folder. Then, update line 311 of the \`server.js\` code:

\```javascript
const serviceAccount = require('YOUR_API_CREDENTIALS_PATH.json');
\```

### Step 5: Run the Nova Server

From the server folder, run:

\```bash
npm run start-server
\```

### Step 6: Access Nova's Web Interface

Open your browser and navigate to:

\```url
http://localhost:3000
\```

## Contributing

See [Contributing Guidelines](CONTRIBUTING.md) for details on how to contribute to Nova.

## License

Nova is released under the MIT License. Feel free to use, modify, and distribute it according to the terms of the license.

## Contact

Have questions or feedback? Contact us at nova-support@example.com or join our Discord community at discord.gg/nova. We'd love to hear from you!

