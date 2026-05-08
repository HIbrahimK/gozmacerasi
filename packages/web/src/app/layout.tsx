import React from 'react';
import './globals.css';

export const metadata = {
  title: 'GözMacerası — Göz Tembelliği 3D Oyun Tedavi Platformu',
  description:
    'Kırmızı-mavi 3D anaglyph gözlüklerle oynanan özel oyunlar sayesinde göz tembelliğini eğlenceli maceraya dönüştür.',
  metadataBase: new URL('http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
