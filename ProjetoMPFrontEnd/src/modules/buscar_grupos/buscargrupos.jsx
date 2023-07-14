import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import persona from '../../assets/persona.png';

export default function EncontrarGrupos() {
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [resultados, setResultados] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/Grupos/lista-grupos');
        const data = await response.json();
        setResultados(data);
      } catch (error) {
        console.error('Erro ao obter a lista de grupos:', error);
      }
    };

    fetchData();

    const storedUserData = localStorage.getItem('responseData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handlePesquisa = () => {
    if (termoPesquisa.trim() === '') {
      setResultados([]);
      return;
    }
    const resultadosPesquisa = resultados.filter((grupo) => grupo.nome.toLowerCase().includes(termoPesquisa.toLowerCase()));
    setResultados(resultadosPesquisa);
  };

  const handleInputChange = (event) => {
    setTermoPesquisa(event.target.value);
  };

  const handleSearch = () => {
    handlePesquisa();
  };

  const handleJoinGroup = async (groupName) => {
    if (userData) {
      try {
        const response = await fetch(`http://localhost:8000/Grupos/att-grupo/add-membro/${groupName}/${userData.username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          }),
        });

        if (response.ok) {
          toast.success(`Entrou no grupo ${groupName} com sucesso!`);
        } else {
          toast.error('Erro ao entrar no grupo. Tente novamente mais tarde.');
        }
      } catch (error) {
        console.error('Erro ao entrar no grupo:', error);
        toast.error('Erro ao entrar no grupo. Tente novamente mais tarde.');
      }
    } else {
      console.log('Usuário não encontrado.');
    }
  };

  const handleLeaveGroup = async (groupName) => {
    if (userData) {
      try {
        const response = await fetch(`http://localhost:8000/Grupos/att-grupo/del-membro/${groupName}/${userData.username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          }),
        });

        if (response.ok) {
          toast.success(`Saiu do grupo ${groupName} com sucesso!`);
        } else {
          toast.error('Erro ao sair do grupo. Tente novamente mais tarde.');
        }
      } catch (error) {
        console.error('Erro ao sair do grupo:', error);
        toast.error('Erro ao sair do grupo. Tente novamente mais tarde.');
      }
    } else {
      console.log('Usuário não encontrado.');
    }
  };

  const handleSave = () => {
    // Lógica para salvar os dados
    // Exemplo: enviar resultados para a API de salvamento

    // Exibir uma mensagem de sucesso ao salvar
    toast.success('Dados salvos com sucesso!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="relative mt-16 h-auto lg:mt-1 py-5">
            <img
              className="relative mt-16 h-auto lg:mt-1 flex items-center justify-center"
              src={persona}
              alt="girl"
              width={1100}
              height={1500}
            />
          </div>
          <div className="container py-10 content">
            <div>
              <h2 className="mb-4 text-white text-2xl font-bold">Encontre grupos</h2>
              <div>
                <input
                  type="text"
                  value={termoPesquisa}
                  onChange={handleInputChange}
                  placeholder="Pesquisar grupos..."
                  className="px-4 py-2 rounded-l-md text-gray-800 focus:outline-none focus:ring focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-4 py-2 rounded-r-md bg-[#4e42ac] text-white font-bold hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
                >
                  Buscar
                </button>
              </div>
              {termoPesquisa && resultados.length > 0 ? (
                <ul>
                  {resultados.map((grupo) => (
                    <li className="flex items-center justify-between text-white py-2" key={grupo.id}>
                      {grupo.nome}
                      {grupo.membros.includes(userData?.username) ? (
                        <button
                          type="button"
                          onClick={() => handleLeaveGroup(grupo.nome)}
                          className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-400"
                        >
                          Sair
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleJoinGroup(grupo.nome)}
                          className="px-3 py-1 text-sm font-semibold text-white bg-[#53a9f6] rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400"
                        >
                          Entrar
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'white' }}>
                  {termoPesquisa ? 'Nenhum grupo encontrado.' : ''}
                </p>
              )}
              <button
                type="button"
                onClick={handleSave}
                className="mt-6 mr-2 px-3 py-1.5 text-sm font-semibold text-white bg-[#4e42ac] rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-6 px-3 py-1.5 text-sm font-semibold text-white bg-[#4e42ac] rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Voltar
              </button>
              <ToastContainer autoClose={3000} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
