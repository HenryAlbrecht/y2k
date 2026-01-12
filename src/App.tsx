import { useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { TodoWindow } from './components/TodoWindow';
import { ProjectsWindow } from './components/ProjectsWindow';
import { NotepadWindow } from './components/NotepadWindow';
import { WinampWindow } from './components/WinampWindow';
import { SettingsWindow } from './components/SettingsWindow';
import { BudgetWindow } from './components/BudgetWindow';
import { StartupScreen } from './components/StartupScreen';
import { useAppStore } from './store/useAppStore';
import './App.css';

function App() {
  const { theme, hasBooted } = useAppStore();

  useEffect(() => {
    document.documentElement.style.setProperty('--neon-pink', theme.primary);
    document.documentElement.style.setProperty('--neon-cyan', theme.secondary);
    document.body.style.backgroundColor = theme.bgColor;
    
    // Apply wallpaper
    if (theme.wallpaper) {
      document.body.style.backgroundImage = `url(${theme.wallpaper})`;
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
  }, [theme]);

  // Show boot screen on first visit
  if (!hasBooted) {
    return <StartupScreen />;
  }

  return (
    <>
      <div className="marquee">
        <p>*** WELCOME TO YOUR PERSONAL PRODUCTIVITY ZONE *** DON'T FORGET TO DRINK WATER *** DOWNLOAD COMPLETED 99% ***</p>
      </div>

      <Desktop />

      {/* Windows */}
      <TodoWindow />
      <ProjectsWindow />
      <NotepadWindow />
      <WinampWindow />
      <SettingsWindow />
      <BudgetWindow />

      <Taskbar />
    </>
  );
}

export default App;
