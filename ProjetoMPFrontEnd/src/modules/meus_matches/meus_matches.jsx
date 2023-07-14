import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import blue from '../../assets/blue.png';

export default function Meus() {
  const [data, setData] = useState(null);
  const userData = JSON.parse(localStorage.getItem('responseData'));

  const getMatchs = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/Match/lista-match-usuarios-por-usuario/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao obter os Matchs');
      }
      const responseData = await response.json();
      setData(responseData);
      console.log(data);
    } catch (error) {
      console.error('Erro ao obter os Matchs:', error);
    }
  };

  const getIdAmigo = async (nome) => {
    try {
      const response = await fetch(`http://localhost:8000/Usuarios/lista-usuario-por-username/${nome}`);
      if (!response.ok) {
        throw new Error('Erro ao obter os Matchs');
      }
      const flor = await response.json();
      return flor;
    } catch (error) {
      console.error('Erro ao obter os Matchs:', error);
      throw error;
    }
  };

  const handleAddFriend = async (zeta) => {
    const amizade = await getIdAmigo(zeta);
    const userId = amizade.id;
    if (userData) {
      const updatedUserData = { ...userData };
      if (updatedUserData.amigos) {
        if (!updatedUserData.amigos.includes(userId)) {
          updatedUserData.amigos.push(userId);
          localStorage.setItem('responseData', JSON.stringify(updatedUserData));
          toast.success('Amigo adicionado com sucesso!');
        } else {
          updatedUserData.amigos = updatedUserData.amigos.filter((amigo) => amigo !== userId);
          localStorage.setItem('responseData', JSON.stringify(updatedUserData));
          toast.success('Amigo removido com sucesso!');
        }

        try {
          const response = await fetch(`http://localhost:8000/Usuarios/update/${userData.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amigos: updatedUserData.amigos }),
          });
          if (!response.ok) {
            throw new Error('Erro ao atualizar os amigos do usuário');
          }
          console.log('Amigos do usuário atualizados com sucesso!');
        } catch (error) {
          console.error('Erro ao atualizar os amigos do usuário:', error);
        }
      } else {
        updatedUserData.amigos = [userId];
        localStorage.setItem('responseData', JSON.stringify(updatedUserData));
        toast.success('Amigo adicionado com sucesso!');

        try {
          const response = await fetch(`http://localhost:8000/Usuarios/update/${userData.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amigos: updatedUserData.amigos }),
          });
          if (!response.ok) {
            throw new Error('Erro ao atualizar os amigos do usuário');
          }
          console.log('Amigos do usuário atualizados com sucesso!');
        } catch (error) {
          console.error('Erro ao atualizar os amigos do usuário:', error);
        }
      }
    } else {
      console.log('Usuário não encontrado.');
    }
  };

  useEffect(() => {
    console.log(handleAddFriend);
    const getStoredId = () => {
      const storedData = localStorage.getItem('responseData');
      if (storedData) {
        const { id } = JSON.parse(storedData);
        return id;
      }
      return null;
    };

    const IdUsuarioBase = getStoredId(); // Retrieve the stored id
    getMatchs(IdUsuarioBase); // Call getMatchs with the id
  }, []);
  //  const Adicionou = (rtx) => {
  //  console.log(rtx);
  //  console.log(handleAddFriend);
  //  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <h2 className="mb-8 mt-4 py-3 bg-white rounded-md px-3 text-gray-800 text-center font-extrabold text-2xl">MATCHES</h2>
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="relative mt-16 h-auto lg:mt-1 py-5">
            <img
              className="relative mt-16 h-auto lg:mt-1 flex items-center justify-center"
              src={blue}
              alt="Boy"
              width={350}
              height={1500}
            />
          </div>
          <div className="mt-10 mb-9 flex items-center justify-center lg:justify-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data !== null && Object.entries(data).map(([key, value]) => (
                <div key={key} className="bg-gray-800 rounded-md p-6 flex flex-col items-center justify-center text-white">
                  <h3 className="text-lg font-semibold mb-4">{key}</h3>
                  <p className="text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
