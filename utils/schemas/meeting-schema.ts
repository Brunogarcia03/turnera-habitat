import { z } from "zod";

export const meetingSchema = z.object({
  nombre: z.string().min(2, "Ingrese un nombre válido"),

  apellido: z.string().min(2, "Ingrese un apellido válido"),

  edad: z.string().min(1, "Ingrese la edad"),

  dni: z.string().min(7, "Ingrese un DNI válido"),

  telefono: z.string().min(8, "Ingrese un teléfono válido"),

  direccion: z.string().min(3, "Ingrese una dirección válida"),

  localidad: z.string().min(2, "Ingrese una localidad"),

  residencia: z.string(),

  menores: z.string(),

  mayores: z.string(),

  discapacidad: z.string(),

  cud: z.string(),

  ingresos: z.array(z.string()).optional(),

  otros_ingresos: z.string().optional(),

  municipal: z.string(),

  bienes_inmuebles: z.string(),

  bienes_muebles: z.string(),
  fecha: z.string().min(1, "Debe seleccionar una fecha"),
  hora: z.string().min(1, "Debe seleccionar un horario"),

  confirmacion: z.boolean().refine((val) => val === true, {
    message: "Debe aceptar la declaración",
  }),
});

export type MeetingFormData = z.infer<typeof meetingSchema>;
