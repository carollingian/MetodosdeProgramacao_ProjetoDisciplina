import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Painel from '../grupos_disponiveis/page';

jest.mock('axios');

describe('Painel', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        '-NXcTPBJQBEVeVLngCgfds': {
          id: 1,
          membros: [1],
          nome: 'grupo1',
          preferencias: [1, 2, 3],
        },
        '-NYR8w8zaUJRUTA-_8GC': {
          id: 6,
          membros: ['Jô Soares'],
          nome: 'Romance',
          preferencias: ['Romance'],
        },
        '-anykey': {
          id: 2,
          membros: [1],
          nome: 'qualquernome',
          preferencias: [2],
        },
        Total: {
          num: 246,
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renderizar dados do grupo', async () => {
    render(<Painel />);

    await waitFor(() => {
      const groupId1 = screen.getByText('1');
      const groupName1 = screen.getByText('grupo1');
      expect(groupId1).toBeInTheDocument();
      expect(groupName1).toBeInTheDocument();

      const groupId2 = screen.getByText('6');
      const groupName2 = screen.getByText('Romance');
      expect(groupId2).toBeInTheDocument();
      expect(groupName2).toBeInTheDocument();

      const groupId3 = screen.getByText('2');
      const groupName3 = screen.getByText('qualquernome');
      expect(groupId3).toBeInTheDocument();
      expect(groupName3).toBeInTheDocument();
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
