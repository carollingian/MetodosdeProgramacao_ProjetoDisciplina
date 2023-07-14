import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Login from '../login/form.jsx';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login module', () => {
  test('Deve mostrar mensagens de erro para entradas inválidas obrigatórias', async () => {
    render(<Login />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('O campo usuário é obrigatório.')).toBeInTheDocument();
      expect(screen.getByText('O campo senha é obrigatório.')).toBeInTheDocument();
    });
  });

  test('Deve retornar mensagens de erro para usuários e senhas inválidas', async () => {
    axios.post.mockRejectedValueOnce({ response: { status: 403 } });

    render(<Login />);
    
    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('O campo usuário só pode conter letras.')).toBeInTheDocument();
      expect(screen.getByText('A senha deve conter apenas números.')).toBeInTheDocument();
    });
  });

  test('Página deve recarregar se o login for concluído com sucesso', async () => {
    // Simula a função reload() do window.location
    const reloadMock = jest.fn();
    const windowLocationOriginal = window.location;
    delete window.location;
    window.location = { reload: reloadMock };
  
    axios.post.mockResolvedValueOnce({ status: 200 });
  
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'username' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
  
    await waitFor(() => {
      expect(reloadMock).toHaveBeenCalled();
    });
  
    // Restaura o objeto window.location original
    window.location = windowLocationOriginal;
  });  
});
