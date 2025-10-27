/**
 * Chaves de armazenamento usadas no localStorage e sessionStorage
 */
export const STORAGE_KEYS = {
  users: 'ph_users',
  session: 'ph_session',
  failed: 'ph_failed_attempts',
  lockout: 'ph_lockout_until',
  products: 'ph_products'
};

/**
 * Seletor de elementos DOM simplificado
 * @param {string} sel - Seletor CSS
 * @param {Element} root - Elemento raiz para busca (opcional)
 * @returns {Element} Primeiro elemento encontrado
 */
export const $ = (sel, root=document) => root.querySelector(sel);

/**
 * Seletor múltiplo de elementos DOM
 * @param {string} sel - Seletor CSS
 * @param {Element} root - Elemento raiz para busca (opcional)
 * @returns {Array<Element>} Array com elementos encontrados
 */
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/**
 * Pausa a execução por um tempo determinado
 * @param {number} ms - Tempo em milissegundos
 * @returns {Promise} Promise que resolve após o tempo especificado
 */
export const sleep = (ms)=> new Promise(r=>setTimeout(r, ms));

/**
 * Exibe uma mensagem toast na interface
 * @param {string} msg - Mensagem a ser exibida
 */
export function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/**
 * Atualiza o chip de perfil do usuário na interface
 * @param {string|null} role - Perfil do usuário
 */
export function setRoleChip(role) {
  const chip = $('#roleChip');
  if(role) {
    chip.textContent = role;
    chip.style.display = 'inline-flex';
  } else {
    chip.style.display = 'none';
  }
}