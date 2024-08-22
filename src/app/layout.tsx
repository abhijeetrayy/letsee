import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "let's see - Unisocial",
  description: "Cinema Social Media",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
