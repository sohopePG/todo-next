import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="max-w-2xl mx-auto p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
