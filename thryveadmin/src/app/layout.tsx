import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RQProvider } from "@/lib/react-query"; // React Query provider (client component)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: Customize global metadata & branding.
// Consider dynamic title template & theming.
export const metadata: Metadata = {
  title: {
    default: 'Thryve Admin',
    template: '%s | Thryve Admin'
  },
  description: 'Administrative dashboard for platform oversight',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RQProvider>
          {children}
        </RQProvider>
      </body>
    </html>
  );
}
