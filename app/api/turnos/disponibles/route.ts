// app/api/turnos/disponibles/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";

const rawSheetId = process.env.GOOGLE_SHEET_ID ?? "";
const SPREADSHEET_ID = rawSheetId.includes("/d/")
  ? rawSheetId.split("/d/")[1].split("/")[0]
  : rawSheetId;

const SHEET_TURNOS = "Turnos";

const HORARIOS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

// Cuántos días hábiles hacia adelante mostrar
const DIAS_A_MOSTRAR = 10;

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth });
}

function esDiaHabil(fecha: Date): boolean {
  const dia = fecha.getDay();
  return dia !== 0 && dia !== 6;
}

function formatFecha(fecha: Date): string {
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function nombreDia(fecha: Date): string {
  return fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export async function GET() {
  try {
    const sheets = await getSheetsClient();

    // Leer turnos ocupados
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_TURNOS}!A2:B`,
    });

    const ocupados = new Set<string>(
      (res.data.values ?? []).map(([fecha, hora]) => `${fecha}|${hora}`),
    );

    // Construir los próximos DIAS_A_MOSTRAR días hábiles con sus slots libres
    const dias: {
      fecha: string; // "13/05/2026" — lo que se guarda en Sheets
      label: string; // "miércoles 13 de mayo" — lo que ve el usuario
      horarios: string[]; // slots libres ese día
    }[] = [];

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let diasHabilesEncontrados = 0;

    for (let i = 1; diasHabilesEncontrados < DIAS_A_MOSTRAR && i <= 90; i++) {
      const candidato = new Date(hoy);
      candidato.setDate(hoy.getDate() + i);

      if (!esDiaHabil(candidato)) continue;

      const fechaStr = formatFecha(candidato);
      const horariosLibres = HORARIOS.filter(
        (hora) => !ocupados.has(`${fechaStr}|${hora}`),
      );

      // Solo mostrar días que tengan al menos un horario libre
      if (horariosLibres.length > 0) {
        dias.push({
          fecha: fechaStr,
          label: nombreDia(candidato),
          horarios: horariosLibres,
        });
        diasHabilesEncontrados++;
      }
    }

    return NextResponse.json({ success: true, dias });
  } catch (error: any) {
    console.error("Error en /api/turnos/disponibles:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
