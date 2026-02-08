import "./globals.css";

export const metadata = {
  title: "QuestY",
  description: "A modern, techy portfolio boilerplate built with Next.js and Tailwind CSS. Designed to be a reusable, impressive boilerplate.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
