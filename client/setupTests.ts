import '@testing-library/jest-dom/vitest';

// Create a root element for React to render into
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

// Mock window.matchMedia for jsdom
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
}
