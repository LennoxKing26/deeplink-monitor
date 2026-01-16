import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Toaster } from '@/components/ui/sonner';
import { IconifyLoader } from '@/components/iconify-loader';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DeepLink Monitor Dashboard',
  description: 'WebRTC Error Log Monitor for DeepLink',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <IconifyLoader />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <iconify-icon icon="mdi:monitor-dashboard" width="24" height="24" className="text-primary" />
                  <h1 className="text-xl font-bold">DeepLink Monitor</h1>
                </div>
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                  <ModeToggle />
                </div>
              </div>
            </header>
            <main className="container mx-auto px-4 py-6">{children}</main>
          </div>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
