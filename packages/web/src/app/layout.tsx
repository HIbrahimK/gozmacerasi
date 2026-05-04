import React from 'react';

export const metadata = {
  title: 'Gözmacerasi - Vision Therapy Games',
  description: 'Smart adaptive vision therapy for children',
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
      </head>
      <body className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
