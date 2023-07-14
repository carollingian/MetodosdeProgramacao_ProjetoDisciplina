import React from 'react';

/**
 * Componente Footer.
 * Um componente que exibe o footer.
 * @returns {JSX.Element} Retorna o componente Footer.
 */

export default function Footer() {
  return (
    <footer className="bg-[#4e43ac] text-white py-5">
      <div className="container mx-auto text-center" style={{ height: '30px' }}>
        <p>
          <span>&copy;</span>
          <span>{new Date().getFullYear()}</span>
          <span> Atlax</span>
        </p>
      </div>
    </footer>
  );
}
