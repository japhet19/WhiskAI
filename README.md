# WhiskAI - Your AI Food Companion

WhiskAI is a conversational AI application focused on food and cooking, powered by Google's Gemini AI. The application provides an interactive chat interface where users can get recipe ideas, cooking tips, and culinary inspiration.

## 🎉 New: Spoonacular Integration

WhiskAI now features real recipe photos and data from Spoonacular! When you ask Curie for recipe suggestions, you'll see:
- 📸 **Real food photos** (not stock images)
- ⏱️ **Accurate cooking times** and prep times
- 🥘 **Detailed ingredients** with measurements
- 📋 **Step-by-step instructions** from tested recipes
- 🔗 **Links to original recipes** for more details
- 🏷️ **Dietary tags** and cuisine information

## Features

- **Curie**: An AI food companion that can:
  - Suggest recipes based on available ingredients
  - Offer cooking tips and techniques
  - Explore diverse cuisines
  - Provide meal planning assistance
  - Inspire culinary creativity
  - **NEW**: Show real recipe cards with photos when suggesting dishes

- **Streaming Responses**: Real-time AI responses for a more natural conversation experience
- **Markdown Support**: Properly formatted recipes and cooking instructions
- **Enhanced Recipe Cards**: Beautiful recipe displays with images, nutrition info, and cooking details

## Prerequisites

Before running WhiskAI, you'll need:

- Node.js (v16+)
- Python 3.8+
- npm or yarn
- Google Gemini API key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))
- Spoonacular API key (get one from [Spoonacular](https://spoonacular.com/food-api))

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd WhiskAI
```

### 2. Configure environment variables

Create a `.env` file in the root directory with your API keys:

```
# Spoonacular API Key (required for recipe data)
SPOONACULAR_API_KEY=your_spoonacular_api_key_here

# For the React client, create client/.env.local
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 3. Install dependencies

Backend (Python):
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

Frontend (React):
```bash
cd client
npm install
```

### 4. Start the application

Start the backend server (in one terminal):
```bash
# From project root
source venv/bin/activate
python api.py
```

Start the React app (in another terminal):
```bash
cd client
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