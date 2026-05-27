import React from 'react';

export const metadata = {
  title: 'PANDA - Patient Ambient Notification & Danger Analysis',
  description: 'Sistem ambient intelijen pendeteksi dini anomali pasien pasca-stroke.',
};

export default function RootLayout({
  children,
}: {
  children: React.JSX.Element;
}) {
  return (
    <html lang="id">
      <head>
        {}
        <script src="https://cdn.tailwindcss.com" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
