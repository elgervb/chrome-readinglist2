import 'jest-preset-angular';

const storageMock = () => {
  let storage = {};
  return {
    getItem: (key) => (key in storage ? storage[key] : null),
    setItem: (key, value) => (storage[key] = value || ''),
    removeItem: (key) => delete storage[key],
    clear: () => (storage = {})
  };
};

const chrome = {
  bookmarks: {
    getTree: jest.fn(),
    create: jest.fn()
  }
};
Object.defineProperty(window, 'chrome', { value: chrome });

Object.defineProperty(window, 'localStorage', { value: storageMock() });
Object.defineProperty(window, 'sessionStorage', { value: storageMock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});
