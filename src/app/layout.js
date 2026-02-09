import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/ui/Navbar"; // Check casing: 'ui' vs 'UI'
import Footer from "../components/ui/Footer"; // Check casing: 'ui' vs 'UI'
import { Toaster } from 'sonner';
import { ThemeProvider } from "../providers/ThemeProvider"; // Ensure this path is correct

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QuestY | Master Your Interviews",
  description: "The interactive sheet for developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}