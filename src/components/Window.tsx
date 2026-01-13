import type { ReactNode, CSSProperties } from 'react';
import { memo } from 'react';
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

export const Window = memo(({
  id,
  title,
  icon = '💻',
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 500, height: 600 },
  style,
}: WindowProps) => {
  const windowState = useAppStore((state) => state.windows[id]);
  const closeWindow = useAppStore((state) => state.closeWindow);
  const minimizeWindow = useAppStore((state) => state.minimizeWindow);
  const bringToFront = useAppStore((state) => state.bringToFront);
  const updateWindowPosition = useAppStore((state) => state.updateWindowPosition);
  const updateWindowSize = useAppStore((state) => state.updateWindowSize);

  if (!windowState?.isOpen) return null;

  // Use stored position/size if available, otherwise use defaults
  const position = windowState.position || defaultPosition;
  const size = windowState.size || defaultSize;

  return (
    <Rnd
      position={position}
      size={size}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      cancel=".window-body, .window-menu"
      dragHandleClassName="title-bar"
      style={{
        zIndex: windowState.zIndex,
        display: windowState.isMinimized ? 'none' : 'block',
        ...style,
      }}
      onMouseDown={() => bringToFront(id)}
      onDragStop={(_e, d) => {
        updateWindowPosition(id, { x: d.x, y: d.y });
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        updateWindowSize(id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        updateWindowPosition(id, position);
      }}
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
});
