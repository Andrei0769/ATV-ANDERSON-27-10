import { STORAGE_KEYS, toast } from './utils.js';

/**
 * Obtém a lista de usuários cadastrados
 * @returns {Array} Lista de usuários
 */
export function getUsers() {
  const base = [
    {username:'admin', password:'1234', role:'administrador', email:'admin@harmonia.app'},
    {username:'oper', password:'1234', role:'operacional', email:'oper@harmonia.app'}
  ];
  const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.users)||'null');
  if(!data) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(base));
    return base;
  }
  return data;
}

/**
 * Salva a lista de usuários
 * @param {Array} arr - Lista de usuários
 */
export function setUsers(arr) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(arr));
}

/**
 * Obtém os dados da sessão atual
 * @returns {Object|null} Dados da sessão ou null se não houver sessão
 */
export function getSession() {
  // Corrigido: Agora respeita a opção "Lembrar-me"
  const s = sessionStorage.getItem(STORAGE_KEYS.session) || localStorage.getItem(STORAGE_KEYS.session);
  return s ? JSON.parse(s) : null;
}

/**
 * Salva os dados da sessão
 * @param {Object} sess - Dados da sessão
 * @param {boolean} remember - Se deve manter a sessão após fechar o navegador
 */
export function setSession(sess, remember) {
  const str = JSON.stringify(sess);
  // Corrigido: Agora respeita a opção "Lembrar-me"
  sessionStorage.removeItem(STORAGE_KEYS.session);
  localStorage.removeItem(STORAGE_KEYS.session);
  if (remember) {
    localStorage.setItem(STORAGE_KEYS.session, str);
  } else {
    sessionStorage.setItem(STORAGE_KEYS.session, str);
  }
}

/**
 * Limpa os dados da sessão atual
 */
export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEYS.session);
  localStorage.removeItem(STORAGE_KEYS.session);
}

/**
 * Valida uma senha conforme os requisitos
 * @param {string} password - Senha a ser validada
 * @returns {boolean} Se a senha é válida
 */
export function validatePassword(password) {
  // Corrigido: Agora valida corretamente todos os requisitos
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[0-9]/.test(password);
}

/**
 * Verifica se o usuário está bloqueado por tentativas falhas
 * @returns {Object} Objeto com status do bloqueio e tempo restante
 */
export function checkLockout() {
  const lockUntil = JSON.parse(localStorage.getItem(STORAGE_KEYS.lockout)||'0');
  const now = Date.now();
  if(lockUntil && now < lockUntil) {
    const minutes = Math.ceil((lockUntil-now)/60000);
    return { isLocked: true, minutes };
  }
  return { isLocked: false };
}

/**
 * Registra uma tentativa falha de login
 * @returns {Object} Status do bloqueio após a tentativa
 */
export function recordFailedAttempt() {
  const failed = (JSON.parse(localStorage.getItem(STORAGE_KEYS.failed)||'0') || 0) + 1;
  localStorage.setItem(STORAGE_KEYS.failed, JSON.stringify(failed));
  
  if(failed >= 5) {
    // Corrigido: Agora usa 5 minutos consistentemente
    const until = Date.now() + 5*60*1000;
    localStorage.setItem(STORAGE_KEYS.lockout, JSON.stringify(until));
    return { isLocked: true, minutes: 5 };
  }
  
  return { isLocked: false, attempts: failed };
}

/**
 * Limpa o status de tentativas falhas
 */
export function clearFailedAttempts() {
  localStorage.removeItem(STORAGE_KEYS.failed);
  localStorage.removeItem(STORAGE_KEYS.lockout);
}