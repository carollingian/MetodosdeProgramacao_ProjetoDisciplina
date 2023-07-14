import React from 'react';
import waifu from '../../assets/girl.png';

/**
 * Componente ContentSection.
 * Um componente que exibe o conteúdo da páginal principal.
 * @returns {JSX.Element} Retorna o componente ContentSection.
 */

export default function ContentSection() {
  return (
    <div className="bg-black">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#4eaaff" />
                <stop offset={1} stopColor="#4e43ac" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Encontre pessoas para compartilhar gostos em comum!
              <br />
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Aqui, você tem a oportunidade de explorar diferentes categorias de Match
              e conectar-se com pessoas que compartilham seus interesses, sejam eles
              séries, livros ou até mesmo WAIFUS.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="/matches"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Encontrar pessoas
              </a>
              <a
                href="/buscargrupos"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Encontrar grupos
              </a>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-1">
            <img
              className="absolute left-10 right-10 top-10 w-[30rem] max-w-none"
              src={waifu}
              alt="App screenshot"
              width={1824}
              height={1080}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
