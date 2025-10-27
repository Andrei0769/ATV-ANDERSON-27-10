import { $, toast } from './utils.js';
import { getSession, clearSession, setRoleChip } from './auth.js';

/**
 * Rotas disponíveis na aplicação
 */
export const routes = {
  '#/login': () => import('./views/login.js').then(m => m.renderLogin()),
  '#/register': () => import('./views/register.js').then(m => m.renderRegister()),
  '#/dashboard': () => import('./views/dashboard.js').then(m => m.renderDashboard())
};

/**
 * Navega para uma rota específica
 * @param {string} hash - Hash da rota
 */
export function navigate(hash) {
  location.hash = hash;
}

/**
 * Monta a view atual baseada na rota
 */
export async function mount() {
  const sess = getSession();
  $('#btnGoLogin').style.display = sess ? 'none' : 'inline-flex';
  $('#btnLogout').style.display = sess ? 'inline-flex' : 'none';
  setRoleChip(sess?.role);
  
  const hash = location.hash || (sess ? '#/dashboard' : '#/login');
  const view = routes[hash] || renderNotFound;
  await view();
}

/**
 * Inicializa os controles de navegação
 */
export function initNavigation() {
  $('#btnGoLogin').addEventListener('click', () => navigate('#/login'));
  $('#btnLogout').addEventListener('click', () => {
    clearSession();
    setRoleChip(null);
    toast('Sessão encerrada');
    navigate('#/login');
  });

  window.addEventListener('hashchange', () => mount());
  mount();
}