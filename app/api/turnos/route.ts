// app/api/turnos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import twilio from "twilio";
import { meetingSchema } from "@/utils/schemas/meeting-schema";

const rawSheetId = process.env.GOOGLE_SHEET_ID ?? "";
const SPREADSHEET_ID = rawSheetId.includes("/d/")
  ? rawSheetId.split("/d/")[1].split("/")[0]
  : rawSheetId;

const SHEET_TURNOS = "Turnos";
const SHEET_SOLICITUDES = "Solicitudes";

const HORARIOS_VALIDOS = [
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

const HEADERS_TURNOS = ["Fecha", "Hora"];

const HEADERS_SOLICITUDES = [
  "Fecha",
  "Hora",
  "Nombre",
  "Apellido",
  "DNI",
  "Edad",
  "Teléfono",
  "Dirección",
  "Localidad",
  "Residencia 6 años",
  "Menores convivientes",
  "Mayores convivientes",
  "Discapacidad",
  "CUD",
  "Ingresos",
  "Otros ingresos",
  "Trabajador municipal",
  "Bienes inmuebles",
  "Bienes muebles",
  "Confirmación",
  "Registrado en",
];

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function inicializarHoja(
  sheets: ReturnType<typeof google.sheets>,
  sheetName: string,
  headers: string[],
) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1`,
  });
  if (!res.data.values?.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    });
  }
}

async function turnoEstaDisponible(
  sheets: ReturnType<typeof google.sheets>,
  fecha: string,
  hora: string,
): Promise<boolean> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_TURNOS}!A2:B`,
  });
  const ocupados = new Set<string>(
    (res.data.values ?? []).map(([f, h]) => `${f}|${h}`),
  );
  return !ocupados.has(`${fecha}|${hora}`);
}

async function enviarWhatsApp(
  telefono: string,
  nombre: string,
  fecha: string,
  hora: string,
) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );
  const soloDigitos = telefono.replace(/\D/g, "");
  const sinCero = soloDigitos.startsWith("0")
    ? soloDigitos.slice(1)
    : soloDigitos;
  const destinatario = `whatsapp:+549${sinCero}`;
  const origen = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

  await client.messages.create({
    from: origen,
    to: destinatario,
    body:
      `Hola ${nombre} 👋\n\n` +
      `Tu turno para la *evaluación de requisitos de Hábitat* en la *Municipalidad de Alberti* fue registrado correctamente.\n\n` +
      `📅 *Fecha:* ${fecha}\n` +
      `🕐 *Hora:* ${hora} hs\n\n` +
      `Recordá presentarte con *toda la documentación* que acredite lo declarado en el formulario.\n\n` +
      `Municipalidad de Alberti`,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = meetingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Validar que venga turno elegido
    const { fecha, hora } = data;
    if (!fecha || !hora) {
      return NextResponse.json(
        { success: false, error: "Debe seleccionar un turno." },
        { status: 400 },
      );
    }

    // Validar que la hora sea válida
    if (!HORARIOS_VALIDOS.includes(hora)) {
      return NextResponse.json(
        { success: false, error: "Horario no válido." },
        { status: 400 },
      );
    }

    const sheets = await getSheetsClient();

    await inicializarHoja(sheets, SHEET_TURNOS, HEADERS_TURNOS);
    await inicializarHoja(sheets, SHEET_SOLICITUDES, HEADERS_SOLICITUDES);

    // Verificar que el turno elegido siga disponible (race condition)
    const disponible = await turnoEstaDisponible(sheets, fecha, hora);
    if (!disponible) {
      return NextResponse.json(
        {
          success: false,
          error:
            "El turno seleccionado ya no está disponible. Por favor elegí otro.",
        },
        { status: 409 },
      );
    }

    const ahora = new Date().toLocaleString("es-AR");

    // Guardar en hoja Turnos
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_TURNOS}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [[fecha, hora]] },
    });

    // Guardar en hoja Solicitudes
    const filaSolicitud = [
      fecha,
      hora,
      data.nombre,
      data.apellido,
      data.dni,
      data.edad,
      data.telefono,
      data.direccion,
      data.localidad,
      data.residencia,
      data.menores,
      data.mayores,
      data.discapacidad,
      data.cud,
      Array.isArray(data.ingresos)
        ? data.ingresos.join(", ")
        : (data.ingresos ?? ""),
      data.otros_ingresos ?? "",
      data.municipal,
      data.bienes_inmuebles,
      data.bienes_muebles,
      data.confirmacion ? "Sí" : "No",
      ahora,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_SOLICITUDES}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [filaSolicitud] },
    });

    try {
      await enviarWhatsApp(data.telefono, data.nombre, fecha, hora);
    } catch (waError) {
      console.error("WhatsApp error (no crítico):", waError);
    }

    return NextResponse.json({
      success: true,
      turno: { fecha, hora },
      message: `Turno confirmado para el ${fecha} a las ${hora} hs.`,
    });
  } catch (error: any) {
    console.error("Error en /api/turnos:", error);
    return NextResponse.json(
      { success: false, error: error.message ?? "Error interno del servidor" },
      { status: 500 },
    );
  }
}
