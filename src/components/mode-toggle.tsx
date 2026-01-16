'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocaleStore } from '@/store/useLocaleStore';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useLocaleStore((s) => s.t);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <iconify-icon icon="mdi:theme-light-dark" width="20" height="20" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('system')} className={theme === 'system' ? 'bg-accent' : ''}>
          <iconify-icon icon="mdi:monitor" width="16" height="16" className="mr-2" />
          {t.theme.system}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-accent' : ''}>
          <iconify-icon icon="mdi:weather-sunny" width="16" height="16" className="mr-2" />
          {t.theme.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-accent' : ''}>
          <iconify-icon icon="mdi:weather-night" width="16" height="16" className="mr-2" />
          {t.theme.dark}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
