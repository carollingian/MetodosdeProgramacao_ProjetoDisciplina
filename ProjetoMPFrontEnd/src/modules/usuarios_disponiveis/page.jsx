import React, { useState, useEffect } from 'react';
import axios from 'axios';
import boy from '../../assets/boy.png';

/**
 * Componente Painel.
 * Um componente que exibe um painel com uma lista de usuários paginada.
 * @returns {JSX.Element} Retorna o componente Painel.
 */

export default function Painel() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 5;
  const totalPages = Math.ceil(users.length / usersPerPage);

  useEffect(() => {
    /**
     * Função assíncrona para buscar os usuários da API.
     */
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/Usuarios/lista-usuarios');
        setUsers(response.data);
      } catch (error) {
        // console.error(error);
      }
    };

    fetchUsers();
  }, []);

  /**
   * Manipula o clique no botão "Próximo".
   */
  const handleClickNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  /**
   * Manipula o clique no botão "Anterior".
   */
  const handleClickPrevious = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="relative mt-16 h-auto lg:mt-1">
            <img
              className="relative mt-16 h-auto lg:mt-1 flex items-center justify-center"
              src={boy}
              alt="Boy"
              width={850}
              height={1500}
            />
          </div>
          <form className="m-10">
            <div className="space-y-12">
              <div className="border-b border-gray-900/10">
                <h2 className="text-base font-semibold leading-7 text-white">Lista de usuários</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Aqui você pode ver todos os usuários disponíveis para dar match.
                </p>
              </div>
              <div>
                <table className="min-w-full divide-y divide-[#4eaaff]">
                  <thead className="bg-[#4e43ac]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                        Nome de usuário
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#4e43ac] divide-y divide-[#4eaaff]">
                    {currentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{user.username}</td>
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
