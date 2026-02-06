import { useState, useEffect } from 'react';
import { Window } from './Window';
import { useAppStore } from '../store/useAppStore';
import { saveWallpaper, deleteWallpaper } from '../utils/wallpaperStorage';

export const SettingsWindow = () => {
  const { theme, setTheme, bootSound, setBootSound, setHasBooted } = useAppStore();
  const [tempTheme, setTempTheme] = useState({
    ...theme,
    osStyle: theme.osStyle || 'win98', // Fallback for existing users
  });

  // Apply preview in real-time
  useEffect(() => {
    document.documentElement.style.setProperty('--neon-pink', tempTheme.primary);
    document.documentElement.style.setProperty('--neon-cyan', tempTheme.secondary);
    document.body.style.backgroundColor = tempTheme.bgColor;
    
    // Apply OS style class to body
    if (tempTheme.osStyle === 'winxp') {
      document.body.classList.add('winxp');
      document.body.classList.remove('win98');
    } else {
      document.body.classList.add('win98');
      document.body.classList.remove('winxp');
    }
    
    if (tempTheme.wallpaper) {
      document.body.style.backgroundImage = `url(${tempTheme.wallpaper})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = `
        radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 60%),
        linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .05) 25%, rgba(0, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .05) 75%, rgba(0, 255, 255, .05) 76%, transparent 77%, transparent),
        linear-gradient(90deg, transparent 24%, rgba(155, 93, 229, .05) 25%, rgba(155, 93, 229, .05) 26%, transparent 27%, transparent 74%, rgba(155, 93, 229, .05) 75%, rgba(155, 93, 229, .05) 76%, transparent 77%, transparent)
      `;
      document.body.style.backgroundSize = '100% 100%, 50px 50px, 50px 50px';
    }
  }, [tempTheme]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      // Save to IndexedDB asynchronously
      await saveWallpaper(base64);
      setTempTheme({ ...tempTheme, wallpaper: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveWallpaper = async () => {
    await deleteWallpaper();
    setTempTheme({ ...tempTheme, wallpaper: null });
  };

  const handleSave = async () => {
    // Save theme colors to localStorage (small data)
    setTheme({
      bgColor: tempTheme.bgColor,
      primary: tempTheme.primary,
      secondary: tempTheme.secondary,
      wallpaper: tempTheme.wallpaper,
      osStyle: tempTheme.osStyle,
    });
    alert('Theme saved! ✨');
  };

  const handleReset = async () => {
    const defaultTheme = {
      bgColor: '#000000',
      primary: '#000080',
      secondary: '#1084d0',
      wallpaper: null,
      osStyle: 'win98' as 'win98' | 'winxp',
    };
    await deleteWallpaper();
    setTempTheme(defaultTheme);
    setTheme(defaultTheme);
  };

  const handleBootSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setBootSound(base64);
      alert('Boot sound uploaded! 🔊 Restart to hear it.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBootSound = () => {
    setBootSound(null);
    alert('Boot sound removed.');
  };

  const handleReboot = () => {
    if (confirm('Restart Y2K Desktop? This will show the boot screen again.')) {
      setHasBooted(false);
      window.location.reload();
    }
  };

  return (
    <Window
      id="settings"
      title="Control Panel"
      icon="⚙️"
      defaultPosition={{ x: 100, y: 100 }}
      defaultSize={{ width: 420, height: 520 }}
    >
      <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>Desktop Appearance</h3>
        <div className="add-task-form" style={{ background: '#e8f4f8', borderColor: '#0078d7' }}>
          <label style={{ fontWeight: 'bold' }}>Wallpaper:</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ flex: 1, fontSize: '12px' }}
            />
            {tempTheme.wallpaper && (
              <button className="retro-btn" onClick={handleRemoveWallpaper} style={{ padding: '4px 8px', fontSize: '12px' }}>
                Remove
              </button>
            )}
          </div>
          {tempTheme.wallpaper && (
            <div style={{ marginTop: '8px' }}>
              <img 
                src={tempTheme.wallpaper} 
                alt="Wallpaper preview" 
                style={{ width: '100%', height: '100px', objectFit: 'cover', border: '2px solid #000' }}
              />
            </div>
          )}

          <label style={{ marginTop: '12px', fontWeight: 'bold' }}>Background Color:</label>
          <input
            type="color"
            value={tempTheme.bgColor}
            onChange={(e) => setTempTheme({ ...tempTheme, bgColor: e.target.value })}
            style={{ width: '100%', height: '35px', cursor: 'pointer' }}
          />

          <label style={{ marginTop: '12px', fontWeight: 'bold' }}>Accent 1 (Primary):</label>
          <input
            type="color"
            value={tempTheme.primary}
            onChange={(e) => setTempTheme({ ...tempTheme, primary: e.target.value })}
            style={{ width: '100%', height: '35px', cursor: 'pointer' }}
          />

          <label style={{ marginTop: '12px', fontWeight: 'bold' }}>Accent 2 (Secondary):</label>
          <input
            type="color"
            value={tempTheme.secondary}
            onChange={(e) => setTempTheme({ ...tempTheme, secondary: e.target.value })}
            style={{ width: '100%', height: '35px', cursor: 'pointer' }}
          />

          <label style={{ marginTop: '12px', fontWeight: 'bold' }}>Windows Style:</label>
          <select
            value={tempTheme.osStyle}
            onChange={(e) => setTempTheme({ ...tempTheme, osStyle: e.target.value as 'win98' | 'winxp' })}
            style={{ width: '100%', padding: '8px', fontSize: '13px' }}
          >
            <option value="win98">🪟 Windows 98 (Classic)</option>
            <option value="winxp">🪟 Windows XP (Luna)</option>
          </select>
        </div>

        <h3 style={{ marginTop: '20px' }}>Boot Settings</h3>
        <div className="add-task-form" style={{ background: '#fff4e0', borderColor: '#ffa500' }}>
          <label style={{ fontWeight: 'bold' }}>Startup Sound (Windows 98):</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="file"
              accept="audio/*"
              onChange={handleBootSoundUpload}
              style={{ flex: 1, fontSize: '12px' }}
            />
            {bootSound && (
              <button className="retro-btn" onClick={handleRemoveBootSound} style={{ padding: '4px 8px', fontSize: '12px' }}>
                Remove
              </button>
            )}
          </div>
          {bootSound && (
            <div style={{ 
              marginTop: '8px', 
              padding: '6px', 
              background: '#00ff00',
              color: '#000',
              fontSize: '11px',
              fontWeight: 'bold',
              border: '2px solid #000'
            }}>
              ✓ Boot sound loaded
            </div>
          )}
          <button 
            className="retro-btn primary" 
            onClick={handleReboot}
            style={{ marginTop: '10px', width: '100%' }}
          >
            🔄 Reboot System
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="retro-btn" onClick={handleReset}>
            Reset Default
          </button>
          <button className="retro-btn primary" onClick={handleSave}>
            Save Theme
          </button>
        </div>
      </div>
    </Window>
  );
};
