import { useState } from 'react';
import { Window } from './Window';
import { useAppStore } from '../store/useAppStore';

export const NotepadWindow = () => {
  const { notepadContent, setNotepadContent } = useAppStore();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const wordCount = notepadContent.trim().split(/\s+/).filter(Boolean).length;
  const charCount = notepadContent.length;

  const handleSave = () => {
    setLastSaved(new Date());
  };

  const handleExport = () => {
    const blob = new Blob([notepadContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Clear all content? This cannot be undone!')) {
      setNotepadContent('');
      setLastSaved(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Window
      id="notepad"
      title="Quick Notes - Untitled"
      icon="📔"
      defaultPosition={{ x: 250, y: 120 }}
      defaultSize={{ width: 500, height: 450 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Toolbar */}
        <div style={{ 
          display: 'flex', 
          gap: '5px', 
          padding: '5px',
          background: '#e0e0e0',
          borderBottom: '2px solid #808080',
          flexWrap: 'wrap'
        }}>
          <button 
            className="retro-btn" 
            onClick={handleSave}
            style={{ fontSize: '12px', padding: '3px 8px' }}
            title="Save (Ctrl+S)"
          >
            💾 Save
          </button>
          <button 
            className="retro-btn" 
            onClick={handleExport}
            style={{ fontSize: '12px', padding: '3px 8px' }}
            title="Export as .txt"
          >
            📄 Export
          </button>
          <button 
            className="retro-btn" 
            onClick={handleClear}
            style={{ fontSize: '12px', padding: '3px 8px' }}
          >
            🗑️ Clear
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#666' }}>
              {wordCount} words • {charCount} chars
            </span>
            {lastSaved && (
              <span style={{ fontSize: '11px', color: '#008000', fontWeight: 'bold' }}>
                ✓ Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={notepadContent}
          onChange={(e) => setNotepadContent(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            width: '100%',
            border: 'none',
            resize: 'none',
            padding: '10px',
            fontFamily: "'Courier New', monospace",
            fontSize: '14px',
            outline: 'none',
            background: '#fff',
            lineHeight: '1.5'
          }}
          placeholder="Start typing your notes here... 
          
Tip: Press Ctrl+S to save"
        />

        {/* Status Bar */}
        <div style={{
          padding: '3px 8px',
          background: '#c0c0c0',
          borderTop: '2px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>📝 Quick Notes v1.0</span>
          <span>{notepadContent ? 'Modified' : 'Empty'}</span>
        </div>
      </div>
    </Window>
  );
};
