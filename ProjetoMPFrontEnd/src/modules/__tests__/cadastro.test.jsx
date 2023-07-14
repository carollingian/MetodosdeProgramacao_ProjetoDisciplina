import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Cadastro from '../cadastro/form.jsx';

jest.mock('axios');

describe('Cadastro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Exibe mensagem de conta criada com sucesso ao enviar o formulário', async () => {
    const mockedPost = axios.post.mockResolvedValueOnce({ status: 201 });

    render(<Cadastro />);

    const usernameInput = screen.getByLabelText('Usuário');
    const senhaInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Criar conta');

    fireEvent.change(usernameInput, { target: { value: 'john' } });
    fireEvent.change(senhaInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);

    expect(mockedPost).toHaveBeenCalledWith('http://localhost:8000/Usuarios/criar-usuario', {
      username: 'john',
      senha: 123456,
      id: 0,
      admin: 0,
      preferencias: [0],
      amigos: [0],
      bloqueados: [0],
      grupos: [0],
    });

    const successMessage = await screen.findByText('Conta criada com sucesso!');
    expect(successMessage).toBeInTheDocument();
  });

  test('Exibe erro ao enviar o formulário com campo de usuário vazio', async () => {
    render(<Cadastro />);

    const senhaInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Criar conta');

    fireEvent.change(senhaInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText('O campo usuário é obrigatório.');
    expect(errorMessage).toBeInTheDocument();
  });

  test('Exibe erro ao enviar o formulário com campo de senha vazio', async () => {
    render(<Cadastro />);

    const usernameInput = screen.getByLabelText('Usuário');
    const submitButton = screen.getByText('Criar conta');

    fireEvent.change(usernameInput, { target: { value: 'john' } });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText('O campo senha é obrigatório.');
    expect(errorMessage).toBeInTheDocument();
  });

  test('Exibe erro ao enviar o formulário com campo de usuário contendo caracteres inválidos', async () => {
    render(<Cadastro />);

    const usernameInput = screen.getByLabelText('Usuário');
    const senhaInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Criar conta');

    fireEvent.change(usernameInput, { target: { value: 'john123' } });
    fireEvent.change(senhaInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText('O campo usuário só pode conter letras.');
    expect(errorMessage).toBeInTheDocument();
  });
});
