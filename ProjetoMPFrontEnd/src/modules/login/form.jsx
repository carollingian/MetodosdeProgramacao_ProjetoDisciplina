import React, { useState } from 'react';
import axios from 'axios';
import logo from '../../assets/atlax.png';
import ann from '../../assets/ann.png';

const serverUrl = 'http://localhost:8000/';

/**
 * Componente Login.
 * Um componente que exibe um formulário de login.
 * @returns {JSX.Element} Retorna o componente Login.
 */

export default function Login() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [senhaError, setSenhaError] = useState('');

  /**
  * Manipula a alteração do campo de entrada "username".
  * @param {Event} event - O evento de alteração do campo "username".
  */

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  /**
  * Manipula a alteração do campo de entrada "senha".
  * @param {Event} event - O evento de alteração do campo "senha".
  */

  const handleSenhaChange = (event) => {
    setSenha(event.target.value);
  };

  /**
   * Valida os campos de entrada do formulário.
   * @returns {boolean} Retorna `true` se os campos forem válidos, caso contrário, retorna `false`.
   */

  const validateInputs = () => {
    let hasError = false;

    if (!username) {
      setUsernameError('O campo usuário é obrigatório.');
      hasError = true;
    } else if (!/^[a-zA-Z]+$/.test(username)) {
      setUsernameError('O campo usuário só pode conter letras.');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (!senha) {
      setSenhaError('O campo senha é obrigatório.');
      hasError = true;
    } else if (!/^\d+$/.test(senha)) {
      setSenhaError('A senha deve conter apenas números.');
      hasError = true;
    } else {
      setSenhaError('');
    }

    return !hasError;
  };

  /**
   * Efetua o login do usuário.
   */

  const loginUser = async () => {
    try {
      const passwordInt = parseInt(senha, 10);

      const response = await axios.post(`${serverUrl}Login/`, {
        username,
        senha: passwordInt,
      });

      if (response.status === 200) {
        localStorage.setItem('responseData', JSON.stringify(response.data));
        localStorage.setItem('username', username);
        window.location.reload(); // Recarrega a página para atualizar o estado de autenticação
      } else if (response.status === 403) {
        setSenhaError('Senha inválida');
      } else if (response.status === 422) {
        const errorMessage = response.data?.detail?.message || 'Usuário não encontrado';
        setUsernameError(errorMessage);
      } else {
        setUsernameError('Ocorreu um erro');
      }
      if (response.status === 200) {
        localStorage.setItem('responseData', JSON.stringify(response.data));
        const userData = {
          username,
          senha: passwordInt,
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        window.location.reload(); // Recarrega a página para atualizar o estado de autenticação
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setUsernameError(error.response.data.detail.message || 'Ocorreu um erro');
      } else {
        setUsernameError('Ocorreu um erro');
      }
    }
  };

  /**
   * Manipula o envio do formulário.
   * @param {Event} event - O evento de envio do formulário.
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      await loginUser();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        const errorMessage = error.response.data.detail.message || 'Ocorreu um erro';
        setSenhaError(errorMessage);
      } else {
        setUsernameError('Ocorreu um erro');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="pl-80 relative mt-16 h-auto lg:mt-1 flex items-center justify-center">
        <img
          className="max-w-full max-h-full"
          src={ann}
          alt="App screenshot"
          width={600}
          height={1080}
        />
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-50 w-auto" src={logo} alt="Atlax Logo" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-[#53a9f6]">
                Usuário
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={handleUsernameChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-[#53a9f6]">
                  Senha
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={handleSenhaChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {senhaError && <p className="text-red-500 text-xs mt-1">{senhaError}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="mt-20 flex w-full justify-center rounded-md bg-[#4e42ac] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Entrar
              </button>
              <a
                href="/cadastro"
                type="link"
                className="my-2 flex w-full justify-center rounded-md bg-[#53a9f6] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Crie sua conta
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
