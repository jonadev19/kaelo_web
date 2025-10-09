import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ruta Bici-Maya - Admin",
  description: "Panel de administración",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
