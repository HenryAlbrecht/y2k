import { useState, useRef, useEffect } from 'react';
import { Window } from './Window';

export const TerminalWindow = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to Y2K OS Terminal.', 'Type "help" for a list of commands.']);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const args = trimmedCmd.split(' ');
    const command = args[0];

    const newHistory = [...history, `> ${cmd}`];

    switch (command) {
      case 'help':
        newHistory.push(
          'Available commands:',
          '  help     - Show this help message',
          '  clear    - Clear the screen',
          '  echo     - Print text',
          '  date     - Show current date and time',
          '  whoami   - Show current user',
          '  reboot   - Reboot the system (resets data)',
          '  ver      - Show OS version'
        );
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'echo':
        newHistory.push(args.slice(1).join(' '));
        break;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      case 'whoami':
        newHistory.push('admin');
        break;
      case 'reboot':
        newHistory.push('Rebooting system...');
        setTimeout(() => {
          localStorage.clear();
          window.location.reload();
        }, 1000);
        break;
      case 'ver':
        newHistory.push('Y2K OS [Version 1.0.0]');
        break;
      case '':
        break;
      default:
        newHistory.push(`Command not found: ${command}`);
    }

    setHistory(newHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <Window
      id="terminal"
      title="Terminal.exe"
      icon=">_"
      defaultPosition={{ x: 350, y: 250 }}
      defaultSize={{ width: 500, height: 350 }}
    >
      <div
        style={{
          background: '#000',
          color: '#0f0',
          fontFamily: 'Courier New, monospace',
          height: '100%',
          padding: '5px',
          overflowY: 'auto',
          fontSize: '14px'
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>
        ))}
        <div style={{ display: 'flex' }}>
          <span>&gt;&nbsp;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0f0',
              fontFamily: 'inherit',
              flex: 1,
              outline: 'none',
              padding: 0,
              fontSize: 'inherit'
            }}
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </Window>
  );
};
