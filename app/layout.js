import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter= Inter({ subsets: ["latin"] });



export const metadata = {
  title: "SplitPalX",
  description: "A smart expense-splitting app that helps groups track, manage, and settle shared costs effortlessly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logos/logo-s.png" sizes="any" />
      </head>
      <body
        className={`${inter.className} `}>
          <ClerkProvider>

          
        <ConvexClientProvider>

       
       
        <Header/>
        <main className="min-h-screen">
           <Toaster richColors />
          {children}</main>
        </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
