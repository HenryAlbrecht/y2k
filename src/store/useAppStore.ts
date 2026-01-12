import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  desc: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  projectId: string | null;
  completed: boolean;
  status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
  tags: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Track {
  id: string;
  name: string;
  url: string;
  duration?: number;
}

export interface WindowState {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface AppState {
  // Tasks
  tasks: Task[];
  taskFilter: 'all' | 'pending' | 'completed';
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'status' | 'tags'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setTaskFilter: (filter: 'all' | 'pending' | 'completed') => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  addTaskTag: (id: string, tag: string) => void;
  removeTaskTag: (id: string, tag: string) => void;

  // Projects
  projects: Project[];
  addProject: (name: string, color?: string, description?: string) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id'>>) => void;

  // Windows
  windows: Record<string, WindowState>;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;

  // Theme
  theme: {
    bgColor: string;
    primary: string;
    secondary: string;
    wallpaper: string | null;
  };
  setTheme: (theme: Partial<AppState['theme']>) => void;

  // Notepad
  notepadContent: string;
  setNotepadContent: (content: string) => void;

  // Budget
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;

  // Winamp Playlist
  playlist: Track[];
  currentTrackIndex: number;
  addToPlaylist: (tracks: Omit<Track, 'id'>[]) => void;
  removeFromPlaylist: (id: string) => void;
  clearPlaylist: () => void;
  setCurrentTrack: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;

  // Boot
  hasBooted: boolean;
  bootSound: string | null;
  setHasBooted: (value: boolean) => void;
  setBootSound: (sound: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      taskFilter: 'all',
      projects: [],
      playlist: [],
      currentTrackIndex: -1,
      hasBooted: false,
      bootSound: null,
      windows: {
        budget: { id: 'budget', isOpen: false, isMinimized: false, zIndex: 15, position: { x: 50, y: 50 }, size: { width: 600, height: 650 } },
        todo: { id: 'todo', isOpen: true, isMinimized: false, zIndex: 10, position: { x: 150, y: 50 }, size: { width: 600, height: 650 } },
        projects: { id: 'projects', isOpen: false, isMinimized: false, zIndex: 11, position: { x: 250, y: 100 }, size: { width: 500, height: 600 } },
        notepad: { id: 'notepad', isOpen: false, isMinimized: false, zIndex: 12, position: { x: 200, y: 80 }, size: { width: 500, height: 600 } },
        winamp: { id: 'winamp', isOpen: false, isMinimized: false, zIndex: 13, position: { x: 400, y: 150 }, size: { width: 450, height: 500 } },
        settings: { id: 'settings', isOpen: false, isMinimized: false, zIndex: 14, position: { x: 100, y: 100 }, size: { width: 420, height: 520 } },
      },
      theme: {
        bgColor: '#000000',
        primary: '#000080',
        secondary: '#1084d0',
        wallpaper: null,
      },
      notepadContent: '',
      transactions: [],

      
      // Task actions
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Math.random().toString(36).substr(2, 9),
              completed: false,
              status: 'not-started',
              tags: [],
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id 
              ? { 
                  ...t, 
                  completed: !t.completed,
                  status: !t.completed ? 'completed' : t.status === 'completed' ? 'in-progress' : t.status
                } 
              : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      setTaskFilter: (filter) => set({ taskFilter: filter }),

      updateTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id 
              ? { 
                  ...t, 
                  status,
                  completed: status === 'completed'
                } 
              : t
          ),
        })),

      addTaskTag: (id, tag) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id && !t.tags.includes(tag)
              ? { ...t, tags: [...t.tags, tag] }
              : t
          ),
        })),

      removeTaskTag: (id, tag) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, tags: t.tags.filter((tg) => tg !== tag) }
              : t
          ),
        })),

      // Project actions
      addProject: (name, color = '#0078d7', description = '') =>
        set((state) => ({
          projects: [
            ...state.projects,
            { id: Math.random().toString(36).substr(2, 9), name, color, description },
          ],
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.map((t) =>
            t.projectId === id ? { ...t, projectId: null } : t
          ),
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      // Window actions
      openWindow: (id) => {
        const maxZ = Math.max(...Object.values(get().windows).map((w) => w.zIndex));
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isOpen: true, isMinimized: false, zIndex: maxZ + 1 },
          },
        }));
      },

      closeWindow: (id) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isOpen: false },
          },
        })),

      minimizeWindow: (id) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isMinimized: !state.windows[id].isMinimized },
          },
        })),

      bringToFront: (id) => {
        const maxZ = Math.max(...Object.values(get().windows).map((w) => w.zIndex));
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], zIndex: maxZ + 1 },
          },
        }));
      },

      updateWindowPosition: (id, position) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], position },
          },
        })),

      updateWindowSize: (id, size) =>
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], size },
          },
        })),

      // Theme actions
      setTheme: (theme) =>
        set((state) => ({
          theme: { ...state.theme, ...theme },
        })),

      // Budget actions
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            {
              ...transaction,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      // Notepad actions
      setNotepadContent: (content) => set({ notepadContent: content }),

      // Winamp Playlist actions
      addToPlaylist: (tracks) => set((state) => {
        const newTracks = tracks.map(track => ({
          ...track,
          id: Date.now().toString() + Math.random().toString(36),
        }));
        return { playlist: [...state.playlist, ...newTracks] };
      }),

      removeFromPlaylist: (id) => set((state) => {
        const index = state.playlist.findIndex(t => t.id === id);
        const newPlaylist = state.playlist.filter(t => t.id !== id);
        let newIndex = state.currentTrackIndex;
        
        if (index === state.currentTrackIndex) {
          newIndex = -1; // Stop if current track is removed
        } else if (index < state.currentTrackIndex) {
          newIndex = state.currentTrackIndex - 1;
        }
        
        return { playlist: newPlaylist, currentTrackIndex: newIndex };
      }),

      clearPlaylist: () => set({ playlist: [], currentTrackIndex: -1 }),

      setCurrentTrack: (index) => set({ currentTrackIndex: index }),

      playNext: () => set((state) => {
        if (state.playlist.length === 0) return state;
        const nextIndex = (state.currentTrackIndex + 1) % state.playlist.length;
        return { currentTrackIndex: nextIndex };
      }),

      playPrevious: () => set((state) => {
        if (state.playlist.length === 0) return state;
        const prevIndex = state.currentTrackIndex - 1 < 0 
          ? state.playlist.length - 1 
          : state.currentTrackIndex - 1;
        return { currentTrackIndex: prevIndex };
      }),

      // Boot actions
      setHasBooted: (value) => set({ hasBooted: value }),
      setBootSound: (sound) => set({ bootSound: sound }),
    }),
    {
      name: 'y2k-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        taskFilter: state.taskFilter,
        projects: state.projects,
        windows: state.windows,
        notepadContent: state.notepadContent,
        transactions: state.transactions,
        playlist: state.playlist,
        currentTrackIndex: state.currentTrackIndex,
        hasBooted: state.hasBooted,
        bootSound: state.bootSound,
        theme: {
          ...state.theme,
          wallpaper: null, // Don't persist wallpaper in localStorage
        },
      }),
    }
  )
);
