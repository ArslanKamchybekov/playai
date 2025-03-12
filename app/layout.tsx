import type React from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PlayAI Book Reader",
  description: "Read and listen to your PDFs with PlayAI's Text-to-Speech",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <script type="text/javascript" src="https://unpkg.com/@play-ai/agent-web-sdk"></script>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener("load", () => {
                PlayAI.open('yapan3FeOzlAGls51Ffhj');
              });
            `,
          }}
        />
      </Head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
