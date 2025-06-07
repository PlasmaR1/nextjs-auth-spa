import '../styles/globals.css';
import Navbar from './components/Navbar'; // Navbar

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <Navbar /> {/* 导航栏Navbar */}
        <main>{children}</main>
      </body>
    </html>
  );
}