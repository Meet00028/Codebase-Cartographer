import React, { useState, useEffect } from 'react';

const CodeViewer = ({ file, isLoading, theme }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [codeLines, setCodeLines] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (file?.content) {
      setCodeLines(file.content.split('\n'));
    }
  }, [file?.content]);

  // Focus summary tab when summary becomes available
  useEffect(() => {
    if (file?.summary && activeTab !== 'summary') {
      setActiveTab('summary');
    }
  }, [file?.summary, activeTab]);

  if (!file) return null;

  const isDark = theme === 'dark';

  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconMap = {
      'js': '🟨', 'jsx': '⚛️', 'ts': '🔷', 'tsx': '⚛️',
      'py': '🐍', 'java': '☕', 'cpp': '⚙️', 'c': '⚙️',
      'h': '📄', 'cs': '🔷', 'php': '🐘', 'rb': '💎',
      'go': '🐹', 'rs': '🦀', 'swift': '🦉', 'kt': '🟣',
    };
    return iconMap[extension] || '📄';
  };

  const getFileTypeColor = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const colorMap = {
      'js': 'text-yellow-400', 'jsx': 'text-blue-400', 'ts': 'text-blue-500', 'tsx': 'text-blue-400',
      'py': 'text-green-400', 'java': 'text-orange-400', 'cpp': 'text-blue-300', 'c': 'text-blue-300',
      'h': 'text-gray-400', 'cs': 'text-purple-400', 'php': 'text-indigo-400', 'rb': 'text-red-400',
      'go': 'text-cyan-400', 'rs': 'text-orange-500', 'swift': 'text-orange-300', 'kt': 'text-purple-300',
    };
    return colorMap[extension] || 'text-gray-400';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getComplexityColor = (complexity) => {
    if (complexity <= 2) return 'text-green-400 bg-green-400/20';
    if (complexity <= 5) return 'text-yellow-400 bg-yellow-400/20';
    if (complexity <= 8) return 'text-orange-400 bg-orange-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  return (
    <div className={`h-full flex flex-col transition-all duration-200 ${
      isDark ? 'bg-black/30' : 'bg-white/30'
    } backdrop-blur-xl`}>
      {/* Header */}
      <div className={`p-4 border-b transition-colors duration-200 ${
        isDark ? 'border-gray-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50' : 'border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getFileTypeIcon(file.name)}</span>
            <div className="flex-1 min-w-0">
              <h2 className={`text-base font-semibold truncate transition-colors duration-200 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`} title={file.path}>
                {file.name}
              </h2>
              <p className={`text-xs truncate transition-colors duration-200 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`} title={file.path}>
                {file.path}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-md transition-colors duration-200 ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
            }`}
          >
            {isFullscreen ? '⤓' : '⤢'}
          </button>
        </div>
        
        {/* File Stats */}
        <div className="flex items-center space-x-3 text-xs">
          <span className={`px-2 py-0.5 rounded-full transition-colors duration-200 ${
            isDark ? 'bg-slate-700/50' : 'bg-gray-200/50'
          } ${getFileTypeColor(file.name)}`}>
            {file.type || 'Unknown'}
          </span>
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {formatFileSize(file.size)}
          </span>
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {file.lines || 0} lines
          </span>
          {file.complexity !== undefined && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getComplexityColor(file.complexity)}`}>
              Complexity: {file.complexity}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b transition-colors duration-200 ${
        isDark ? 'border-gray-700/50 bg-slate-800/30' : 'border-gray-200/50 bg-gray-50/30'
      }`}>
        {[
          { id: 'summary', label: 'AI Summary', icon: '🤖' },
          { id: 'code', label: 'Source Code', icon: '💻' },
          { id: 'dependencies', label: 'Dependencies', icon: '🔗' },
          { id: 'metrics', label: 'Metrics', icon: '📊' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? `text-blue-400 border-b-2 border-blue-400 ${
                    isDark ? 'bg-slate-700/30' : 'bg-blue-50/30'
                  }`
              : `${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/50'}`
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'summary' && (
          <div className="h-full overflow-auto">
            <div className="p-4">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <h3 className={`text-sm font-semibold transition-colors duration-200 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>AI Analysis</h3>
                </div>
                
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="spinner"></div>
                      <span className={`text-xs transition-colors duration-200 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>Generating AI summary...</span>
                    </div>
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-3 rounded animate-pulse ${
                          isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`} style={{ width: `${75 + Math.random() * 25}%` }}></div>
                      ))}
                    </div>
                  </div>
                ) : file.summary ? (
                  <div className="prose prose-invert max-w-none">
                    <div className={`text-xs space-y-3 leading-relaxed transition-colors duration-200 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {file.summary.split('\n').map((line, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className={`text-blue-400 mt-1 flex-shrink-0 ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                          }`}>•</span>
                          <span className="flex-1">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">🤖</div>
                    <p className={`text-sm transition-colors duration-200 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Click to generate AI summary</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="h-full overflow-auto">
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <h3 className={`text-sm font-semibold transition-colors duration-200 ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}>Source Code</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className={`px-2 py-1 text-[10px] rounded transition-colors duration-200 ${
                      isDark ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}>
                      Copy
                    </button>
                    <button className={`px-2 py-1 text-[10px] rounded transition-colors duration-200 ${
                      isDark ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}>
                      Download
                    </button>
                  </div>
                </div>
                
                {file.content ? (
                  <div className="relative">
                    <div className={`absolute top-0 right-0 px-2 py-1 rounded-bl text-[10px] transition-colors duration-200 ${
                      isDark ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {codeLines.length} lines
                    </div>
                    <pre className={`text-xs p-4 rounded-lg overflow-auto border transition-colors duration-200 mono ${
                      isDark 
                        ? 'text-gray-300 bg-slate-900/50 border-slate-700/50' 
                        : 'text-gray-700 bg-gray-50/50 border-gray-200/50'
                    }`}>
                      <code>
                        {codeLines.map((line, index) => (
                          <div key={index} className="flex">
                            <span className={`mr-3 select-none w-8 text-right transition-colors duration-200 ${
                              isDark ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="flex-1">{line}</span>
                          </div>
                        ))}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">💻</div>
                    <p className={`text-sm transition-colors duration-200 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>No content available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div className="h-full overflow-auto">
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`}>Dependencies</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Imports */}
                  {file.imports && file.imports.length > 0 && (
                    <div>
                      <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>Imports ({file.imports.length})</h4>
                      <div className="space-y-2">
                        {file.imports.map((importPath, index) => (
                          <div key={index} className={`flex items-center space-x-3 text-sm rounded-lg p-3 transition-colors duration-300 ${
                            isDark ? 'bg-slate-800/30 text-gray-300' : 'bg-gray-100/50 text-gray-700'
                          }`}>
                            <span>📥</span>
                            <span className="font-mono flex-1">{importPath}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exports */}
                  {file.exports && file.exports.length > 0 && (
                    <div>
                      <h4 className={`text-sm font-medium mb-3 transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>Exports ({file.exports.length})</h4>
                      <div className="space-y-2">
                        {file.exports.map((exportName, index) => (
                          <div key={index} className={`flex items-center space-x-3 text-sm rounded-lg p-3 transition-colors duration-300 ${
                            isDark ? 'bg-slate-800/30 text-gray-300' : 'bg-gray-100/50 text-gray-700'
                          }`}>
                            <span>📤</span>
                            <span className="font-mono flex-1">{exportName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!file.imports || file.imports.length === 0) && (!file.exports || file.exports.length === 0) && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔗</div>
                      <p className={`text-lg transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>No dependencies found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="h-full overflow-auto">
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                  <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>Code Metrics</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                    isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-100/50 border-gray-200/50'
                  }`}>
                    <div className="text-2xl font-bold text-blue-400">{file.lines || 0}</div>
                    <div className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Lines of Code</div>
                  </div>
                  <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                    isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-100/50 border-gray-200/50'
                  }`}>
                    <div className={`text-2xl font-bold ${getComplexityColor(file.complexity || 0).split(' ')[0]}`}>
                      {file.complexity || 0}
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Complexity</div>
                  </div>
                  <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                    isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-100/50 border-gray-200/50'
                  }`}>
                    <div className="text-2xl font-bold text-green-400">{file.imports?.length || 0}</div>
                    <div className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Imports</div>
                  </div>
                  <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                    isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-100/50 border-gray-200/50'
                  }`}>
                    <div className="text-2xl font-bold text-purple-400">{file.exports?.length || 0}</div>
                    <div className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>Exports</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeViewer;
