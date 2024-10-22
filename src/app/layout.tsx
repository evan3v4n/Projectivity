import type { Metadata } from "next";
import "./globals.css";
import dynamic from 'next/dynamic';
import Footer from "@/components/footer";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
// Dynamically import client components
const AuthProviderWrapper = dynamic(() => import("@/components/AuthProviderWrapper"), { ssr: false });
const Navbar = dynamic(() => import("@/components/navbar"), { ssr: false });
const ApolloProviderWrapper = dynamic(() => import("@/components/ApolloProviderWrapper"), { ssr: false });

export const metadata: Metadata = {
  title: "Projectivity",
  description: "Collaborative learning and project development platform for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProviderWrapper>
          <ApolloProviderWrapper>
            <Navbar/>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                <ToastProvider >
                  {children}
                  <ToastViewport />
                </ToastProvider>
              </div>
              <Footer />
            </div>
          </ApolloProviderWrapper>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
