// components/Confirmacion.tsx
"use client";

type ConfirmacionProps = {
  turno: { fecha: string; hora: string };
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  localidad: string;
};

export default function Confirmacion({
  turno,
  nombre,
  apellido,
  dni,
  telefono,
  localidad,
}: ConfirmacionProps) {
  const handlePrint = () => window.print();

  return (
    <main className="bg-white min-h-screen py-20 px-6">
      <div className="max-w-xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray mb-2">
            Municipalidad de Alberti
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-black">
              Solicitud registrada
            </h1>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E1F5EE] text-[#085041]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
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
              Confirmado
            </span>
          </div>
        </div>

        <div
          className="
            bg-white border border-gray/20 rounded-4xl
            p-6 md:p-10
            shadow-[0_4px_30px_rgba(0,0,0,0.03)]
            print:shadow-none print:border-gray/10
          "
        >
          {/* Turno */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-5 mb-8 border border-gray/10">
            <div className="w-11 h-11 rounded-xl bg-[#E6F1FB] flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#185FA5"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M4 11h16" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray mb-0.5">Tu turno asignado</p>
              <p className="text-lg font-bold text-black leading-tight">
                {turno.fecha} · {turno.hora} hs
              </p>
            </div>
          </div>

          {/* Datos */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray mb-3">
            Datos del solicitante
          </p>
          <div className="divide-y divide-gray/10">
            {[
              { label: "Nombre completo", value: `${nombre} ${apellido}` },
              { label: "DNI", value: dni },
              { label: "Teléfono", value: telefono },
              { label: "Localidad", value: localidad },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-baseline py-3 text-sm"
              >
                <span className="text-gray">{label}</span>
                <span className="font-medium text-black">{value}</span>
              </div>
            ))}
          </div>

          {/* Aviso */}
          <div className="mt-6 bg-[#FAEEDA] rounded-2xl px-5 py-4">
            <p className="text-sm text-[#633806] leading-relaxed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="inline-block mr-1.5 -mt-0.5"
                aria-hidden="true"
              >
                <path d="M12 9v4" />
                <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z" />
                <path d="M12 16h.01" />
              </svg>
              Presentate con la documentación que acredite lo declarado. Lugar:
              Municipalidad de Alberti, Secretaría de Hábitat.
            </p>
          </div>

          {/* Acciones */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handlePrint}
              className="
                flex items-center gap-2
                border border-gray/30 rounded-2xl
                px-6 py-3 text-sm font-semibold text-black
                transition-all duration-200
                hover:bg-gray-50 hover:border-gray/50
                active:scale-[0.98]
                print:hidden
              "
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
                <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
              </svg>
              Imprimir comprobante
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
