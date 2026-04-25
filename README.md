# prg8-AI-model

## GitHub repository
`https://github.com/martijnsark/prg8-AI-model`

## Installation instructions

### 1. Requirements
- Node.js 18 or higher
- npm
- A `.env` file with your AI configuration

### 2. Clone the project
```bash
git clone https://github.com/martijnsark/prg8-AI-model.git
cd prg8-AI-model
```

### 3. Install dependencies
```bash
npm install
```

### 4. Configure environment variables
Create a file named `.env` in the project root and add your AI configuration.

Example:
```env
AZURE_OPENAI_API_VERSION=
AZURE_OPENAI_API_INSTANCE_NAME=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_API_DEPLOYMENT_NAME=
AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME=
```

If you use Azure OpenAI, add the variables required by your Azure configuration.

### 5. Start the server
```bash
npm start
```

The app will run at:

`http://localhost:3000`

## Available scripts
- `npm start`: starts the Express server with `.env` in watch mode
- `npm test`: runs `chat.js` with `.env`