import { useEffect } from 'react';

export const ShutdownScreen = () => {
  useEffect(() => {
    // Optional: play a shutdown sound here
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      color: '#ff8c00', // Orange text
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      fontFamily: 'Courier New, monospace',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px', textShadow: '2px 2px #440000' }}>
        It is now safe to turn off your computer.
      </h1>
      <p style={{ fontSize: '24px', opacity: 0.8 }}>
        _
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '50px',
          background: 'transparent',
          border: '1px solid #ff8c00',
          color: '#ff8c00',
          padding: '10px 20px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '16px'
        }}
      >
        RESTART
      </button>
    </div>
  );
};
