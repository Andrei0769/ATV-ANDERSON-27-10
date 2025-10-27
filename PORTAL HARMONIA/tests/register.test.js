import { render, screen, fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { renderRegister } from '../js/views/register';
import { getUsers } from '../js/auth';

describe('Módulo de Cadastro', () => {
  // Setup comum para todos os testes
  beforeEach(async () => {
    // Renderiza a view de registro
    document.body.innerHTML = '<main id="app"></main>';
    await renderRegister();
  });

  describe('Cadastro válido', () => {
    it('deve cadastrar usuário com dados válidos e redirecionar', async () => {
      const user = userEvent.setup();

      // Preenche o formulário
      await user.type(screen.getByLabelText(/usuário/i), 'novouser');
      await user.type(screen.getByLabelText(/e-mail/i), 'novo@teste.com');
      await user.type(screen.getByLabelText(/senha/i), 'Senha123');
      await user.selectOptions(screen.getByLabelText(/perfil/i), 'operacional');

      // Submete o formulário
      await user.click(screen.getByRole('button', { name: /cadastrar/i }));

      // Verifica redirecionamento e toast
      await waitFor(() => {
        expect(window.location.hash).toBe('#/login');
        expect(screen.getByRole('status')).toHaveTextContent('Cadastro realizado');
      });

      // Verifica se usuário foi salvo
      const users = getUsers();
      expect(users).toContainEqual(expect.objectContaining({
        username: 'novouser',
        email: 'novo@teste.com',
        role: 'operacional'
      }));
    });
  });

  describe('Validações', () => {
    it('deve impedir cadastro com e-mail duplicado', async () => {
      // Pré-cadastra um usuário
      localStorage.setItem('ph_users', JSON.stringify([{
        username: 'existente',
        email: 'existente@teste.com',
        password: 'Senha123',
        role: 'operacional'
      }]));

      const user = userEvent.setup();

      // Tenta cadastrar com mesmo e-mail
      await user.type(screen.getByLabelText(/usuário/i), 'novouser');
      await user.type(screen.getByLabelText(/e-mail/i), 'existente@teste.com');
      await user.type(screen.getByLabelText(/senha/i), 'Senha123');
      await user.click(screen.getByRole('button', { name: /cadastrar/i }));

      // Verifica mensagem de erro
      expect(screen.getByRole('alert')).toHaveTextContent('E-mail ou usuário já em uso');
    });

    it('deve validar força da senha', async () => {
      const user = userEvent.setup();

      // Tenta cadastrar com senha fraca
      await user.type(screen.getByLabelText(/usuário/i), 'novouser');
      await user.type(screen.getByLabelText(/e-mail/i), 'novo@teste.com');
      await user.type(screen.getByLabelText(/senha/i), 'abc123');
      await user.click(screen.getByRole('button', { name: /cadastrar/i }));

      // Verifica mensagem de erro
      expect(screen.getByRole('alert')).toHaveTextContent('A senha deve ter ≥8 chars, 1 maiúscula e 1 número');
    });
  });

  describe('Acessibilidade', () => {
    it('deve permitir navegação completa por teclado', async () => {
      const user = userEvent.setup();

      // Verifica ordem do foco
      await user.tab();
      expect(screen.getByLabelText(/usuário/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText(/e-mail/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText(/senha/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText(/perfil/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /cadastrar/i })).toHaveFocus();
    });

    it('deve anunciar erros para leitores de tela', async () => {
      const user = userEvent.setup();

      // Tenta submeter form vazio
      await user.click(screen.getByRole('button', { name: /cadastrar/i }));

      // Verifica se mensagem de erro tem atributos ARIA corretos
      const erro = screen.getByRole('alert');
      expect(erro).toHaveAttribute('role', 'alert');
      expect(erro).toHaveAttribute('aria-live', 'off');
    });
  });
});