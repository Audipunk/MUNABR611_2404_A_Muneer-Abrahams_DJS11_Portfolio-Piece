import React from 'react';
import { ButtonIcon,} from '@radix-ui/react-icons';

function ThemeToggle({ theme, toggleTheme, size = 25 }) {
   return (
     <button onClick={toggleTheme} className="theme-toggle">
       {theme === 'dark' ? <buttonIcon width={size} height={size} /> : <ButtonIcon width={size} height={size} />}
     </button>
   );
 }

 export default ThemeToggle;