import React, { useState, useEffect } from 'react';
import axios from 'axios';
import equipe from '../../assets/equipe.png';

/**
 * Componente Painel.
 * Um componente que exibe uma lista de grupos.
 * @returns {JSX.Element} Retorna o componente Painel.
 */

export default function Painel() {
  const [groups, setGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const groupsPerPage = 3;
  const totalPages = Math.ceil(Object.keys(groups).length / groupsPerPage);

  useEffect(() => {
    /**
     * Função para buscar os grupos.
     * Realiza uma requisição GET para obter a lista de grupos e atualiza o estado "groups" com os dados recebidos.
     */
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:8000/Grupos/lista-grupos');
        setGroups(response.data);
      } catch (error) {
        // console.error(error);
      }
    };

    fetchGroups();
  }, []);

  /**
   * Função para lidar com o clique no botão "Próximo".
   * Atualiza o estado "currentPage" para exibir a próxima página de grupos.
   */

  const handleClickNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  /**
   * Função para lidar com o clique no botão "Anterior".
   * Atualiza o estado "currentPage" para exibir a página anterior de grupos.
   */

  const handleClickPrevious = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = Object.entries(groups).slice(indexOfFirstGroup, indexOfLastGroup);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="relative mt-16 h-auto lg:mt-1">
            <img
              className="relative mt-16 h-auto lg:mt-1 flex items-center justify-center"
              src={equipe}
              alt="Boy"
              width={500}
              height={1080}
            />
          </div>
          <form className="m-10">
            <div className="space-y-12">
              <div className="border-b border-gray-900/10">
                <h2 className="text-base font-semibold leading-7 text-white">Lista de grupos</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Aqui você pode ver todos os grupos disponíveis.
                </p>
              </div>
              <div>
                <table className="min-w-full divide-y divide-[#4eaaff] rounded-md">
                  <thead className="bg-[#4e43ac]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Nome do grupo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#4e43ac] divide-y divide-[#4eaaff]">
                    {currentGroups.map((group) => (
                      <tr key={group[0]}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{group[1].id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{group[1].nome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-center mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-200 bg-[#4e43ac] border border-gray-300 rounded-md shadow-sm"
                disabled={currentPage === 1}
                onClick={handleClickPrevious}
              >
                Anterior
              </button>
              <button
                type="button"
                className="ml-2 px-4 py-2 text-sm font-medium text-gray-200 bg-[#4e43ac] border border-gray-300 rounded-md shadow-sm"
                disabled={currentPage === totalPages}
                onClick={handleClickNext}
              >
                Próxima
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <a
                type="link"
                href="/"
                className="rounded-md bg-[#4e42ac] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Voltar
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
