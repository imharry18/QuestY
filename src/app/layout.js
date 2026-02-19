import { QuestProvider } from './context/QuestContext';
import './globals.css';

export const metadata = {
  title: 'QuestY — Your Ultimate Coding Battlefield',
  description: 'Master coding, crack interviews, and stay consistent with QuestY. Premium preparation platform for developers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QuestProvider>
          {children}
        </QuestProvider>
      </body>
    </html>
  );
}
