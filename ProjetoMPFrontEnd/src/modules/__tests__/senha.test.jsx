import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Senha from '../senha/form';

jest.mock('axios');

describe('Senha', () => {
  beforeEach(() => {
    axios.put.mockClear();
  });

  test('Atualiza a senha com sucesso', async () => {
    axios.put.mockResolvedValueOnce();

    render(<Senha />);

    fireEvent.change(screen.getByLabelText('Senha atual'), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText('Nova senha'), {
      target: { value: '987654' },
    });
    fireEvent.click(screen.getByText('Alterar senha'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:8000/Usuarios/update/',
        { senha: '987654' }
      );
      expect(screen.getByText('Senha atualizada com sucesso')).toBeInTheDocument();
    });
  });

  test('Exibe erro ao atualizar senha', async () => {
    const errorMessage = 'Erro ao atualizar senha';
    axios.put.mockRejectedValueOnce(new Error(errorMessage));

    render(<Senha />);

    fireEvent.change(screen.getByLabelText('Senha atual'), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText('Nova senha'), {
      target: { value: '987654' },
    });
    fireEvent.click(screen.getByText('Alterar senha'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:8000/Usuarios/update/',
        { senha: '987654' }
      );
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('Exibe erro de senha atual inválida', async () => {
    render(<Senha />);

    fireEvent.change(screen.getByLabelText('Senha atual'), {
      target: { value: 'abc' },
    });
    fireEvent.change(screen.getByLabelText('Nova senha'), {
      target: { value: '987654' },
    });
    fireEvent.click(screen.getByText('Alterar senha'));

    await waitFor(() => {
      expect(axios.put).not.toHaveBeenCalled();
      expect(screen.getByText('A senha atual deve ser composta apenas por números')).toBeInTheDocument();
    });
  });

  test('Exibe erro de nova senha inválida', async () => {
    render(<Senha />);

    fireEvent.change(screen.getByLabelText('Senha atual'), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText('Nova senha'), {
      target: { value: 'abc' },
    });
    fireEvent.click(screen.getByText('Alterar senha'));

    await waitFor(() => {
      expect(axios.put).not.toHaveBeenCalled();
      expect(screen.getByText('A nova senha deve ser composta apenas por números')).toBeInTheDocument();
    });
  });
});
