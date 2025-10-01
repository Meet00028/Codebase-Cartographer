// Enhanced code parser with premium styling and better analysis
export const parseCodebase = async (files) => {
  const nodes = [];
  const edges = [];
  const fileMap = new Map();

  // First pass: Create nodes for all files
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const content = await readFileContent(file);
    const fileInfo = analyzeFile(file, content);
    const fileType = getFileType(file.name);
    
    const node = {
      id: file.name,
      type: 'default',
      position: { 
        x: (i % 6) * 220 + Math.random() * 50, 
        y: Math.floor(i / 6) * 180 + Math.random() * 50 
      },
      data: {
        label: file.name,
        name: file.name,
        path: file.webkitRelativePath || file.name,
        content: content,
        type: fileType,
        size: file.size,
        imports: fileInfo.imports,
        exports: fileInfo.exports,
        complexity: calculateComplexity(content),
        lines: content.split('\n').length,
      },
      style: {
        background: getNodeBackground(fileType),
        border: `2px solid ${getNodeBorderColor(fileType)}`,
        borderRadius: '12px',
        padding: '12px 16px',
        minWidth: '140px',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    };
    
    nodes.push(node);
    fileMap.set(file.name, node);
  }

  // Second pass: Create edges based on imports/dependencies
  nodes.forEach((node) => {
    if (node.data.imports) {
      node.data.imports.forEach((importPath) => {
        const targetFile = findTargetFile(importPath, fileMap);
        if (targetFile) {
          edges.push({
            id: `${node.id}-${targetFile.id}`,
            source: node.id,
            target: targetFile.id,
            type: 'smoothstep',
            animated: true,
            style: { 
              stroke: '#667eea',
              strokeWidth: 2,
              strokeDasharray: '5,5',
            },
            markerEnd: {
              type: 'arrowclosed',
              color: '#667eea',
            },
          });
        }
      });
    }
  });

  return { nodes, edges };
};

const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

const analyzeFile = (file, content) => {
  const extension = getFileExtension(file.name);
  const imports = [];
  const exports = [];

  try {
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return analyzeJavaScript(content);
      case 'py':
        return analyzePython(content);
      case 'java':
        return analyzeJava(content);
      case 'cpp':
      case 'c':
      case 'h':
        return analyzeC(content);
      default:
        return { imports, exports };
    }
  } catch (error) {
    console.warn(`Error analyzing ${file.name}:`, error);
    return { imports, exports };
  }
};

const analyzeJavaScript = (content) => {
  const imports = [];
  const exports = [];

  // Match ES6 imports
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  // Match CommonJS requires
  const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = requireRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  // Match exports
  const exportRegex = /export\s+(?:default\s+)?(?:class|function|const|let|var)\s+(\w+)/g;
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  return { imports, exports };
};

const analyzePython = (content) => {
  const imports = [];
  const exports = [];

  // Match Python imports
  const importRegex = /(?:from\s+(\S+)\s+import|import\s+(\S+))/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1] || match[2]);
  }

  // Match function/class definitions (basic exports)
  const defRegex = /(?:def|class)\s+(\w+)/g;
  while ((match = defRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  return { imports, exports };
};

const analyzeJava = (content) => {
  const imports = [];
  const exports = [];

  // Match Java imports
  const importRegex = /import\s+(?:static\s+)?([^;]+);/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  // Match class definitions
  const classRegex = /(?:public\s+)?class\s+(\w+)/g;
  while ((match = classRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  return { imports, exports };
};

const analyzeC = (content) => {
  const imports = [];
  const exports = [];

  // Match #include statements
  const includeRegex = /#include\s*[<"]([^>"]+)[>"]/g;
  let match;
  while ((match = includeRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  // Match function declarations/definitions
  const functionRegex = /(?:^|\n)\s*(?:\w+\s+)*(\w+)\s*\([^)]*\)\s*(?:\{|;)/g;
  while ((match = functionRegex.exec(content)) !== null) {
    if (!['if', 'for', 'while', 'switch'].includes(match[1])) {
      exports.push(match[1]);
    }
  }

  return { imports, exports };
};

const findTargetFile = (importPath, fileMap) => {
  // Try exact match first
  if (fileMap.has(importPath)) {
    return fileMap.get(importPath);
  }

  // Try with common extensions
  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h'];
  for (const ext of extensions) {
    if (fileMap.has(importPath + ext)) {
      return fileMap.get(importPath + ext);
    }
  }

  // Try relative path matching
  for (const [fileName, node] of fileMap.entries()) {
    if (fileName.includes(importPath) || importPath.includes(fileName.replace(/\.[^.]+$/, ''))) {
      return node;
    }
  }

  return null;
};

const getFileType = (fileName) => {
  const extension = getFileExtension(fileName);
  const typeMap = {
    'js': 'JavaScript',
    'jsx': 'React',
    'ts': 'TypeScript',
    'tsx': 'React TypeScript',
    'py': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'h': 'Header',
    'cs': 'C#',
    'php': 'PHP',
    'rb': 'Ruby',
    'go': 'Go',
    'rs': 'Rust',
    'swift': 'Swift',
    'kt': 'Kotlin',
  };
  return typeMap[extension] || 'Unknown';
};

const getFileExtension = (fileName) => {
  return fileName.split('.').pop().toLowerCase();
};

const getNodeBackground = (fileType) => {
  const backgroundMap = {
    'JavaScript': 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    'React': 'linear-gradient(135deg, #1e293b 0%, #2d3748 100%)',
    'TypeScript': 'linear-gradient(135deg, #1e293b 0%, #2c5282 100%)',
    'React TypeScript': 'linear-gradient(135deg, #1e293b 0%, #2c5282 100%)',
    'Python': 'linear-gradient(135deg, #1e293b 0%, #2d5016 100%)',
    'Java': 'linear-gradient(135deg, #1e293b 0%, #744210 100%)',
    'C++': 'linear-gradient(135deg, #1e293b 0%, #2a4365 100%)',
    'C': 'linear-gradient(135deg, #1e293b 0%, #2a4365 100%)',
    'Header': 'linear-gradient(135deg, #1e293b 0%, #4a5568 100%)',
    'C#': 'linear-gradient(135deg, #1e293b 0%, #553c9a 100%)',
    'PHP': 'linear-gradient(135deg, #1e293b 0%, #553c9a 100%)',
    'Ruby': 'linear-gradient(135deg, #1e293b 0%, #742a2a 100%)',
    'Go': 'linear-gradient(135deg, #1e293b 0%, #2c7a7b 100%)',
    'Rust': 'linear-gradient(135deg, #1e293b 0%, #744210 100%)',
    'Swift': 'linear-gradient(135deg, #1e293b 0%, #744210 100%)',
    'Kotlin': 'linear-gradient(135deg, #1e293b 0%, #553c9a 100%)',
  };
  return backgroundMap[fileType] || 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
};

const getNodeBorderColor = (fileType) => {
  const colorMap = {
    'JavaScript': '#f7df1e',
    'React': '#61dafb',
    'TypeScript': '#3178c6',
    'React TypeScript': '#61dafb',
    'Python': '#3776ab',
    'Java': '#ed8b00',
    'C++': '#00599c',
    'C': '#00599c',
    'Header': '#6b7280',
    'C#': '#239120',
    'PHP': '#777bb4',
    'Ruby': '#cc342d',
    'Go': '#00add8',
    'Rust': '#dea584',
    'Swift': '#fa7343',
    'Kotlin': '#7f52ff',
  };
  return colorMap[fileType] || '#6b7280';
};

const calculateComplexity = (content) => {
  const lines = content.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim().length > 0);
  
  // Simple complexity calculation
  let complexity = 0;
  complexity += (content.match(/if\s*\(/g) || []).length;
  complexity += (content.match(/for\s*\(/g) || []).length;
  complexity += (content.match(/while\s*\(/g) || []).length;
  complexity += (content.match(/switch\s*\(/g) || []).length;
  complexity += (content.match(/catch\s*\(/g) || []).length;
  complexity += (content.match(/function\s+\w+/g) || []).length;
  complexity += (content.match(/class\s+\w+/g) || []).length;
  
  return Math.min(complexity, 10); // Cap at 10 for display purposes
};
