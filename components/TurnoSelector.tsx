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

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const DIAS_CORTOS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

function formatFecha(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function labelFecha(d: Date): string {
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function isPast(d: Date): boolean {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return d <= hoy;
}

function esDiaHabil(d: Date): boolean {
  return d.getDay() !== 0 && d.getDay() !== 6;
}

export default function TurnoSelector({
  onSelect,
  selected,
  error,
}: TurnoSelectorProps) {
  const [dias, setDias] = useState<Dia[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Calendario
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const disponibleMap = new Map(dias.map((d) => [d.fecha, d.horarios]));

  const diasEnMes = new Date(calYear, calMonth + 1, 0).getDate();
  const primerDia = new Date(calYear, calMonth, 1).getDay();

  function prevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  }

  function handleDayClick(fecha: string) {
    if (!disponibleMap.has(fecha)) return;
    setSelectedDate(fecha);
    onSelect({ fecha, hora: "" });
  }

  function handleHoraClick(hora: string) {
    if (!selectedDate) return;
    onSelect({ fecha: selectedDate, hora });
  }

  const horasDelDia = selectedDate
    ? (disponibleMap.get(selectedDate) ?? [])
    : [];
  const manana = horasDelDia.filter((h) => parseInt(h) < 13);
  const tarde = horasDelDia.filter((h) => parseInt(h) >= 13);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray text-sm py-6">
        <span className="w-4 h-4 border-2 border-blue border-t-transparent rounded-full animate-spin" />
        Cargando turnos disponibles...
      </div>
    );
  }

  if (fetchError)
    return <p className="text-sm text-red-500 py-4">{fetchError}</p>;

  if (dias.length === 0) {
    return (
      <p className="text-sm text-gray py-4">
        No hay turnos disponibles en los próximos días. Comuníquese con la
        municipalidad.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Layout: calendario izquierda + horarios derecha */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* ── Calendario ── */}
        <div className="flex-1 border border-gray/20 rounded-2xl p-5">
          {/* Navegación mes */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Mes anterior"
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray/20 hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 6l-6 6l6 6" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-black">
              {MESES[calMonth]} {calYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Mes siguiente"
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray/20 hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6l-6 6" />
              </svg>
            </button>
          </div>

          {/* Grilla */}
          <div className="grid grid-cols-7 gap-1">
            {DIAS_CORTOS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-gray py-1"
              >
                {d}
              </div>
            ))}

            {/* Celdas vacías iniciales */}
            {Array.from({ length: primerDia }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Días del mes */}
            {Array.from({ length: diasEnMes }).map((_, i) => {
              const day = i + 1;
              const date = new Date(calYear, calMonth, day);
              const fecha = formatFecha(date);
              const esDisponible = disponibleMap.has(fecha);
              const esPasado = isPast(date);
              const esNoHabil = !esDiaHabil(date);
              const esSel = selectedDate === fecha;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={!esDisponible || esPasado || esNoHabil}
                  onClick={() => handleDayClick(fecha)}
                  className={[
                    "relative aspect-square flex items-center justify-center text-sm rounded-xl transition-all duration-150",
                    esSel
                      ? "bg-blue text-white font-semibold"
                      : esDisponible && !esPasado && !esNoHabil
                        ? "text-black hover:bg-blue/5 cursor-pointer"
                        : "text-gray/40 cursor-default",
                  ].join(" ")}
                >
                  {day}
                  {/* Punto indicador de disponibilidad */}
                  {esDisponible && !esPasado && !esNoHabil && !esSel && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="flex items-center gap-1.5 mt-4 text-xs text-gray">
            <span className="w-1.5 h-1.5 rounded-full bg-blue inline-block" />
            Días con turnos disponibles
          </div>
        </div>

        {/* ── Horarios ── */}
        <div className="flex-1 border border-gray/20 rounded-2xl p-5 flex flex-col">
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center flex-1 min-h-45 gap-3 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray/30"
                aria-hidden="true"
              >
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M12 7v5l3 3" />
              </svg>
              <p className="text-sm text-gray">
                Seleccioná un día
                <br />
                para ver los horarios
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-black capitalize">
                {labelFecha(
                  new Date(
                    parseInt(selectedDate.split("/")[2]),
                    parseInt(selectedDate.split("/")[1]) - 1,
                    parseInt(selectedDate.split("/")[0]),
                  ),
                )}
              </p>

              {/* Mañana */}
              {manana.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray mb-2">
                    Mañana
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {manana.map((hora) => (
                      <button
                        key={hora}
                        type="button"
                        onClick={() => handleHoraClick(hora)}
                        className={[
                          "py-2.5 rounded-xl text-sm border transition-all duration-150",
                          selected?.fecha === selectedDate &&
                          selected?.hora === hora
                            ? "bg-blue text-white border-blue font-semibold"
                            : "border-gray/20 text-black hover:border-gray/40 hover:bg-gray-50",
                        ].join(" ")}
                      >
                        {hora} hs
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tarde */}
              {tarde.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray mb-2">
                    Tarde
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {tarde.map((hora) => (
                      <button
                        key={hora}
                        type="button"
                        onClick={() => handleHoraClick(hora)}
                        className={[
                          "py-2.5 rounded-xl text-sm border transition-all duration-150",
                          selected?.fecha === selectedDate &&
                          selected?.hora === hora
                            ? "bg-blue text-white border-blue font-semibold"
                            : "border-gray/20 text-black hover:border-gray/40 hover:bg-gray-50",
                        ].join(" ")}
                      >
                        {hora} hs
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Turno confirmado */}
      {selected?.fecha && selected?.hora && (
        <div className="flex items-center gap-3 bg-blue/5 border border-blue/20 rounded-2xl px-5 py-4 text-sm text-blue font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M9 12l2 2l4 -4" />
          </svg>
          Turno seleccionado: {selected.fecha} a las {selected.hora} hs
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
