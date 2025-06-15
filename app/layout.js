import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title:
    "Virtual University Support Platform | Learn, Practice, and Score High",
  description:
    "An all-in-one learning platform for Virtual University students to access study materials, practice MCQs, and use modern learning techniques to achieve over 90% CGPA. Prepare for CS101, MTH202, and all major VU subjects with AI-powered tools and personalized support.",
  keywords:
    "virtual university, vu learning, vu support platform, vu mcqs, vu past papers, vu materials, high CGPA, learn vu subjects, vu LMS, vu handouts, vu short notes, vu short questions, vu long questions, vu mind maps",
  openGraph: {
    title: "Virtual University Support Platform",
    description:
      "A complete solution for Virtual University students to master their subjects, practice questions, and achieve academic success with advanced tools.",
    url: "https://quiz-app-gray-chi.vercel.app/",
    siteName: "VU Support Platform",
    images: [
      {
        url: "/preview.png",
        width: 800,
        height: 600,
        alt: "VU Support Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual University Support Platform",
    description:
      "Smart study, practice, and revision tools for Virtual University students to boost their CGPA.",
    images: ["/preview.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
