import React, { useCallback, useState, useRef } from 'react';

const FileUploader = ({ onFilesUpload, isLoading, theme }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragCounter, setDragCounter] = useState(0);
  const [stagedFiles, setStagedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const dedupeAndStage = useCallback((incoming) => {
    if (!incoming || incoming.length === 0) return;
    const existingKeys = new Set(
      stagedFiles.map(f => `${f.webkitRelativePath || f.name}|${f.size}|${f.lastModified}`)
    );
    const unique = [];
    for (const f of incoming) {
      const key = `${f.webkitRelativePath || f.name}|${f.size}|${f.lastModified}`;
      if (!existingKeys.has(key)) {
        existingKeys.add(key);
        unique.push(f);
      }
    }
    if (unique.length > 0) {
      setStagedFiles(prev => [...prev, ...unique]);
    }
  }, [stagedFiles]);

  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    dedupeAndStage(files);
    // reset value to allow re-selecting the same files
    event.target.value = '';
  }, [dedupeAndStage]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
    setDragCounter(0);
    const files = Array.from(event.dataTransfer.files || []);
    dedupeAndStage(files);
  }, [dedupeAndStage]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, []);

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 50);
  };

  const handleAnalyze = useCallback(() => {
    if (stagedFiles.length === 0) return;
    simulateUploadProgress();
    onFilesUpload(stagedFiles);
  }, [stagedFiles, onFilesUpload]);

  const handleRemove = useCallback((idx) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const handleClear = useCallback(() => {
    setStagedFiles([]);
  }, []);

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

  return (
    <div className="upload-hero">
      <div className="upload-container">
        <div className="upload-card animate-fade-in-up">
          <div
            className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${isLoading ? 'pointer-events-none opacity-75' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isLoading && fileInputRef.current?.click()}
          >
            {/* Upload Icon */}
            <div className="upload-icon">
              {isLoading ? '⚡' : isDragOver ? '📁' : '📤'}
            </div>
            
            {/* Upload Text */}
            <div className="space-y-4">
              <h1 className="upload-title">
                {isLoading ? 'Processing files...' : 'Transform Your Codebase'}
              </h1>
              <p className="upload-subtitle">
                {isLoading 
                  ? 'Analyzing file relationships and generating insights...' 
                  : 'Upload multiple files to create an interactive visualization of your project structure and dependencies.'
                }
              </p>
            </div>

            {/* Progress Bar */}
            {isLoading && (
              <div className="w-full max-w-md mx-auto">
                <div className="w-full rounded-full h-2 overflow-hidden bg-gray-700">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400 text-center">
                  {uploadProgress}% complete
                </div>
              </div>
            )}

            {/* Upload Buttons */}
            {!isLoading && (
              <div className="upload-buttons">
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="btn-primary"
                >
                  Add Files
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); folderInputRef.current?.click(); }}
                  className="btn-secondary"
                >
                  Add Folder
                </button>
              </div>
            )}
          </div>

          {/* Staged Files List */}
          {stagedFiles.length > 0 && (
            <div className="file-list">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-300">
                  Staged files: <span className="font-semibold text-white">{stagedFiles.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClear}
                    className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleAnalyze}
                    className="analyze-button"
                  >
                    Analyze {stagedFiles.length} {stagedFiles.length === 1 ? 'file' : 'files'}
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stagedFiles.map((f, idx) => (
                  <div key={`${f.name}-${f.size}-${f.lastModified}-${idx}`} className="file-item">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getFileTypeIcon(f.name)}</span>
                      <span className="file-name">{f.webkitRelativePath || f.name}</span>
                    </div>
                    <button 
                      onClick={() => handleRemove(idx)} 
                      className="file-remove"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips Grid */}
          {!isLoading && stagedFiles.length === 0 && (
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">💡</div>
                <div className="tip-title">Pro Tip</div>
                <div className="tip-description">
                  Upload multiple files together to see their relationships and dependencies in the visualization.
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <div className="tip-title">Best Practice</div>
                <div className="tip-description">
                  Include main entry points and configuration files for better analysis and insights.
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">⚡</div>
                <div className="tip-title">Performance</div>
                <div className="tip-description">
                  Large projects are processed in the background with real-time progress updates.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.cs,.php,.rb,.go,.rs,.swift,.kt"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        onChange={handleFileUpload}
        // @ts-ignore - non-standard but widely supported in Chromium-based browsers
        webkitdirectory=""
        className="hidden"
      />
    </div>
  );
};

export default FileUploader;