import React from 'react';
import { render } from '@testing-library/react';
import Painel from '../admin/painel.jsx';

describe('Painel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza o componente corretamente', () => {
    const { getByText } = render(<Painel />);

    // Verifica se o título do painel está presente
    expect(getByText('Painel de administração')).toBeInTheDocument();
  });

});
