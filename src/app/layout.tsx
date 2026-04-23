import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Gutenberg AI Library",
  description: "Read classic books from Project Gutenberg and discuss them with AI.",
};

import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/login/actions";
import Link from "next/link";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-black">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white shadow-sm">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 text-sm">
            <Link href="/" className="font-bold text-xl text-blue-600">Library</Link>
            <div className="flex items-center gap-4">
              {data.user ? (
                <div className="flex items-center gap-4 text-gray-900">
                  <span>Hey, <span className="font-semibold">{data.user.email}</span>!</span>
                  <form action={signout}>
                    <button className="py-2 px-4 rounded-md no-underline bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium border border-gray-300 transition-colors">
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="py-2 px-4 rounded-md no-underline bg-blue-600 text-white hover:bg-blue-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
