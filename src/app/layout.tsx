import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar"
import Footer from "@/components/footer";

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
        <Navbar/>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}