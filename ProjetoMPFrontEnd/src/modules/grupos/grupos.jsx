import React, { useEffect, useState } from 'react';
import blue from '../../assets/blue.png';

export default function Grupos() {
  const [data, setData] = useState(null);
  const getMatchs = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/Match/lista-match-grupo-por-usuario/${id}`);
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

  useEffect(() => {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <h2 className="py-3 text-center text-lg font-bold text-white">MATCHES</h2>
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
