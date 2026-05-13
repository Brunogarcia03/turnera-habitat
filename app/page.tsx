"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { meetingSchema, MeetingFormData } from "@/utils/schemas/meeting-schema";

import Image from "next/image";
import Link from "next/link";

import Input from "@/components/ui/Input";
import RadioGroup from "@/components/ui/RadioGroup";
import CheckboxGroup from "@/components/ui/CheckboxGroup";
import SectionTitle from "@/components/SectionTitle";

import { useState } from "react";
import TurnoSelector from "@/components/TurnoSelector";
import Confirmacion from "@/components/Confirmacion";
import { sileo } from "sileo";

export default function Home() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
  });
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<{
    fecha: string;
    hora: string;
  } | null>(null);
  const [confirmacion, setConfirmacion] = useState<{
    turno: { fecha: string; hora: string };
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    localidad: string;
  } | null>(null);

  const [turnoError, setTurnoError] = useState<string>("");

  const onSubmit = async (data: any) => {
    // Validar que haya turno elegido antes de enviar
    if (
      !turnoSeleccionado ||
      !turnoSeleccionado.fecha ||
      !turnoSeleccionado.hora ||
      turnoSeleccionado.hora === ""
    ) {
      setTurnoError("Debe seleccionar un día y horario.");
      return;
    }
    setTurnoError("");

    const request = fetch("/api/turnos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        fecha: turnoSeleccionado.fecha,
        hora: turnoSeleccionado.hora,
      }),
    }).then(async (res) => {
      const result = await res.json();
      if (!result.success) {
        if (res.status === 409) setTurnoSeleccionado(null);
        throw new Error(result.error ?? "Ocurrió un error. Intentá de nuevo.");
      }
      return result;
    });

    sileo.promise(request, {
      loading: {
        title: "Enviando solicitud...",
        description: "Registrando tu turno, un momento.",
      },
      success: (result: any) => {
        // Mostrar pantalla de confirmación
        setConfirmacion({
          turno: result.turno,
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          telefono: data.telefono,
          localidad: data.localidad,
        });
        return {
          title: "Solicitud enviada",
          description: `Turno: ${result.turno.fecha} a las ${result.turno.hora} hs.`,
        };
      },
      error: (err: any) => ({
        title: "No se pudo enviar",
        description: err?.message ?? "Verificá tu conexión e intentá de nuevo.",
      }),
    });
  };

  if (confirmacion) {
    return (
      <Confirmacion
        turno={confirmacion.turno}
        nombre={confirmacion.nombre}
        apellido={confirmacion.apellido}
        dni={confirmacion.dni}
        telefono={confirmacion.telefono}
        localidad={confirmacion.localidad}
      />
    );
  }

  return (
    <main className="bg-white min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* HERO */}
        <div className="mb-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/ICON.png"
              priority
              alt="Logo Municipalidad de Alberti"
              width={32}
              height={32}
              className="w-8 md:w-10 h-auto"
            />

            <h1
              id="text-icon"
              className="text-blue uppercase tracking-widest font-bold text-[1rem] sm:text-[1.1rem] leading-none ml-2 transition-colors duration-300"
              style={{ willChange: "auto" }}
            >
              Municipalidad <br />
              de Alberti
            </h1>
          </Link>

          <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight max-w-4xl">
            Solicitud de Reunión
          </h1>

          <p className="text-gray text-lg md:text-xl mt-4">
            Evaluación de requisitos de Hábitat
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.log("Errores de validación:", errors),
          )}
          className="bg-white border border-gray/20 rounded-4xl p-6 md:p-12 shadow-[0_4px_30px_rgba(132,138,140,0.4)]"
        >
          {/* DATOS PERSONALES */}
          <SectionTitle
            title="Datos Personales"
            description="Complete la información personal solicitada."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Input
              label="Nombre"
              name="nombre"
              required
              placeholder="Ingrese su nombre"
              register={register}
              error={errors.nombre?.message}
            />

            <Input
              label="Apellido"
              name="apellido"
              required
              placeholder="Ingrese su apellido"
              register={register}
              error={errors.apellido?.message}
            />

            <Input
              label="Edad"
              name="edad"
              type="number"
              required
              placeholder="Ingrese su edad"
              register={register}
              error={errors.edad?.message}
            />

            <Input
              label="DNI"
              name="dni"
              required
              placeholder="Ingrese su DNI"
              register={register}
              error={errors.dni?.message}
            />

            <Input
              label="Teléfono"
              name="telefono"
              required
              placeholder="Ingrese su teléfono"
              register={register}
              error={errors.telefono?.message}
            />

            <Input
              label="Dirección"
              name="direccion"
              required
              placeholder="Ingrese su dirección"
              register={register}
              error={errors.direccion?.message}
            />

            <div className="md:col-span-2">
              <Input
                label="Localidad"
                name="localidad"
                required
                placeholder="Ingrese su localidad"
                register={register}
                error={errors.localidad?.message}
              />
            </div>
          </div>

          {/* RESIDENCIA */}
          <SectionTitle
            title="Residencia"
            description="Información sobre permanencia en Alberti."
          />

          <RadioGroup
            label="¿Reside hace 6 años o más en Alberti?"
            name="residencia"
            required
            register={register}
            options={[
              {
                label: "Sí",
                value: "si",
              },
              {
                label: "No",
                value: "no",
              },
            ]}
          />

          {/* GRUPO FAMILIAR */}
          <SectionTitle
            title="Grupo Familiar"
            description="Complete la conformación del grupo familiar conviviente."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <Input
              label="Cantidad de menores convivientes"
              name="menores"
              type="number"
              required
              placeholder="0"
              register={register}
              error={errors.menores?.message}
            />

            <Input
              label="Cantidad de mayores convivientes"
              name="mayores"
              type="number"
              required
              placeholder="0"
              register={register}
              error={errors.mayores?.message}
            />
          </div>

          {/* DISCAPACIDAD */}
          <SectionTitle
            title="Discapacidad"
            description="Información relacionada a discapacidad y CUD."
          />

          <RadioGroup
            label="¿Algún integrante de la familia posee discapacidad?"
            name="discapacidad"
            required
            register={register}
            options={[
              {
                label: "Sí",
                value: "si",
              },
              {
                label: "No",
                value: "no",
              },
            ]}
          />

          <RadioGroup
            label="¿Posee CUD?"
            name="cud"
            required
            register={register}
            options={[
              {
                label: "Sí",
                value: "si",
              },
              {
                label: "No",
                value: "no",
              },
            ]}
          />

          {/* INGRESOS */}
          <SectionTitle
            title="Ingresos"
            description="Seleccione todas las opciones que correspondan."
          />

          <CheckboxGroup
            label="Ingresos del grupo familiar"
            name="ingresos"
            register={register}
            options={[
              {
                label: "Trabajo Formal",
                value: "trabajo_formal",
              },
              {
                label: "Trabajo Informal",
                value: "trabajo_informal",
              },
              {
                label: "Autónomo",
                value: "autonomo",
              },
              {
                label: "Monotributista",
                value: "monotributista",
              },
              {
                label: "AUH",
                value: "auh",
              },
              {
                label: "Pensión",
                value: "pension",
              },
              {
                label: "Jubilación",
                value: "jubilacion",
              },
              {
                label: "Otros",
                value: "otros",
              },
            ]}
          />

          <div className="mt-6">
            <Input
              label="Otros ingresos (completar)"
              name="otros_ingresos"
              placeholder="Detalle otros ingresos"
              register={register}
              error={errors.otros_ingresos?.message}
            />
          </div>

          {/* TRABAJADOR MUNICIPAL */}
          <SectionTitle
            title="Situación Laboral"
            description="Información laboral municipal."
          />

          <RadioGroup
            label="¿Es trabajador/a municipal?"
            name="municipal"
            required
            register={register}
            options={[
              {
                label: "Sí",
                value: "si",
              },
              {
                label: "No",
                value: "no",
              },
            ]}
          />

          {/* BIENES */}
          <SectionTitle
            title="Bienes"
            description="Información patrimonial del grupo familiar."
          />

          <RadioGroup
            label="¿Posee bienes inmuebles a su nombre o del grupo familiar? (casa / terreno)"
            name="bienes_inmuebles"
            required
            register={register}
            options={[
              {
                label: "Sí",
                value: "si",
              },
              {
                label: "No",
                value: "no",
              },
            ]}
          />

          <RadioGroup
            label="¿Posee bienes muebles registrables a su nombre o del grupo familiar? (camión / auto / moto)"
            name="bienes_muebles"
            required
            register={register}
            options={[
              {
                label: "Sí",
                value: "si",
              },
              {
                label: "No",
                value: "no",
              },
            ]}
          />

          <SectionTitle
            title="Selección de Turno"
            description="Elegí el día y horario de tu preferencia."
          />

          <TurnoSelector
            onSelect={(turno) => {
              setTurnoSeleccionado(turno);
              setValue("fecha", turno.fecha, { shouldValidate: false });
              setValue("hora", turno.hora, { shouldValidate: false });
            }}
            selected={turnoSeleccionado}
            error={turnoError}
          />

          {/* DECLARACION */}
          <div className="mt-16 border border-blue/20 bg-blue/3 rounded-3xl p-6 md:p-10">
            <h3 className="text-2xl font-bold text-black mb-6">
              Requisitos y Declaración
            </h3>

            <div className="space-y-4 text-gray leading-relaxed">
              <p>
                La presente solicitud de reunión no implica inscripción al
                listado de potenciales adjudicatarios.
              </p>

              <p>
                El solicitante deberá presentarse con la documentación que
                acredite lo declarado en el presente formulario.
              </p>

              <p>
                Presentarse en el lugar y horario asignado con toda la
                documentación correspondiente.
              </p>
            </div>

            <label className="flex items-start gap-4 mt-8 cursor-pointer">
              <input
                type="checkbox"
                {...register("confirmacion", {
                  setValueAs: (v) => v === true || v === "true",
                })}
                className="mt-1 w-5 h-5 accent-blue"
              />

              <span className="text-black leading-relaxed">
                Declaro conocer los requisitos y presentar la documentación
                respaldatoria correspondiente.
              </span>
            </label>
            {errors.confirmacion && (
              <span className="text-sm text-red-500 mt-2 block">
                Debe aceptar la declaración para continuar.
              </span>
            )}
          </div>

          {/* SUBMIT */}
          <div className="mt-12 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue text-white px-10 py-5 rounded-2xl text-sm md:text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:opacity-90 active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? "Enviando solicitud..." : "Solicitar reunión"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
