import React, { useEffect, useRef, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const SettingsMenu = ({ theme, setTheme, showDashboard, setShowDashboard }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Settings"
        className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white"
      >
        ⚙️
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-black/80 border border-white/10 backdrop-blur-xl shadow-xl p-2 z-50">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-gray-400">Settings</div>
          <div className="p-2 flex items-center justify-between rounded-md hover:bg-white/10">
            <span className="text-xs text-gray-200">Theme</span>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
          <button
            onClick={() => { setShowDashboard(!showDashboard); setOpen(false); }}
            className="mt-1 w-full text-left p-2 rounded-md hover:bg-white/10 text-xs text-gray-200"
          >
            {showDashboard ? 'Hide' : 'Show'} Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu; 