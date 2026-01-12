import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

export const Taskbar = () => {
  const [time, setTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);
  const startBtnRef = useRef<HTMLDivElement>(null);
  const { openWindow, windows, minimizeWindow } = useAppStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showStartMenu &&
        startMenuRef.current &&
        startBtnRef.current &&
        !startMenuRef.current.contains(event.target as Node) &&
        !startBtnRef.current.contains(event.target as Node)
      ) {
        setShowStartMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStartMenu]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
      {/* Start Menu */}
      {showStartMenu && (
        <div id="start-menu" ref={startMenuRef}>
          <div className="start-sidebar">Y2K OS</div>
          <div className="start-items">
            <div className="start-item" onClick={() => { openWindow('todo'); setShowStartMenu(false); }}>
              📝 Tasks
            </div>
            <div className="start-item" onClick={() => { openWindow('projects'); setShowStartMenu(false); }}>
              📁 Projects
            </div>
            <div className="start-item" onClick={() => { openWindow('notepad'); setShowStartMenu(false); }}>
              📔 Notepad
            </div>
            <div className="start-item" onClick={() => { openWindow('winamp'); setShowStartMenu(false); }}>
              ⚡ Winamp
            </div>
            <div className="start-item" onClick={() => { openWindow('budget'); setShowStartMenu(false); }}>
              💰 Budget
            </div>
            <div className="start-item" onClick={() => { openWindow('settings'); setShowStartMenu(false); }}>
              ⚙️ Settings
            </div>
            <hr />
            <div className="start-item" onClick={() => alert('Reset not implemented')}>
              ♻️ Reset Data
            </div>
            <div className="start-item" onClick={() => window.close()}>
              🚪 Shut Down
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div id="taskbar">
        <div id="start-btn" ref={startBtnRef} onClick={() => setShowStartMenu(!showStartMenu)}>
          <span style={{ fontSize: '18px' }}>❖</span> START
        </div>
        <div className="taskbar-divider"></div>
        <div id="taskbar-apps">
          {Object.entries(windows).map(([key, win]) =>
            win.isOpen ? (
              <button
                key={key}
                className={`taskbar-app ${win.isMinimized ? 'minimized' : ''}`}
                onClick={() => minimizeWindow(key)}
              >
                {key === 'todo' && '📝'}
                {key === 'projects' && '📁'}
                {key === 'notepad' && '📔'}
                {key === 'winamp' && '⚡'}
                {key === 'settings' && '⚙️'}
                {key === 'budget' && '💰'}
                {' '}{key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ) : null
          )}
        </div>
        <div className="taskbar-divider"></div>
        <div id="clock">{formatTime(time)}</div>
      </div>
    </>
  );
};
