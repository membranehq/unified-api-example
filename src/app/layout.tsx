import "./globals.css";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { Toaster } from "sonner";
import { Instrument_Sans } from "next/font/google";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { IntegrationAppProvider } from "./providers/integration-app-provider";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { AuthModal } from "../components/auth-modal";
import { Header } from "@/components/header";
import { PHProvider } from "./providers/posthog-provider";
import { AuthenticatedContent } from "@/components/authenticated-content";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Simple CRUD Example",
    template: "%s | Simple CRUD Example",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSans.className} antialiased bg-white text-gray-900`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
        >
          <PHProvider>
            <AuthProvider>
              <IntegrationAppProvider>
                <AuthenticatedContent>
                  <Header />
                  {children}
                </AuthenticatedContent>
              </IntegrationAppProvider>
              <AuthModal />
            </AuthProvider>
          </PHProvider>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
