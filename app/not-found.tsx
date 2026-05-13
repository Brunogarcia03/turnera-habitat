import React from "react";

function notFound() {
  return (
    <main className="bg-white min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-gray/20 rounded-4xl p-6 md:p-12 shadow-[0_4px_30px_rgba(132,138,140,0.4)]">
          <div className="py-8 px-4 mx-auto max-w-7xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                404
              </h1>
              <p className="mb-4 text-gray text-3xl tracking-tight font-bold md:text-4xl">
                Falta algo.
              </p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                Lo sentimos, no podemos encontrar esa página. Encontrarás mucho
                que explorar en la página de inicio.{" "}
              </p>
              <a
                href="/"
                className="inline-flex text-white bg-black hover:bg-gray focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
              >
                Volver a la página principal
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default notFound;
