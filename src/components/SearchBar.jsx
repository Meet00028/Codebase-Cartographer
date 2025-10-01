import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, theme, className = '' }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const suggestions = [
    { type: 'file', label: 'Search files…', icon: '📁' },
    { type: 'function', label: 'Search functions…', icon: '⚙️' },
    { type: 'class', label: 'Search classes…', icon: '🏗️' },
    { type: 'import', label: 'Search imports…', icon: '📥' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    const handleK = (e) => {
      // Cmd/Ctrl + K focuses the search bar
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = inputRef.current?.querySelector('input');
        el?.focus();
        setShowSuggestions(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleK);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleK);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.querySelector('input')?.blur();
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <div className="relative">
        <div
          className={[
            'w-full flex items-center rounded-xl pl-12 pr-12 py-3 transition-colors duration-200 border',
            isDark
              ? (isFocused
                  ? 'bg-white/10 border-blue-400/50 shadow-md'
                  : 'bg-white/5 border-white/20 hover:bg-white/10')
              : (isFocused
                  ? 'bg-white border-blue-500/40 shadow-md'
                  : 'bg-gray-100/80 border-gray-300/60 hover:bg-gray-200/80'),
          ].join(' ')}
        >
          <span className={`absolute left-4 text-xl ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>🔎</span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Search the codebase (⌘K)"
            className={[
              'bg-transparent outline-none flex-1 text-sm',
              isDark ? 'text-white placeholder-gray-300' : 'text-gray-800 placeholder-gray-500',
            ].join(' ')}
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-16 h-7 px-3 rounded-md text-xs font-medium transition-colors ${
                isDark ? 'bg-white/10 text-gray-200 hover:bg-white/20' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Clear
            </button>
          )}

          <div
            className={`absolute right-4 h-7 px-2 rounded-md text-[10px] font-medium leading-7 tracking-wide ${
              isDark ? 'bg-white/10 text-gray-200 border border-white/20' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            ⌘K
          </div>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          className={[
            'absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg z-50 overflow-hidden',
            isDark
              ? 'bg-black/80 backdrop-blur-xl border border-white/15'
              : 'bg-white/95 backdrop-blur-xl border border-gray-200',
          ].join(' ')}
        >
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(suggestion.label.replace(/…/g, ''));
                  setShowSuggestions(false);
                }}
                className={[
                  'w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors',
                  isDark ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-gray-100 text-gray-700',
                ].join(' ')}
              >
                <span className="text-lg">{suggestion.icon}</span>
                <span className="text-sm font-medium">{suggestion.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
