import '@testing-library/jest-dom';
import 'jest-localstorage-mock';

// Limpa o localStorage e sessionStorage antes de cada teste
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  document.body.innerHTML = '';
});

// Mock para window.crypto.randomUUID
window.crypto = {
  randomUUID: () => 'test-uuid'
};

// Mock para location.hash
Object.defineProperty(window, 'location', {
  value: {
    hash: '',
    assign: jest.fn(),
    replace: jest.fn()
  },
  writable: true
});