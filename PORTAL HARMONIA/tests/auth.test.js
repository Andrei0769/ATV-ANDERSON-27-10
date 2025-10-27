import { render, screen, fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { renderLogin } from '../js/views/login';
import { getSession, clearSession } from '../js/auth';

describe('Módulo de Autenticação', () => {
  beforeEach(async () => {
    // Configuração básica do DOM
    document.body.innerHTML = '<main id="app"></main><div id="toast"></div>';
    
    // Pré-cadastra usuário admin
    localStorage.setItem('ph_users', JSON.stringify([{
      username: 'admin',
      password: '1234',
      role: 'administrador',
      email: 'admin@harmonia.app'
    }]));

    await renderLogin();
  });

  describe('Login', () => {
    it('deve fazer login com sucesso', async () => {
      const user = userEvent.setup();

      // Faz login
      await user.type(screen.getByLabelText(/usuário/i), 'admin');
      await user.type(screen.getByLabelText(/senha/i), '1234');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      // Verifica redirecionamento e mensagem
      await waitFor(() => {
        expect(window.location.hash).toBe('#/dashboard');
        expect(screen.getByRole('status')).toHaveTextContent('Login bem-sucedido');
      });

      // Verifica sessão
      const session = getSession();
      expect(session).toEqual(expect.objectContaining({
        username: 'admin',
        role: 'administrador'
      }));
    });

    it('deve rejeitar usuário inexistente', async () => {
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/usuário/i), 'usuario');
      await user.type(screen.getByLabelText(/senha/i), '1234');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Usuário ou senha incorretos');
      expect(getSession()).toBeNull();
    });

    it('deve rejeitar senha incorreta', async () => {
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/usuário/i), 'admin');
      await user.type(screen.getByLabelText(/senha/i), 'senha-errada');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Usuário ou senha incorretos');
      expect(getSession()).toBeNull();
    });

    it('deve validar campos obrigatórios', async () => {
      const user = userEvent.setup();

      // Tenta enviar form vazio
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      // Verifica que campos são required
      const usuario = screen.getByLabelText(/usuário/i);
      const senha = screen.getByLabelText(/senha/i);

      expect(usuario).toBeRequired();
      expect(senha).toBeRequired();
    });

    it('deve bloquear após 5 tentativas falhas', async () => {
      const user = userEvent.setup();

      // Faz 5 tentativas falhas
      for (let i = 0; i < 5; i++) {
        await user.type(screen.getByLabelText(/usuário/i), 'admin');
        await user.type(screen.getByLabelText(/senha/i), 'senha-errada');
        await user.click(screen.getByRole('button', { name: /entrar/i }));
      }

      // Verifica mensagem de bloqueio
      expect(screen.getByRole('alert')).toHaveTextContent('Muitas tentativas. Tente novamente em 5 min');

      // Tenta novo login
      await user.type(screen.getByLabelText(/usuário/i), 'admin');
      await user.type(screen.getByLabelText(/senha/i), '1234');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      // Ainda deve estar bloqueado
      expect(screen.getByRole('alert')).toHaveTextContent('Muitas tentativas');
    });
  });

  describe('Lembrar-me', () => {
    it('deve manter sessão com lembrar-me ativo', async () => {
      const user = userEvent.setup();

      // Faz login com lembrar-me
      await user.type(screen.getByLabelText(/usuário/i), 'admin');
      await user.type(screen.getByLabelText(/senha/i), '1234');
      await user.click(screen.getByLabelText(/lembrar-me/i));
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      // Simula fechar navegador (limpa sessionStorage)
      sessionStorage.clear();

      // Sessão deve persistir no localStorage
      const session = JSON.parse(localStorage.getItem('ph_session'));
      expect(session).toEqual(expect.objectContaining({
        username: 'admin'
      }));
    });

    it('deve limpar sessão sem lembrar-me', async () => {
      const user = userEvent.setup();

      // Faz login sem lembrar-me
      await user.type(screen.getByLabelText(/usuário/i), 'admin');
      await user.type(screen.getByLabelText(/senha/i), '1234');
      await user.click(screen.getByRole('button', { name: /entrar/i }));

      // Simula fechar navegador
      sessionStorage.clear();

      // Não deve ter sessão
      expect(getSession()).toBeNull();
    });
  });

  describe('Logout', () => {
    it('deve fazer logout corretamente', async () => {
      // Simula usuário logado
      sessionStorage.setItem('ph_session', JSON.stringify({
        username: 'admin',
        role: 'administrador'
      }));

      const user = userEvent.setup();

      // Clica no botão de logout
      document.body.innerHTML += '<button id="btnLogout">Sair</button>';
      await user.click(screen.getByText('Sair'));

      // Verifica redirecionamento e limpeza da sessão
      expect(window.location.hash).toBe('#/login');
      expect(getSession()).toBeNull();
      expect(screen.getByRole('status')).toHaveTextContent('Sessão encerrada');
    });
  });
});