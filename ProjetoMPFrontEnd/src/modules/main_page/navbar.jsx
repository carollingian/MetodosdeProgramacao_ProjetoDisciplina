import React from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { XIcon, MenuIcon } from '@heroicons/react/solid';
import { IoLogOutSharp, IoPersonSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import logo from '../../assets/atlax.png';

/**
 * Array de objetos de navegação.
 * Cada objeto representa um item de navegação na barra de navegação.
 * @type {Array<{name: string, href: string, current: boolean}>}
 */

const navigation = [
  { name: 'Meus matches', href: '/meus', current: false },
  { name: 'Grupos match', href: '/gruposmatch', current: false },
  { name: 'Usuários disponíveis', href: '/usuarios', current: false },
  { name: 'Grupos disponíveis', href: '/grupos', current: false },
  { name: 'Chat', href: '/chat', current: false },
];

/**
 * Função para combinar classes CSS.
 * @param {...string} classes - As classes CSS a serem combinadas.
 * @returns {string} Retorna a string de classes CSS combinadas.
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Hook useAdmin.
 * Um hook personalizado que verifica se o usuário é um administrador.
 * @returns {boolean} Retorna `true` se o usuário for um administrador, caso contrário, retorna `false`.
 */
const useAdmin = () => {
  const responseData = JSON.parse(localStorage.getItem('responseData'));
  return responseData && responseData.admin === 1;
};

/**
 * Componente Navbar.
 * Um componente que exibe a barra de navegação.
 * @returns {JSX.Element} Retorna o componente Navbar.
 */
function Navbar() {
  /**
   * Manipula o logout do usuário.
   */
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const isAdmin = useAdmin();

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Abrir menu principal</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/">
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src={logo}
                      alt="Atlax"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src={logo}
                      alt="Atlax"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Abra o menu de usuário</span>
                      <IoPersonSharp className="w-6 h-6" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/Perfil"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Seu perfil
                          </a>
                        )}
                      </Menu.Item>
                      {isAdmin && (
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/admin"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Configurações
                            </a>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/preferencias"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Preferências
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button
                  type="button"
                  className="text-gray-400 p-2 hover:text-white focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={handleLogout}
                >
                  <span className="sr-only">Sair</span>
                  <IoLogOutSharp className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;
