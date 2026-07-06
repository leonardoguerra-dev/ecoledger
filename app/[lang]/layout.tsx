import React from "react";
import { ColorModeProvider } from "@/context/ColorModeContext";
import { AuthProvider } from "@/context/AuthContext";
import { EnergyProvider } from "@/context/EnergyContext";
import MainLayout from "@/components/layout/MainLayout";
import ThemeRegistry from "@/theme/ThemeRegistry";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang || "en"}>
      <body>
        {/* 1. The ThemeRegistry intercepts SSR HTML to inject font metrics before paint */}
        <ThemeRegistry>
          <ColorModeProvider>
            <AuthProvider>
              <EnergyProvider>
                <MainLayout>{children}</MainLayout>
              </EnergyProvider>
            </AuthProvider>
          </ColorModeProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
