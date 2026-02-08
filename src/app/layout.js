import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QuestY | Master Your Interviews",
  description: "The interactive sheet for developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow bg-[#FAFAFA]">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}