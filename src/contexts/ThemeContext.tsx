import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verifica se há um tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'dark';
  });

  useEffect(() => {
    // Salva o tema no localStorage
    localStorage.setItem('theme', theme);
    
    // Aplica o tema ao documento
    document.documentElement.setAttribute('data-theme', theme);
    
    // Atualiza as variáveis CSS
    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg-primary', '#ffffff');
      document.documentElement.style.setProperty('--bg-secondary', '#f1f3f4');
      document.documentElement.style.setProperty('--bg-tertiary', '#e8eaed');
      document.documentElement.style.setProperty('--text-primary', '#000000');
      document.documentElement.style.setProperty('--text-secondary', '#5f6368');
      document.documentElement.style.setProperty('--text-tertiary', '#3c4043');
      document.documentElement.style.setProperty('--border-color', '#dadce0');
      document.documentElement.style.setProperty('--accent-color', '#ffc107');
      document.documentElement.style.setProperty('--accent-hover', '#e0a800');
      document.documentElement.style.setProperty('--shadow-color', 'rgba(0,0,0,0.1)');
      document.documentElement.style.setProperty('--header-shadow', '0 5px 30px -10px rgba(255,193,7,0.3)');
    } else {
      document.documentElement.style.setProperty('--bg-primary', '#000000');
      document.documentElement.style.setProperty('--bg-secondary', '#1a1a1a');
      document.documentElement.style.setProperty('--bg-tertiary', '#333333');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#9ca3af');
      document.documentElement.style.setProperty('--text-tertiary', '#6b7280');
      document.documentElement.style.setProperty('--border-color', '#4b5563');
      document.documentElement.style.setProperty('--accent-color', '#ebdb2f');
      document.documentElement.style.setProperty('--accent-hover', '#d4c726');
      document.documentElement.style.setProperty('--shadow-color', 'rgba(0,0,0,0.5)');
      document.documentElement.style.setProperty('--header-shadow', '0 5px 30px -10px rgba(235,219,47,0.5)');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 