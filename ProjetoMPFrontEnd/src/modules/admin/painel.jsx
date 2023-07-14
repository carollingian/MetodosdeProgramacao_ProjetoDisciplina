import React, { useState, useEffect } from 'react';
import TagsInput from 'react-tagsinput';
import { saveAs } from 'file-saver';
import axios from 'axios';
import 'react-tagsinput/react-tagsinput.css';
import cat from '../../assets/cat.png';

/**
 * Componente Painel.
 * Um componente que exibe um painel de administração.
 * @returns {JSX.Element} Retorna o componente Painel.
 */

export default function Painel() {
  const [selected, setSelected] = useState([]);
  const [atualizaSucesso, setAtualizaSucesso] = useState('');
  const [atualizaError, setAtualizaError] = useState('');

  /**
   * Função para gerar o relatório.
   * Obtém os dados do localStorage, realiza uma requisição GET para obter o relatório
   * e faz o download do relatório como um arquivo de texto.
   */

  const gerarRelatorio = () => {
    const localStorageData = localStorage.getItem('responseData');
    const responseData = localStorageData ? JSON.parse(localStorageData) : null;
    const idUsuario = responseData?.id;
    const url = `http://localhost:8000/relatorio/${idUsuario}`;

    axios.get(url, { responseType: 'blob' }) // Define a responseType como 'blob'
      .then((response) => {
        const relatorioTxt = new Blob([response.data], { type: 'text/plain' });

        // Utiliza a função saveAs do file-saver para fazer o download
        saveAs(relatorioTxt, 'relatorio.txt');
      })
      .catch((error) => {
        setAtualizaError(error);
      });
  };

  useEffect(() => {
    /**
     * Função para obter as preferências.
     * Realiza uma requisição GET para obter a lista de preferências
     * e atualiza o estado "selected" com os dados recebidos.
     */
    axios
      .get('http://localhost:8000/Preferencias/lista-preferencias')
      .then((response) => {
        const preferencesData = response.data || [];
        setSelected(preferencesData);
      })
      .catch((error) => {
        setAtualizaError(error);
      });
  }, []);

  /**
   * Função para salvar as preferências.
   * Realiza uma requisição PUT para atualizar as preferências com os valores selecionados.
   */

  const handleSavePreferences = () => {
    axios
      .put('http://localhost:8000/Preferencias/atualiza-preferencias', { preferencias: selected })
      .then((response) => {
        setAtualizaSucesso(response.data); // Resposta da API em caso de sucesso
      })
      .catch((error) => {
        setAtualizaError(error); // Trata qualquer erro de requisição
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="relative mt-16 h-auto lg:mt-1">
            <img
              className="relative mt-16 h-auto lg:mt-1 flex items-center justify-center"
              src={cat}
              alt="Boy"
              width={550}
              height={1080}
            />
          </div>
          <form className="m-10">
            <div className="space-y-12">
              <div className="border-b border-gray-900/10">
                <h2 className="text-base font-semibold leading-7 text-white">Painel de administração</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Aqui o administrador pode escolher as preferências
                  que estarão disponíveis para os usuários
                  darem match e gerar o relatório.
                </p>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <div className="mt-2 flex items-center">
                      <div>
                        <h1 className="py-3 block text-sm font-medium leading-6 text-white">Adicione ou remova preferências</h1>
                        <TagsInput value={selected} onChange={setSelected} />
                        <em className="text-white">Pressione Enter para adicionar uma nova preferência</em>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-x-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSavePreferences}
                      >
                        Salvar
                      </button>
                    </div>
                    {atualizaError && <p className="text-red-500 text-xs mt-1">{atualizaError}</p>}
                    {atualizaSucesso && <p className="text-green-500 text-xs mt-1">{atualizaSucesso}</p>}
                  </div>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label htmlFor="relatorio" className="block text-sm font-medium leading-6 text-white">
                      Gerar relatório
                    </label>
                    <div className="mt-2 flex items-center gap-x-3">
                      <button
                        type="button"
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={gerarRelatorio}
                      >
                        Clique aqui
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
