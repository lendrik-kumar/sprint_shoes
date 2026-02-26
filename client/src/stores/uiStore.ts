import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface UiState {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useUiStore = create<UiState>((set) => ({
  themeMode: (localStorage.getItem('theme') as ThemeMode) ?? 'light',

  toggleTheme: () =>
    set((state) => {
      const next = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return { themeMode: next };
    }),

  setTheme: (mode) => {
    localStorage.setItem('theme', mode);
    set({ themeMode: mode });
  },
}));
