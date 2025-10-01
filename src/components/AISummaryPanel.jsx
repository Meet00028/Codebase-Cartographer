import React from 'react';

const AISummaryPanel = ({ file, isLoading, isOpen, onClose }) => {
  if (!file) return null;

  const parseSummary = (summary) => {
    if (!summary) return null;
    
    // Split summary into logical sections
    const lines = summary.split('\n').filter(line => line.trim());
    const sections = {
      purpose: [],
      functions: [],
      dependencies: [],
      architecture: [],
      metrics: []
    };
    
    let currentSection = 'purpose';
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('purpose') || lowerLine.includes('main goal') || lowerLine.includes('primary')) {
        currentSection = 'purpose';
      } else if (lowerLine.includes('function') || lowerLine.includes('method') || lowerLine.includes('class')) {
        currentSection = 'functions';
      } else if (lowerLine.includes('import') || lowerLine.includes('dependency') || lowerLine.includes('require')) {
        currentSection = 'dependencies';
      } else if (lowerLine.includes('architecture') || lowerLine.includes('structure') || lowerLine.includes('pattern')) {
        currentSection = 'architecture';
      } else if (lowerLine.includes('complexity') || lowerLine.includes('lines') || lowerLine.includes('size')) {
        currentSection = 'metrics';
      }
      
      if (line.trim()) {
        sections[currentSection].push(line.trim());
      }
    });
    
    return sections;
  };

  const summarySections = parseSummary(file.summary);

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

  const getComplexityColor = (complexity) => {
    if (complexity <= 2) return 'text-green-400';
    if (complexity <= 5) return 'text-yellow-400';
    if (complexity <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <>
      {/* Overlay */}
      <div className={`ai-summary-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      
      {/* Panel */}
      <div className={`ai-summary-panel ${isOpen ? 'open' : ''}`}>
        <div className="ai-summary-header">
          <div className="ai-summary-title">
            <span>🤖</span>
            AI Analysis
          </div>
          <button className="ai-summary-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="ai-summary-content">
          {/* File Header */}
          <div className="summary-card">
            <div className="summary-card-header">
              <div className="summary-card-icon">
                {getFileTypeIcon(file.name)}
              </div>
              <div>
                <div className="summary-card-title">{file.name}</div>
                <div className="text-xs text-gray-400">{file.type || 'Unknown'}</div>
              </div>
            </div>
            <div className="summary-card-content">
              <div className="summary-metric">
                <span className="summary-metric-label">Lines of Code</span>
                <span className="summary-metric-value">{file.lines || 0}</span>
              </div>
              <div className="summary-metric">
                <span className="summary-metric-label">Complexity</span>
                <span className={`summary-metric-value ${getComplexityColor(file.complexity || 0)}`}>
                  {file.complexity || 0}
                </span>
              </div>
              <div className="summary-metric">
                <span className="summary-metric-label">File Size</span>
                <span className="summary-metric-value">
                  {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="summary-card">
              <div className="summary-card-header">
                <div className="summary-card-icon animate-pulse">⚡</div>
                <div className="summary-card-title">Generating Analysis...</div>
              </div>
              <div className="summary-card-content">
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-3 bg-gray-700 rounded animate-pulse" style={{ width: `${75 + Math.random() * 25}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          ) : file.summary ? (
            <>
              {/* Primary Purpose */}
              {summarySections.purpose.length > 0 && (
                <div className="summary-card">
                  <div className="summary-card-header">
                    <div className="summary-card-icon">🎯</div>
                    <div className="summary-card-title">Primary Purpose</div>
                  </div>
                  <div className="summary-card-content">
                    <ul className="summary-list">
                      {summarySections.purpose.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Key Functions & Classes */}
              {summarySections.functions.length > 0 && (
                <div className="summary-card">
                  <div className="summary-card-header">
                    <div className="summary-card-icon">⚙️</div>
                    <div className="summary-card-title">Key Functions & Classes</div>
                  </div>
                  <div className="summary-card-content">
                    <ul className="summary-list">
                      {summarySections.functions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Dependencies & Imports */}
              {summarySections.dependencies.length > 0 && (
                <div className="summary-card">
                  <div className="summary-card-header">
                    <div className="summary-card-icon">🔗</div>
                    <div className="summary-card-title">Dependencies & Imports</div>
                  </div>
                  <div className="summary-card-content">
                    <ul className="summary-list">
                      {summarySections.dependencies.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Architecture & Patterns */}
              {summarySections.architecture.length > 0 && (
                <div className="summary-card">
                  <div className="summary-card-header">
                    <div className="summary-card-icon">🏗️</div>
                    <div className="summary-card-title">Architecture & Patterns</div>
                  </div>
                  <div className="summary-card-content">
                    <ul className="summary-list">
                      {summarySections.architecture.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Code Quality Metrics */}
              {summarySections.metrics.length > 0 && (
                <div className="summary-card">
                  <div className="summary-card-header">
                    <div className="summary-card-icon">📊</div>
                    <div className="summary-card-title">Code Quality Insights</div>
                  </div>
                  <div className="summary-card-content">
                    <ul className="summary-list">
                      {summarySections.metrics.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Fallback for unstructured summary */}
              {Object.values(summarySections).every(section => section.length === 0) && (
                <div className="summary-card">
                  <div className="summary-card-header">
                    <div className="summary-card-icon">📝</div>
                    <div className="summary-card-title">AI Analysis</div>
                  </div>
                  <div className="summary-card-content">
                    <div className="space-y-3">
                      {file.summary.split('\n').map((line, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1 flex-shrink-0">•</span>
                          <span className="text-sm text-gray-300">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="summary-card">
              <div className="summary-card-header">
                <div className="summary-card-icon">🤖</div>
                <div className="summary-card-title">No Analysis Available</div>
              </div>
              <div className="summary-card-content">
                <p className="text-gray-400 text-sm">
                  Click on a file in the graph to generate an AI analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AISummaryPanel;