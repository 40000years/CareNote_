import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareNote - ระบบรายงานการปฏิบัติหน้าที่",
  description: "ระบบจัดการและบันทึกรายงานการปฏิบัติหน้าที่อย่างมืออาชีพ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} ${geist.variable}`}>
      <body className="font-sans antialiased futuristic-bg">
        <div className="min-h-screen flex flex-col relative">
          {/* Global NavBar Logo override */}
          <style>{`
            .navbar-logo {
              background: none !important;
              box-shadow: none !important;
              border-radius: 9999px !important;
              padding: 0 !important;
            }
          `}</style>
          {children}
        </div>
      </body>
    </html>
  );
}
