import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Webinar Dashboard",
  description: "Live eWebinar registrant and attendance statistics",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="border-b border-gridline bg-surface-1">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex">
              <Image
                src="/logo-light.png"
                alt="Lead Every Day"
                width={63}
                height={36}
                priority
                className="logo-light"
              />
              <Image
                src="/logo-dark.png"
                alt="Lead Every Day"
                width={64}
                height={36}
                priority
                className="logo-dark"
              />
            </Link>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
