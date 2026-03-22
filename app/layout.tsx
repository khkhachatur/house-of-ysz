import localFont from 'next/font/local';
import Navbar from "./components/Navbar";
import { StoreProvider } from "../context/StoreContext";
import "./globals.css";
import Footer from './components/Footer';

const rebelton = localFont({
  src: [
    { path: '../fonts/REBELTON-Light.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/REBELTON-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/REBELTON-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/REBELTON-Bold.woff2', weight: '700', style: 'normal' },
    // Italics
    { path: '../fonts/REBELTONITALIC-Light.woff2', weight: '300', style: 'italic' },
    { path: '../fonts/REBELTONITALIC-Regular.woff2', weight: '400', style: 'italic' },
    { path: '../fonts/REBELTONITALIC-Medium.woff2', weight: '500', style: 'italic' },
    { path: '../fonts/REBELTONITALIC-Bold.woff2', weight: '700', style: 'italic' },
  ],
  variable: '--font-rebelton',
  display: 'swap',
});

const rebeltonExtended = localFont({
  src: [
    { path: '../fonts/REBELTON-Extended.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/REBELTONITALIC-Extended.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-rebelton-extended',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rebelton.variable} ${rebeltonExtended.variable}`}>
      <body className="antialiased bg-black min-h-screen font-sans text-white">
        <Navbar />
        <StoreProvider> 
          <Navbar />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}