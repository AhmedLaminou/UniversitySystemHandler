import { useEffect, useState } from "react";
import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Theme = "white" | "dark" | "blue" | "gold";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("white");

  useEffect(() => {
    // Check local storage or system preference on mount if needed
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    
    // Handle Tailwind 'dark' class for legacy dark mode support if needed
    if (newTheme === 'dark' || newTheme === 'blue') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex items-center gap-2 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
        <button
          onClick={() => changeTheme('white')}
          className={cn(
            "w-8 h-8 rounded-full border-2 transition-all duration-300",
            theme === 'white' ? "border-primary scale-110 shadow-lg" : "border-gray-200 hover:scale-105"
          )}
          style={{ background: '#ffffff' }}
          title="Mode Clair"
        />
        <button
          onClick={() => changeTheme('dark')}
          className={cn(
            "w-8 h-8 rounded-full border-2 transition-all duration-300",
            theme === 'dark' ? "border-primary scale-110 shadow-lg" : "border-slate-700 hover:scale-105"
          )}
          style={{ background: '#0f172a' }}
          title="Mode Sombre"
        />
        <button
          onClick={() => changeTheme('blue')}
          className={cn(
            "w-8 h-8 rounded-full border-2 transition-all duration-300",
            theme === 'blue' ? "border-white scale-110 shadow-lg" : "border-blue-700 hover:scale-105"
          )}
          style={{ background: '#0ea5e9' }}
          title="Thème Océan"
        />
        <button
          onClick={() => changeTheme('gold')}
          className={cn(
            "w-8 h-8 rounded-full border-2 transition-all duration-300",
            theme === 'gold' ? "border-white scale-110 shadow-lg" : "border-yellow-700 hover:scale-105"
          )}
          style={{ background: '#eab308' }}
          title="Thème Prestige"
        />
      </div>
    </div>
  );
}
