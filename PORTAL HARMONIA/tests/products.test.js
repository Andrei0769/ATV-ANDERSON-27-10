import { render, screen, fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { renderProducts } from '../js/views/products';
import { getProducts, setProducts } from '../js/products';

describe('Módulo de Produtos (CRUD)', () => {
  // Dados de exemplo para testes
  const mockProducts = [
    { id: '1', name: 'Café Premium', price: 19.90, stock: 50 },
    { id: '2', name: 'Chá Verde', price: 12.50, stock: 80 }
  ];

  beforeEach(async () => {
    // Setup do DOM
    document.body.innerHTML = `
      <main id="app">
        <div id="view"></div>
      </main>
      <div id="toast"></div>
    `;

    // Simula usuário logado como administrador
    sessionStorage.setItem('ph_session', JSON.stringify({
      username: 'admin',
      role: 'administrador'
    }));

    // Pré-cadastra produtos
    localStorage.setItem('ph_products', JSON.stringify(mockProducts));

    await renderProducts();
  });

  describe('Listagem', () => {
    it('deve exibir lista de produtos com loader inicial', async () => {
      // Verifica loader
      expect(screen.getByLabelText(/carregando lista/i)).toBeInTheDocument();

      // Aguarda carregamento
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Verifica produtos listados
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3); // cabeçalho + 2 produtos
      expect(screen.getByText('Café Premium')).toBeInTheDocument();
      expect(screen.getByText('Chá Verde')).toBeInTheDocument();
    });

    it('deve filtrar produtos por busca', async () => {
      const user = userEvent.setup();

      // Digita termo de busca
      await user.type(screen.getByLabelText(/buscar produtos/i), 'café');

      // Verifica filtragem
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // cabeçalho + 1 produto
      expect(screen.getByText('Café Premium')).toBeInTheDocument();
      expect(screen.queryByText('Chá Verde')).not.toBeInTheDocument();
    });
  });

  describe('Criar Produto', () => {
    it('deve criar novo produto com sucesso', async () => {
      const user = userEvent.setup();

      // Abre form
      await user.click(screen.getByText('Novo produto'));

      // Preenche dados
      await user.type(screen.getByLabelText(/nome/i), 'Café Especial');
      await user.type(screen.getByLabelText(/preço/i), '21.90');
      await user.type(screen.getByLabelText(/estoque/i), '30');

      // Salva
      await user.click(screen.getByText('Salvar'));

      // Verifica toast e lista atualizada
      expect(screen.getByRole('status')).toHaveTextContent('Produto criado');
      expect(screen.getByText('Café Especial')).toBeInTheDocument();

      // Verifica storage
      const products = getProducts();
      expect(products).toContainEqual(expect.objectContaining({
        name: 'Café Especial',
        price: 21.90,
        stock: 30
      }));
    });

    it('deve validar campos obrigatórios', async () => {
      const user = userEvent.setup();

      await user.click(screen.getByText('Novo produto'));
      await user.click(screen.getByText('Salvar'));

      expect(screen.getByRole('alert')).toHaveTextContent('Nome é obrigatório');
    });

    it('deve validar preço negativo', async () => {
      const user = userEvent.setup();

      await user.click(screen.getByText('Novo produto'));
      await user.type(screen.getByLabelText(/nome/i), 'Teste');
      await user.type(screen.getByLabelText(/preço/i), '-10');
      await user.click(screen.getByText('Salvar'));

      expect(screen.getByRole('alert')).toHaveTextContent('Preço deve ser zero ou positivo');
    });
  });

  describe('Editar Produto', () => {
    it('deve editar produto existente', async () => {
      const user = userEvent.setup();

      // Clica em editar primeiro produto
      await user.click(screen.getAllByText('Editar')[0]);

      // Altera preço
      const priceInput = screen.getByLabelText(/preço/i);
      await user.clear(priceInput);
      await user.type(priceInput, '21.90');

      // Salva
      await user.click(screen.getByText('Salvar'));

      // Verifica atualização
      expect(screen.getByRole('status')).toHaveTextContent('Produto atualizado');
      expect(screen.getByText('R$ 21.90')).toBeInTheDocument();
    });
  });

  describe('Remover Produto', () => {
    it('deve remover produto com confirmação', async () => {
      const user = userEvent.setup();
      window.confirm = jest.fn(() => true);

      // Remove primeiro produto
      await user.click(screen.getAllByText('Excluir')[0]);

      // Verifica remoção
      expect(screen.getByRole('status')).toHaveTextContent('Produto removido');
      expect(screen.queryByText('Café Premium')).not.toBeInTheDocument();
    });

    it('deve respeitar permissões de acesso', async () => {
      // Simula usuário operacional
      sessionStorage.setItem('ph_session', JSON.stringify({
        username: 'oper',
        role: 'operacional'
      }));

      await renderProducts();

      // Não deve mostrar botão excluir
      expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
    });
  });
});