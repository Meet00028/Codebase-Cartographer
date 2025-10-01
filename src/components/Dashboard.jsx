import React, { useState, useMemo } from 'react';

const Dashboard = ({ nodes, edges, selectedFile, onFileSelect, theme }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('name');

  const stats = useMemo(() => {
    const fileTypes = {};
    let totalLines = 0;
    let totalComplexity = 0;
    
    nodes.forEach(node => {
      const type = node.data.type || 'Unknown';
      fileTypes[type] = (fileTypes[type] || 0) + 1;
      totalLines += node.data.lines || 0;
      totalComplexity += node.data.complexity || 0;
    });

    return {
      fileTypes,
      totalFiles: nodes.length,
      totalDependencies: edges.length,
      totalLines,
      totalComplexity,
      avgComplexity: nodes.length > 0 ? Math.round(totalComplexity / nodes.length) : 0
    };
  }, [nodes, edges]);

  const sortedNodes = useMemo(() => {
    return [...nodes].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.data.name.localeCompare(b.data.name);
        case 'type':
          return (a.data.type || '').localeCompare(b.data.type || '');
        case 'complexity':
          return (b.data.complexity || 0) - (a.data.complexity || 0);
        case 'lines':
          return (b.data.lines || 0) - (a.data.lines || 0);
        default:
          return 0;
      }
    });
  }, [nodes, sortBy]);

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
    <div className="h-full flex flex-col bg-black/20 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-base font-semibold text-white mb-1">Project Dashboard</h2>
        <p className="text-xs text-gray-400">Analyze your codebase structure</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'files', label: 'Files', icon: '📁' },
          { id: 'dependencies', label: 'Dependencies', icon: '🔗' },
          { id: 'analytics', label: 'Analytics', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'overview' && (
          <div className="p-4 space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-2xl font-bold text-blue-400">{stats.totalFiles}</div>
                <div className="text-sm text-gray-400">Total Files</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-2xl font-bold text-purple-400">{stats.totalDependencies}</div>
                <div className="text-sm text-gray-400">Dependencies</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-2xl font-bold text-green-400">{stats.totalLines.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Lines of Code</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className={`text-2xl font-bold ${getComplexityColor(stats.avgComplexity)}`}>
                  {stats.avgComplexity}
                </div>
                <div className="text-sm text-gray-400">Avg Complexity</div>
              </div>
            </div>

            {/* File Types Distribution */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">File Types</h3>
              <div className="space-y-2">
                {Object.entries(stats.fileTypes).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                    <span className="text-white font-medium">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ width: `${(count / stats.totalFiles) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="p-4 space-y-3">
            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-xs text-white"
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="complexity">Complexity</option>
                <option value="lines">Lines</option>
              </select>
            </div>

            {/* File List */}
            <div className="space-y-2">
              {sortedNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => onFileSelect(node.data)}
                  className={`p-2 rounded-md cursor-pointer transition-colors duration-150 ${
                    selectedFile?.name === node.data.name
                      ? 'bg-blue-500/20 border border-blue-400/40'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base">{getFileTypeIcon(node.data.name)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{node.data.name}</div>
                      <div className="text-[10px] text-gray-400">{node.data.type}</div>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                      <span>{node.data.lines || 0}L</span>
                      <span className={`px-2 py-0.5 rounded ${getComplexityColor(node.data.complexity || 0)}`}>
                        {node.data.complexity || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Dependency Graph</h3>
            <div className="space-y-2">
              {edges.map((edge, index) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                return (
                  <div key={index} className="bg-white/5 rounded-md p-2 border border-white/10">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-blue-400">{getFileTypeIcon(sourceNode?.data.name || '')}</span>
                      <span className="text-white">{sourceNode?.data.name}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-purple-400">{getFileTypeIcon(targetNode?.data.name || '')}</span>
                      <span className="text-white">{targetNode?.data.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Code Analytics</h3>
            
            {/* Complexity Distribution */}
            <div>
              <h4 className="text-xs font-medium text-gray-300 mb-2">Complexity Distribution</h4>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => {
                  const count = nodes.filter(n => (n.data.complexity || 0) === level).length;
                  const percentage = stats.totalFiles > 0 ? (count / stats.totalFiles) * 100 : 0;
                  return (
                    <div key={level} className="flex items-center space-x-3">
                      <span className="text-[10px] text-gray-400 w-8">{level}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getComplexityColor(level).replace('text-', 'bg-')}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* File Size Distribution */}
            <div>
              <h4 className="text-xs font-medium text-gray-300 mb-2">File Size Distribution</h4>
              <div className="space-y-2">
                {[
                  { range: '0-50', min: 0, max: 50 },
                  { range: '51-100', min: 51, max: 100 },
                  { range: '101-200', min: 101, max: 200 },
                  { range: '200+', min: 201, max: Infinity }
                ].map(({ range, min, max }) => {
                  const count = nodes.filter(n => {
                    const lines = n.data.lines || 0;
                    return lines >= min && lines <= max;
                  }).length;
                  const percentage = stats.totalFiles > 0 ? (count / stats.totalFiles) * 100 : 0;
                  return (
                    <div key={range} className="flex items-center space-x-3">
                      <span className="text-[10px] text-gray-400 w-12">{range}L</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
