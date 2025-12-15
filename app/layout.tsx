import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smartserveapp.vercel.app"), // Change to your real domain

  title: {
    default: "SmartServe — AI Customer Support System",
    template: "%s | SmartServe",
  },

  description:
    "SmartServe is an AI-powered customer support system that helps businesses automate conversations, route support tickets, and boost customer satisfaction.",

  keywords: [
    "customer support",
    "AI chatbot",
    "ticket system",
    "helpdesk",
    "Next.js AI support app",
    "SmartServe",
    "automation",
    "Firebase",
  ],

  authors: [{ name: "PasserTech" }],
  creator: "PasserTech",
  publisher: "PasserTech",

  openGraph: {
    title: "SmartServe — AI Customer Support & Ticket Management",
    description:
      "An advanced AI-powered support platform that helps organizations manage customer interactions, automate replies, and deliver excellent service.",
    url: "https://smartserveapp.vercel.app",
    siteName: "SmartServe App",
    images: [
      {
        url: "/og-image.png", // Create this later
        width: 1200,
        height: 630,
        alt: "SmartServe App",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SmartServe — AI Customer Support",
    description:
      "SmartServe automates conversations and routes tickets to the right agents using AI.",
    images: ["/og-image.png"],
    creator: "@PasserTechHQ", // optional
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  category: "technology",

  themeColor: "#0D9488", // teal
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://smartserveapp.vercel.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
