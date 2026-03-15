import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'German Learning App',
  description: 'Learn German with spaced repetition flashcards',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-blue-600">🇩🇪 Deutsch Lernen</h1>
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
