import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "./theme/ThemeRegistry";
import MainLayout from "./components/layout/MainLayout";

export const metadata: Metadata = {
  title: "EcoLedger",
  description:
    "Personal finance tracker focused on sustainability and carbon footprint accounting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <MainLayout>{children}</MainLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
