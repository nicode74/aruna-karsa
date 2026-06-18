import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Aruna Karsa",
    default: "Aruna Karsa | Desain Arsitektur & Konstruksi Bangunan",
  },
  description: "Aruna Karsa adalah penyedia layanan desain arsitektur, perencanaan anggaran biaya (RAB) transparan, dan kontraktor konstruksi tepercaya. Wujudkan hunian aman, estetis, dan bernilai sepanjang masa.",
  keywords: ["Aruna Karsa", "arsitek", "kontraktor", "desain rumah", "jasa bangun rumah", "RAB transparan", "konstruksi bangunan", "arsitektur minimalis"],
  openGraph: {
    title: "Aruna Karsa | Desain Arsitektur & Konstruksi Bangunan",
    description: "Wujudkan hunian impian dengan transparansi RAB, estetika modern, dan kekuatan struktur bersama Aruna Karsa.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Blocking script to apply dark/light theme before first paint — eliminates FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}

