// components/TurnoSelector.tsx
"use client";

import { useEffect, useState } from "react";

type Dia = {
  fecha: string;
  label: string;
  horarios: string[];
};

type TurnoSelectorProps = {
  onSelect: (turno: { fecha: string; hora: string }) => void;
  selected: { fecha: string; hora: string } | null;
  error?: string;
};

export default function TurnoSelector({
  onSelect,
  selected,
  error,
}: TurnoSelectorProps) {
  const [dias, setDias] = useState<Dia[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState<Dia | null>(null);

  useEffect(() => {
    fetch("/api/turnos/disponibles")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setDias(data.dias);
        else setFetchError("No se pudieron cargar los turnos disponibles.");
      })
      .catch(() => setFetchError("Error al conectar con el servidor."))
      .finally(() => setLoading(false));
  }, []);

  function seleccionarDia(dia: Dia) {
    // Si cambia el día, resetear la hora en el padre
    if (diaSeleccionado?.fecha !== dia.fecha) {
      onSelect({ fecha: dia.fecha, hora: "" });
    }
    setDiaSeleccionado(dia);
  }

  function seleccionarHora(hora: string) {
    if (!diaSeleccionado) return;
    onSelect({ fecha: diaSeleccionado.fecha, hora });
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray text-sm py-6">
        <span className="w-4 h-4 border-2 border-blue border-t-transparent rounded-full animate-spin" />
        Cargando turnos disponibles...
      </div>
    );
  }

  if (fetchError) {
    return <p className="text-sm text-red-500 py-4">{fetchError}</p>;
  }

  if (dias.length === 0) {
    return (
      <p className="text-sm text-gray py-4">
        No hay turnos disponibles en los próximos días. Comuníquese con la
        municipalidad.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Paso 1 — Elegir día */}
      <div>
        <p className="text-sm font-medium text-black mb-3">Seleccioná un día</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dias.map((dia) => {
            const activo = diaSeleccionado?.fecha === dia.fecha;
            return (
              <button
                key={dia.fecha}
                type="button"
                onClick={() => seleccionarDia(dia)}
                className={`
                  flex items-center justify-between
                  border rounded-xl px-5 py-4
                  text-left text-sm transition-all duration-200
                  ${
                    activo
                      ? "border-blue bg-blue/5 text-blue font-medium"
                      : "border-gray text-black hover:border-black hover:bg-black/2"
                  }
                `}
              >
                <span className="capitalize">{dia.label}</span>
                <span
                  className={`text-xs ${activo ? "text-blue" : "text-gray"}`}
                >
                  {dia.horarios.length} turno
                  {dia.horarios.length !== 1 ? "s" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Paso 2 — Elegir horario (aparece al seleccionar día) */}
      {diaSeleccionado && (
        <div>
          <p className="text-sm font-medium text-black mb-3">
            Seleccioná un horario
          </p>

          <div className="flex flex-wrap gap-3">
            {diaSeleccionado.horarios.map((hora) => {
              const activo =
                selected?.fecha === diaSeleccionado.fecha &&
                selected?.hora === hora;
              return (
                <button
                  key={hora}
                  type="button"
                  onClick={() => seleccionarHora(hora)}
                  className={`
                    border rounded-xl px-5 py-3
                    text-sm font-medium transition-all duration-200
                    ${
                      activo
                        ? "border-blue bg-blue text-white"
                        : "border-gray text-black hover:border-black hover:bg-black/2"
                    }
                  `}
                >
                  {hora} hs
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmación del turno elegido */}
      {selected?.fecha && selected?.hora && (
        <div className="flex items-center gap-3 bg-blue/5 border border-blue/20 rounded-xl px-5 py-4 text-sm text-blue font-medium">
          <span>✓</span>
          <span>
            Turno seleccionado: <strong>{selected.fecha}</strong> a las{" "}
            <strong>{selected.hora} hs</strong>
          </span>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
