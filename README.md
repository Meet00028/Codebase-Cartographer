# Codebase Cartographer

A developer tool that helps engineers quickly understand complex software projects through interactive visualization and AI-powered summaries.

## Features

🗺️ **Interactive Code Graph**: Visualizes your codebase as an interactive graph where each file is a node and dependencies are connections

🤖 **AI-Powered Summaries**: Uses Google Gemini AI to generate clear, bullet-point summaries of any code file

🎨 **Modern UI**: Dark-themed interface built with React and Tailwind CSS

📁 **Multi-Language Support**: Supports JavaScript, TypeScript, Python, Java, C/C++, and more

## Technology Stack

- **Frontend**: React.js with Vite
- **Visualization**: React Flow
- **AI**: Google Gemini API (gemini-2.0-flash-exp model)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Add your Gemini API key to the `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser to `http://localhost:5173`

## How to Use

1. **Upload Files**: Drag and drop your code files onto the upload area, or click to browse
2. **Explore the Graph**: The application will generate an interactive graph showing your files and their dependencies
3. **View Code Details**: Click on any file node to view its source code in the sidebar
4. **Get AI Summaries**: The AI will automatically generate a summary of the selected file's purpose and functionality
5. **Navigate Dependencies**: Follow the connecting lines to understand how your files depend on each other

## Supported File Types

- JavaScript (`.js`, `.jsx`)
- TypeScript (`.ts`, `.tsx`)
- Python (`.py`)
- Java (`.java`)
- C/C++ (`.c`, `.cpp`, `.h`)
- C# (`.cs`)
- PHP (`.php`)
- Ruby (`.rb`)
- Go (`.go`)
- Rust (`.rs`)
- Swift (`.swift`)
- Kotlin (`.kt`)

## Features in Detail

### Code Analysis
The application automatically analyzes your code to:
- Extract import/require statements
- Identify exported functions and classes
- Build dependency relationships
- Calculate basic metrics

### AI Summaries
When you click on a file, Gemini AI analyzes the code and provides:
- Primary purpose and functionality
- Key components and functions
- Dependencies and imports
- Notable design patterns
- Architectural insights

### Interactive Graph
- **Zoom and Pan**: Navigate large codebases easily
- **Minimap**: Get an overview of the entire project structure
- **Node Selection**: Click nodes to view detailed information
- **Animated Edges**: Visualize data flow and dependencies

## Development

### Project Structure
```
src/
├── components/
│   ├── FileUploader.jsx    # File upload interface
│   └── CodeViewer.jsx      # Code display and summary panel
├── utils/
│   ├── codeParser.js       # Code analysis and parsing
│   └── geminiAI.js         # Gemini AI integration
├── App.jsx                 # Main application component
├── index.css               # Global styles and React Flow theming
└── main.jsx               # Application entry point
```

### Building for Production
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes!

## Troubleshooting

### Common Issues

**AI summaries not working**: Make sure your Gemini API key is correctly set in the `.env` file

**Files not showing dependencies**: Ensure your code uses standard import/require syntax that the parser can recognize

**Graph is too cluttered**: Use the zoom controls and minimap to navigate large codebases

**Upload not working**: Check that your files have supported extensions and contain valid code

## Future Enhancements

- Support for more programming languages
- Advanced code metrics and analysis
- Export functionality for graphs and summaries
- Integration with version control systems
- Collaborative features for team analysis
