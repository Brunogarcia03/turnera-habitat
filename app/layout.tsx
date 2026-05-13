import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sileo";

const montserrat = Montserrat({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solicitud de Reunión | Municipalidad de Alberti",
  description:
    "Solicitá tu turno para la evaluación de requisitos de Hábitat en la Municipalidad de Alberti, Provincia de Buenos Aires.",
  keywords: [
    "Municipalidad de Alberti",
    "turnos",
    "hábitat",
    "vivienda",
    "Buenos Aires",
    "solicitud de reunión",
  ],
  authors: [{ name: "Municipalidad de Alberti" }],
  openGraph: {
    title: "Solicitud de Reunión | Municipalidad de Alberti",
    description:
      "Solicitá tu turno para la evaluación de requisitos de Hábitat en la Municipalidad de Alberti.",
    url: "https://alberti.gob.ar",
    siteName: "Municipalidad de Alberti",
    locale: "es_AR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} antialiased overflow-x-hidden`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
