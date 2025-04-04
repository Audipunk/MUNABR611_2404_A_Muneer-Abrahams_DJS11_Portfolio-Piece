import React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

function ThemeToggle({ theme, toggleTheme, size = 25 }) {
  return (
    <button onClick={toggleTheme} className="theme-toggle flex items-center gap-2">
      {theme === 'dark' ? <MoonIcon width={size} height={size} /> : <SunIcon width={size} height={size} />}
      <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
    </button>
  );
}

export default ThemeToggle;
