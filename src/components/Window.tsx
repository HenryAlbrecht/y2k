import type { ReactNode, CSSProperties } from 'react';
import { Rnd } from 'react-rnd';
import { useAppStore } from '../store/useAppStore';

interface WindowProps {
  id: string;
  title: string;
  icon?: string;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  style?: CSSProperties;
}

export const Window = ({
  id,
  title,
  icon = '💻',
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 500, height: 600 },
  style,
}: WindowProps) => {
  const { windows, closeWindow, minimizeWindow, bringToFront } = useAppStore();
  const windowState = windows[id];

  if (!windowState?.isOpen) return null;

  return (
    <Rnd
      default={{
        ...defaultPosition,
        ...defaultSize,
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      cancel=".window-body, .window-menu"
      style={{
        zIndex: windowState.zIndex,
        display: windowState.isMinimized ? 'none' : 'block',
        ...style,
      }}
      onMouseDown={() => bringToFront(id)}
    >
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">
            {icon} {title}
          </div>
          <div className="title-bar-controls">
            <button onClick={() => minimizeWindow(id)} aria-label="Minimize">
              _
            </button>
            <button onClick={() => closeWindow(id)} aria-label="Close">
              X
            </button>
          </div>
        </div>
        <div className="window-menu">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Help</span>
        </div>
        <div className="window-body">{children}</div>
      </div>
    </Rnd>
  );
};
