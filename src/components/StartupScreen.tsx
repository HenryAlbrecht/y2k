import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const StartupScreen = () => {
  const { setHasBooted, bootSound } = useAppStore();
  const [bootStep, setBootStep] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Play boot sound if available
    if (bootSound) {
      const audio = new Audio(bootSound);
      audio.play().catch(() => console.log('Boot sound failed to play'));
    }

    // Boot sequence timing
    const steps = [
      { delay: 0, step: 0 },      // BIOS screen
      { delay: 1000, step: 1 },   // Memory check
      { delay: 2000, step: 2 },   // Detecting devices
      { delay: 3000, step: 3 },   // Loading OS
      { delay: 4500, step: 4 },   // Starting Windows
      { delay: 6000, step: 5 },   // Complete
    ];

    steps.forEach(({ delay, step }) => {
      setTimeout(() => setBootStep(step), delay);
    });

    // Finish boot sequence
    setTimeout(() => {
      setHasBooted(true);
    }, 6500);

    // Animated dots
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(dotInterval);
  }, [bootSound, setHasBooted]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#000',
      color: '#00ff00',
      fontFamily: "'Courier New', monospace",
      fontSize: '14px',
      padding: '20px',
      overflow: 'hidden',
      zIndex: 99999,
    }}>
      {/* BIOS Header */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #00ff00', paddingBottom: '10px' }}>
        <div>Y2K DESKTOP BIOS v2.91.1998</div>
        <div style={{ fontSize: '12px', opacity: 0.7 }}>Copyright (C) 1998-2026, Y2K Systems Inc.</div>
      </div>

      {/* Boot Messages */}
      <div style={{ lineHeight: '1.6' }}>
        {bootStep >= 0 && (
          <>
            <div>Main Processor: Intel Pentium II 450MHz</div>
            <div>Memory Test: 64MB OK</div>
            <div style={{ opacity: bootStep >= 1 ? 1 : 0.3 }}>
              {bootStep >= 1 ? '✓' : '·'} Primary Master: 10GB HDD
            </div>
            <div style={{ opacity: bootStep >= 1 ? 1 : 0.3 }}>
              {bootStep >= 1 ? '✓' : '·'} CD-ROM Drive Detected
            </div>
            <div style={{ opacity: bootStep >= 1 ? 1 : 0.3 }}>
              {bootStep >= 1 ? '✓' : '·'} Sound Blaster 16 Compatible
            </div>
          </>
        )}

        {bootStep >= 2 && (
          <div style={{ marginTop: '15px' }}>
            <div>Detecting Hardware{dots}</div>
            <div style={{ marginLeft: '20px', fontSize: '12px' }}>
              ✓ Keyboard: 101-Key Standard<br/>
              ✓ Mouse: PS/2 Compatible<br/>
              ✓ Video: SVGA 1024x768 256 Colors<br/>
              ✓ Network: Ethernet Card Detected
            </div>
          </div>
        )}

        {bootStep >= 3 && (
          <div style={{ marginTop: '15px', color: '#00ffff' }}>
            <div>Loading Y2K Desktop OS{dots}</div>
            <div style={{ marginLeft: '20px', fontSize: '12px' }}>
              [{'█'.repeat(Math.min(bootStep * 5, 40))}{'░'.repeat(Math.max(40 - bootStep * 5, 0))}] {Math.min(bootStep * 25, 100)}%
            </div>
          </div>
        )}

        {bootStep >= 4 && (
          <div style={{ marginTop: '20px', color: '#ffff00' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Starting Windows 98...
            </div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              Please wait while the system initializes{dots}
            </div>
          </div>
        )}

        {bootStep >= 5 && (
          <div style={{ 
            marginTop: '30px', 
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '16px',
            animation: 'blink 1s infinite'
          }}>
            ★ WELCOME TO Y2K DESKTOP ★
          </div>
        )}
      </div>

      {/* Upload boot sound prompt (bottom) */}
      {!bootSound && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          fontSize: '11px',
          opacity: 0.5,
          textAlign: 'center'
        }}>
          Tip: Upload Windows 98 startup sound in Settings for authentic boot experience
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
