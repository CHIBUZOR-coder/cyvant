import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import MouseFollower from "@/components/ui/MouseFollower";
import ThemeProvider from "@/components/ThemeProvider";
import PublicShell from "@/components/layout/PublicShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CYVANT — AI & Cybersecurity Education",
    template: "%s | CYVANT",
  },
  description:
    "AI and cybersecurity education built for Africa, ready for the world. Start your journey with CYVANT.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-gray-900 dark:text-white antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <MouseFollower />
          <PublicShell>{children}</PublicShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
