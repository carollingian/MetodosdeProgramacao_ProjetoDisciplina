import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Painel from '../usuarios_disponiveis/page';

jest.mock('axios');

describe('Painel', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, username: 'user1' },
        { id: 2, username: 'user2' },
        { id: 3, username: 'user3' },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renderizar dados do usuário', async () => {
    render(<Painel />);

    await waitFor(() => {
      const userId1 = screen.getByText('1');
      const userName1 = screen.getByText('user1');
      expect(userId1).toBeInTheDocument();
      expect(userName1).toBeInTheDocument();

      const userId2 = screen.getByText('2');
      const userName2 = screen.getByText('user2');
      expect(userId2).toBeInTheDocument();
      expect(userName2).toBeInTheDocument();

      const userId3 = screen.getByText('3');
      const userName3 = screen.getByText('user3');
      expect(userId3).toBeInTheDocument();
      expect(userName3).toBeInTheDocument();
    });
  });

  test('Navegar entre a tabela', async () => {
    render(<Painel />);

    await waitFor(() => {
      const previousButton = screen.getByText('Anterior');
      const nextButton = screen.getByText('Próxima');

      fireEvent.click(nextButton);
      expect(previousButton).not.toBeDisabled();

      fireEvent.click(previousButton);
      expect(previousButton).toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });
});