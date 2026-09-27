import { create } from 'zustand';

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  return saved || 'light';
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (newTheme) => {
    set({ theme: newTheme });
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },
}));
