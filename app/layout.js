import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VU_LMS",
  description: "This is my Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <Authprovider> */}
      <body
        suppressHydrationWarning={false}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
      {/* </Authprovider> */}
    </html>
  );
}
