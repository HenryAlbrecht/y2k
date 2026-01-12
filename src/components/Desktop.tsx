import { useAppStore } from '../store/useAppStore';

interface DesktopIconProps {
  icon: string;
  label: string;
  color: string;
  onDoubleClick: () => void;
}

const DesktopIcon = ({ icon, label, color, onDoubleClick }: DesktopIconProps) => (
  <div className="desktop-icon" onDoubleClick={onDoubleClick}>
    <div className="icon-img" style={{ color }}>
      {icon}
    </div>
    <span>{label}</span>
  </div>
);

export const Desktop = () => {
  const { openWindow } = useAppStore();

  return (
    <div id="desktop">
      <DesktopIcon
        icon="📝"
        label="My Tasks"
        color="#ff1493"
        onDoubleClick={() => openWindow('todo')}
      />
      <DesktopIcon
        icon="📁"
        label="Projects"
        color="#00bfff"
        onDoubleClick={() => openWindow('projects')}
      />
      <DesktopIcon
        icon="📔"
        label="Notepad"
        color="#ffa500"
        onDoubleClick={() => openWindow('notepad')}
      />
      <DesktopIcon
        icon="⚡"
        label="Winamp"
        color="#ffcc00"
        onDoubleClick={() => openWindow('winamp')}
      />
      <DesktopIcon
        icon="👽"
        label="Internet"
        color="#00ff00"
        onDoubleClick={() => alert('Searching for aliens...')}
      />
      <DesktopIcon
        icon="💰"
        label="Budget"
        color="#00cc44"
        onDoubleClick={() => openWindow('budget')}
      />
    </div>
  );
};
