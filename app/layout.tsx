import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = { title: 'PrinPrinan' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" /></head>
      <body><div id="app">{children}</div></body>
    </html>
  );
}
