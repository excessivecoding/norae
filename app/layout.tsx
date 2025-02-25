import * as React from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { auth } from "@/auth";
import "./globals.css";

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html>
      <body>
        <div className="min-h-screen text-zinc-900 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Header user={session?.user ?? null} />

            {props.children}
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <Footer />
        </div>
      </body>
    </html>
  );
}
