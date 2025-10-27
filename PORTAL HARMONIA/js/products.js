import { STORAGE_KEYS } from './utils.js';

/**
 * Obtém a lista de produtos cadastrados
 * @returns {Array} Lista de produtos
 */
export function getProducts() {
  const seed = [
    {id: crypto.randomUUID(), name:'Café Premium', price:19.90, stock:50},
    {id: crypto.randomUUID(), name:'Chá Verde', price:12.50, stock:80}
  ];
  const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.products)||'null');
  if(!data) {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(seed));
    return seed;
  }
  return data;
}

/**
 * Salva a lista de produtos
 * @param {Array} arr - Lista de produtos
 */
export function setProducts(arr) {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(arr));
}

/**
 * Valida os dados de um produto
 * @param {Object} product - Dados do produto
 * @returns {Object} Resultado da validação
 */
export function validateProduct(product) {
  const errors = [];
  
  if (!product.name?.trim()) {
    errors.push('Nome é obrigatório');
  }
  
  // Corrigido: Agora valida corretamente preços negativos
  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push('Preço deve ser zero ou positivo');
  }
  
  if (!Number.isInteger(product.stock) || product.stock < 0) {
    errors.push('Estoque deve ser inteiro ≥ 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Verifica se o usuário tem permissão para excluir produtos
 * @param {string} role - Perfil do usuário
 * @returns {boolean} Se tem permissão
 */
export function canDeleteProducts(role) {
  // Corrigido: Agora apenas administradores podem excluir
  return role === 'administrador';
}