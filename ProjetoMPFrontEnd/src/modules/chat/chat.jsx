import React, { useEffect, useState } from 'react';
import axios from 'axios';
import group from '../../assets/etrianod.png';

function Chat() {
  const [amigos, setAmigos] = useState([]);
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagens, setMensagens] = useState([]);
  const userData = JSON.parse(localStorage.getItem('responseData'));
  const [msg, setInputValue] = useState('');
  const [amigoSelecionado, setAmigoSelecionado] = useState('');

  const handleChange = (event) => { setInputValue(event.target.value); }; // Atualiza o valor do input conforme o usuário digita

  const getFriendName = async (friendId) => {
    try {
      const response = await axios.get(`http://localhost:8000/Usuarios/lista-usuario-por-id/${friendId}`);
      const friend = response.data;
      return friend.username; // Use a propriedade correta que contém o nome do amigo
    } catch (error) {
      console.log(`Erro ao buscar o amigo com ID ${friendId}: ${error}`);
      return '';
    }
  };

  const getUserIdByUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8000/Usuarios/lista-usuario-por-username/${username}`);
      const user = response.data;
      return user.id; // Use a propriedade correta que contém o ID do usuário
    } catch (error) {
      console.log(`Erro ao buscar o ID do usuário com username ${username}: ${error}`);
      return '';
    }
  };

  const handleFriendClick = async (username) => {
    console.log(username);
    setAmigoSelecionado(username);
    try {
      const friendId = await getUserIdByUsername(username);
      // Buscar mensagens
      const response = await axios.get(`http://localhost:8000/ChatPrivado/buscar-mensagens/${userData.id}/${friendId}`);
      const resposta = response.data; // Supondo que a resposta seja um array de mensagens
      console.log(resposta);
      setMensagens(resposta);
      // Abrir o chat
      console.log(setMensagens);
      setChatAberto(true);
      console.log(chatAberto);
    } catch (error) {
      console.log(`Erro ao abrir o chat com o amigo ${username}: ${error}`);
    }
  };

  const enviarMensagem = async (mensagem) => {
    try {
      console.log(`Mensagem para ${amigoSelecionado}: ${mensagem}`);
      const novoAmigo = await getUserIdByUsername(amigoSelecionado);
      console.log(novoAmigo);
      // Enviar mensagem
      await axios.post(`http://localhost:8000/ChatPrivado/enviar-mensagem/${userData.id}/${novoAmigo}`, {
        mensagem,
      });
      window.location.reload();
      // Atualizar as mensagens exibidas
      // Você pode fazer uma nova chamada à API para buscar as mensagens atualizadas ou atualizar o estado localmente
    } catch (error) {
      console.log(`Erro ao enviar mensagem: ${error}`);
    }
  };

  useEffect(() => {
    const fetchAmigos = async () => {
      if (userData && userData.amigos) {
        const friendsArray = userData.amigos;
        const formattedFriends = await Promise.all(friendsArray.map((friendId) => getFriendName(friendId)));
        setAmigos(formattedFriends);
      }
    };

    fetchAmigos();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="relative mt-16 h-auto lg:mt-1 py-5">
            <div className="mb-4 text-white text-2xl font-bold bg-gradient-to-r from-[#4e43ac] to-[#53a9f6] rounded-lg p-4">
              <div>
                <div className="relative mt-16 h-auto lg:mt-1">
                  <img
                    className="relative mt-16 h-auto lg:mt-1 flex items-center justify-center"
                    src={group}
                    alt="Boy"
                    width={200}
                    height={1500}
                  />
                </div>
                <h2 className="mb-8 mt-4 py-3 bg-white rounded-md px-3 text-gray-800">Meus amigos</h2>
                <ul>
                  {amigos.map((amigo) => (
                    <li key={amigo} className="mb-2">
                      <button
                        className="text-white bg-gray-800 hover:bg-blue-600 rounded-md py-2 px-4 focus:outline-none"
                        type="button"
                        onClick={() => handleFriendClick(amigo)}
                      >
                        {amigo}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {chatAberto && (
            <div className="relative mt-16 h-auto lg:mt-1 py-5 ">
              <div>
                <ul className="text-white">
                  {mensagens.map((mensagem) => (
                    <li className="bg-[#53a9f6] rounded-md px-3 py-2 mb-2 text-white" key={mensagem.id}>{mensagem.mensagem}</li>
                  ))}
                </ul>
                <div className="flex mt-2">
                  <input
                    className="mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    type="text"
                    placeholder="Digite sua mensagem"
                    value={msg}
                    onChange={handleChange}
                  />
                  <button
                    className="px-4 py-2 text-white bg-[#4e43ac] rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    type="button"
                    onClick={() => enviarMensagem(msg)}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
