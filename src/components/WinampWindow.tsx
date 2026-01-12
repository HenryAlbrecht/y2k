import { useState, useRef, useEffect } from 'react';
import { Window } from './Window';
import { useAppStore } from '../store/useAppStore';

export const WinampWindow = () => {
  const { 
    theme, 
    playlist, 
    currentTrackIndex, 
    addToPlaylist, 
    removeFromPlaylist, 
    clearPlaylist, 
    setCurrentTrack, 
    playNext, 
    playPrevious 
  } = useAppStore();
  
  const [currentTime, setCurrentTime] = useState('00:00');
  const [coverArt, setCoverArt] = useState('https://via.placeholder.com/100/000000/00ff00?text=NO+ART');
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = playlist[currentTrackIndex];

  // Load and play track when index changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, currentTrack]);

  const handleLoadMP3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newTracks = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    addToPlaylist(newTracks);

    // Auto-play first track if playlist was empty
    if (playlist.length === 0 && newTracks.length > 0) {
      setCurrentTrack(0);
      setTimeout(() => play(), 100);
    }
  };

  const handleLoadArt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setCoverArt(url);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const play = () => {
    if (playlist.length === 0) {
      alert('Please load songs first!');
      return;
    }
    
    if (currentTrackIndex === -1) {
      setCurrentTrack(0);
    }
    
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    playNext();
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    playPrevious();
    setIsPlaying(true);
  };

  const handleTrackEnd = () => {
    // Auto-play next track when current ends
    playNext();
  };

  const updateTime = () => {
    if (audioRef.current) {
      const mins = Math.floor(audioRef.current.currentTime / 60);
      const secs = Math.floor(audioRef.current.currentTime % 60);
      setCurrentTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }
  };

  const displayTrackName = currentTrack?.name || '*** NO TRACK LOADED ***';

  return (
    <Window
      id="winamp"
      title="WINAMP 2.91"
      icon="⚡"
      defaultPosition={{ x: 400, y: 150 }}
      defaultSize={{ width: 450, height: 500 }}
    >
      <audio 
        ref={audioRef} 
        onTimeUpdate={updateTime} 
        onEnded={handleTrackEnd}
      />
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
        {/* Album Art */}
        <div>
          <img
            src={coverArt}
            style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer', border: 'none' }}
            onClick={() => document.getElementById('inp-art')?.click()}
            title="Click to change Album Art"
            alt="Album art"
          />
        </div>

        {/* Info & Controls */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          background: '#000', 
          padding: '8px', 
          border: `2px solid ${theme.secondary}`
        }}>
          <div>
            <div style={{ 
              fontSize: '32px', 
              lineHeight: '1', 
              marginBottom: '8px', 
              color: theme.secondary, 
              fontFamily: 'monospace', 
              fontWeight: 'bold' 
            }}>
              {currentTime}
            </div>
            <div 
              className="winamp-marquee"
              style={{ 
                fontSize: '13px', 
                color: theme.secondary, 
                overflow: 'hidden', 
                whiteSpace: 'nowrap', 
                fontFamily: "'Segoe UI', Tahoma, sans-serif",
                position: 'relative',
                height: '20px'
              }}
            >
              <span style={{ 
                display: 'inline-block',
                animation: displayTrackName.length > 25 ? 'marquee-scroll 10s linear infinite' : 'none',
                paddingLeft: displayTrackName.length > 25 ? '100%' : '0'
              }}>
                {displayTrackName}
              </span>
            </div>
          </div>

          <div className="winamp-controls" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
            <button 
              className="winamp-btn" 
              onClick={handlePrevious}
              disabled={playlist.length === 0}
              style={{ borderColor: theme.secondary, color: theme.secondary }}
            >⏮</button>
            <button 
              className="winamp-btn" 
              onClick={play}
              style={{ borderColor: theme.secondary, color: theme.secondary }}
            >▶</button>
            <button 
              className="winamp-btn" 
              onClick={pause}
              style={{ borderColor: theme.secondary, color: theme.secondary }}
            >⏸</button>
            <button 
              className="winamp-btn" 
              onClick={stop}
              style={{ borderColor: theme.secondary, color: theme.secondary }}
            >⏹</button>
            <button 
              className="winamp-btn" 
              onClick={handleNext}
              disabled={playlist.length === 0}
              style={{ borderColor: theme.secondary, color: theme.secondary }}
            >⏭</button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
        <button 
          className="retro-btn primary" 
          onClick={() => document.getElementById('inp-mp3')?.click()}
          style={{ flex: 1, fontSize: '11px' }}
        >
          📂 Add Songs
        </button>
        <button 
          className="retro-btn" 
          onClick={() => document.getElementById('inp-art')?.click()}
          style={{ fontSize: '11px' }}
        >
          🖼️ Album Art
        </button>
        <button 
          className="retro-btn" 
          onClick={() => {
            if (confirm('Clear entire playlist?')) {
              clearPlaylist();
              setIsPlaying(false);
            }
          }}
          style={{ fontSize: '11px' }}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Volume Control */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        padding: '5px',
        background: '#000',
        border: `2px solid ${theme.secondary}`,
        marginBottom: '5px'
      }}>
        <span style={{ color: theme.secondary, fontSize: '12px', fontWeight: 'bold' }}>🔊 VOL:</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          style={{ flex: 1, accentColor: theme.secondary }}
        />
        <span style={{ color: theme.secondary, fontSize: '12px', minWidth: '35px' }}>{volume}%</span>
      </div>

      {/* Playlist */}
      <div style={{ 
        background: '#000', 
        border: `2px solid ${theme.secondary}`, 
        padding: '5px',
        flex: 1,
        overflowY: 'auto',
        minHeight: '150px'
      }}>
        <div style={{ 
          color: theme.secondary, 
          fontSize: '11px', 
          fontWeight: 'bold', 
          marginBottom: '5px',
          padding: '3px',
          borderBottom: `1px solid ${theme.secondary}`
        }}>
          PLAYLIST ({playlist.length} {playlist.length === 1 ? 'track' : 'tracks'})
        </div>
        {playlist.length === 0 ? (
          <div style={{ 
            color: theme.secondary, 
            fontSize: '11px', 
            textAlign: 'center',
            padding: '20px',
            opacity: 0.6
          }}>
            No tracks loaded.<br/>Click "Add Songs" to load music files.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {playlist.map((track, index) => (
              <li 
                key={track.id}
                style={{
                  padding: '5px',
                  fontSize: '11px',
                  background: index === currentTrackIndex ? theme.secondary : 'transparent',
                  color: index === currentTrackIndex ? '#000' : theme.secondary,
                  marginBottom: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: `1px solid ${index === currentTrackIndex ? theme.secondary : 'transparent'}`,
                }}
                onClick={() => {
                  setCurrentTrack(index);
                  setIsPlaying(true);
                }}
              >
                <span style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  flex: 1
                }}>
                  {index + 1}. {track.name}
                </span>
                <button
                  className="winamp-btn"
                  style={{ 
                    fontSize: '10px', 
                    padding: '2px 5px',
                    marginLeft: '5px',
                    borderColor: index === currentTrackIndex ? '#000' : theme.secondary,
                    color: index === currentTrackIndex ? '#000' : theme.secondary,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromPlaylist(track.id);
                  }}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        id="inp-mp3"
        type="file"
        accept="audio/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleLoadMP3}
      />
      <input
        id="inp-art"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleLoadArt}
      />
    </Window>
  );
};
