import './globals.css';
export const metadata = {
  title: "Todo App",
  description: "A simple Todo list using Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}