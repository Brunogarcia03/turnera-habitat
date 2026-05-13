import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

type SendWhatsappProps = {
  to: string;
  nombre: string;
};

export async function sendWhatsapp({ to, nombre }: SendWhatsappProps) {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:+54${to}`,
      body: `
Hola ${nombre} 👋

Su solicitud de reunión fue registrada correctamente.

La Municipalidad de Alberti se comunicará con usted próximamente.

Gracias.
      `,
    });
  } catch (error) {
    console.error("Whatsapp Error:", error);
  }
}
