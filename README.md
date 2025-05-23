# WhiskAI - Your AI Food Companion

WhiskAI is a conversational AI application focused on food and cooking, powered by Google's Gemini AI. The application provides an interactive chat interface where users can get recipe ideas, cooking tips, and culinary inspiration.

## Features

- **Curie**: An AI food companion that can:
  - Suggest recipes based on available ingredients
  - Offer cooking tips and techniques
  - Explore diverse cuisines
  - Provide meal planning assistance
  - Inspire culinary creativity

- **Streaming Responses**: Real-time AI responses for a more natural conversation experience
- **Markdown Support**: Properly formatted recipes and cooking instructions

## Prerequisites

Before running WhiskAI, you'll need:

- Node.js (v16+)
- npm or yarn
- Google Gemini API key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd WhiskAI
```

### 2. Configure environment variables

Create a `.env` file in the `client` directory with your Gemini API key:

```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install dependencies

```bash
cd client
npm install
```

### 4. Start the application

```bash
npm start
```

The application will launch and be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
WhiskAI/
├── client/              # React frontend application
│   ├── public/          # Static assets
│   ├── src/             # Source code
│   │   ├── components/  # React components
│   │   │   └── ChatInterface.tsx  # Main chat interface
│   │   ├── services/    # API services
│   │   │   └── geminiService.ts   # Gemini AI integration
│   │   └── App.tsx      # Main application component
│   ├── package.json     # Frontend dependencies
│   └── tsconfig.json    # TypeScript configuration
├── server/              # Backend server (placeholder for future development)
└── README.md            # Project documentation
```

## Technologies Used

- **Frontend**:
  - React 19
  - TypeScript
  - CSS
  - React Markdown

- **AI Integration**:
  - Google Generative AI SDK
  - Gemini 2.5 Flash Preview model

## Development Commands

- `npm start`: Start the development server
- `npm test`: Run tests
- `npm run build`: Build the application for production
- `npm run eject`: Eject from Create React App (use with caution)

## Future Development

The project includes placeholders for server-side development, suggesting potential for:

- Backend API integration
- User authentication
- Persistent conversation history
- More advanced food-related features

## License

[Add appropriate license information here]

## Contributing

[Add contribution guidelines if applicable]