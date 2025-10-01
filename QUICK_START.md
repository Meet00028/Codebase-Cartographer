# Codebase Cartographer - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Set Up Your API Key
1. Get a free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
3. Add your API key to the `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

### Step 2: Start the Application
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 3: Try It Out
1. **Test with Demo Files**: Upload the files from the `demo-files/` folder to see how it works
2. **Upload Your Code**: Drag and drop your own project files
3. **Explore**: Click on nodes to see AI-generated summaries and code details

## 🎯 What You'll See

- **Interactive Graph**: Your files as nodes, dependencies as connecting lines
- **AI Summaries**: Click any file to get an intelligent analysis
- **Code Viewer**: See the actual source code alongside the AI summary
- **Dependency Mapping**: Understand how your files connect to each other

## 💡 Tips

- Start with a small project (5-20 files) to get familiar
- The AI works best with well-commented, structured code
- Use the minimap to navigate large codebases
- Zoom and pan to explore different parts of your project

## 🛠️ Troubleshooting

**No AI summaries?** → Check your API key in the `.env` file
**Files not connecting?** → Ensure you're using standard import/require syntax
**Upload issues?** → Make sure files have supported extensions (.js, .jsx, .ts, .tsx, .py, etc.)

Ready to map your codebase? Let's go! 🗺️
