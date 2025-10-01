import { GoogleGenerativeAI } from '@google/generative-ai';

// Note: In a production app, this should be stored in environment variables
// For demo purposes, we'll create a placeholder that prompts for API key
let genAI = null;
let apiKey = null;

const initializeGemini = () => {
  if (!apiKey) {
    // In a real app, you'd get this from environment variables
    // For demo, we'll prompt the user or use a default
    apiKey = import.meta.env.VITE_GEMINI_API_KEY || prompt('Please enter your Gemini API Key:');
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
  }
  
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
};

export const generateSummary = async (code, fileName) => {
  try {
    const model = initializeGemini();
    
    const prompt = `
Analyze this code file and provide a clear, concise summary in bullet points. Focus on:

1. Primary purpose and functionality
2. Key components, functions, or classes
3. Dependencies and imports
4. Main algorithms or logic patterns
5. Any notable design patterns or architectural decisions

File: ${fileName}

Code:
${code}

Please provide the summary in a clear, easy-to-read format with bullet points. Keep it concise but informative.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    
    // Fallback to basic analysis if Gemini fails
    return generateBasicSummary(code, fileName);
  }
};

// Fallback function for basic code analysis without AI
const generateBasicSummary = (code, fileName) => {
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim().length > 0);
  
  // Basic statistics
  const stats = {
    totalLines: lines.length,
    codeLines: nonEmptyLines.length,
    functions: (code.match(/function\s+\w+|def\s+\w+|class\s+\w+/g) || []).length,
    imports: (code.match(/import\s+|from\s+.*import|#include|require\(/g) || []).length,
  };
  
  const fileType = fileName.split('.').pop().toLowerCase();
  
  return `
• File Type: ${getFileTypeDescription(fileType)}
• Lines of Code: ${stats.codeLines} (${stats.totalLines} total)
• Functions/Classes: ${stats.functions} definitions found
• Dependencies: ${stats.imports} import statements
• Basic analysis completed (AI summary unavailable)
  `.trim();
};

const getFileTypeDescription = (extension) => {
  const descriptions = {
    'js': 'JavaScript source file',
    'jsx': 'React component file',
    'ts': 'TypeScript source file',
    'tsx': 'React TypeScript component',
    'py': 'Python script',
    'java': 'Java class file',
    'cpp': 'C++ source file',
    'c': 'C source file',
    'h': 'C/C++ header file',
    'cs': 'C# source file',
    'php': 'PHP script',
    'rb': 'Ruby script',
    'go': 'Go source file',
    'rs': 'Rust source file',
    'swift': 'Swift source file',
    'kt': 'Kotlin source file',
  };
  
  return descriptions[extension] || `${extension.toUpperCase()} file`;
};

// Function to test if Gemini API is available
export const testGeminiConnection = async () => {
  try {
    const model = initializeGemini();
    const result = await model.generateContent("Test connection. Respond with 'OK'.");
    const response = await result.response;
    return response.text().includes('OK');
  } catch (error) {
    console.warn('Gemini API not available:', error);
    return false;
  }
};
