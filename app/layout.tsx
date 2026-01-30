import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Actio - Paste instructions. Get actions.",
  description: "Convert long instructions into clear, actionable checklists. Free, stateless, account-less.",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="8" fill="%236b7a5a" stroke="%231a1a1a" stroke-width="6"/><path d="M30 50 L45 65 L70 35" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
