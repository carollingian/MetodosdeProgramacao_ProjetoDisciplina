import React, { useState } from 'react';
import axios from 'axios';
import logo from '../../assets/atlax.png';
import dance from '../../assets/dancing.png';

/**
 * Componente Senha.
 * Um componente que permite ao usuário atualizar sua senha.
 * @returns {JSX.Element} Retorna o componente Senha.
 */

export default function Senha() {
  const [id, setId] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [idError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [senhaSucesso, setSenhaSucesso] = useState('');

  /**
   * Manipula o envio do formulário.
   * @param {Event} e - O evento de envio do formulário.
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(senhaAtual)) {
      setSenhaError('A senha atual deve ser composta apenas por números');
      return;
    }

    if (!/^\d+$/.test(novaSenha)) {
      setSenhaError('A nova senha deve ser composta apenas por números');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/Usuarios/update/${id}`, {
        senha: novaSenha,
      });

      setSenhaSucesso('Senha atualizada com sucesso');
    } catch (error) {
      setSenhaError('Erro ao atualizar senha');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="relative mt-16 h-auto lg:mt-1 flex justify-end">
        <div className="pl-80 max-w-full max-h-full">
          <img
            className="block mx-auto"
            src={dance}
            alt="App screenshot"
            width={500}
            height={1080}
          />
        </div>
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-50 w-auto" src={logo} alt="Atlax Logo" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-[#53a9f6]">
            Altere sua senha aqui
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="id" className="block text-sm font-medium leading-6 text-[#53a9f6]">
                Id de usuário
              </label>
              <div className="mt-2">
                <input
                  id="id"
                  name="id"
                  type="number"
                  autoComplete="off"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Digite o número de ID do seu usuário"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="senhaAtual" className="block text-sm font-medium leading-6 text-[#53a9f6]">
                  Senha atual
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="senhaAtual"
                  name="senhaAtual"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="novaSenha" className="block text-sm font-medium leading-6 text-[#53a9f6]">
                  Nova senha
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {senhaError && <p className="text-red-500 text-xs mt-1">{senhaError}</p>}
              {senhaSucesso && <p className="text-green-500 text-xs mt-1">{senhaSucesso}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#53a9f6] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Alterar senha
              </button>
              <a
                href="/perfil"
                type="link"
                className="my-2 flex w-full justify-center rounded-md bg-[#b30000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
