import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
setupZoneTestEnv();

const storageMock = () => {
  let storage = {};
  return {
    getItem: key => (key in storage ? storage[key] : null),
    setItem: (key, value) => (storage[key] = value || ''),
    removeItem: key => delete storage[key],
    clear: () => (storage = {})
  };
};

const chrome = {
  bookmarks: {
    getTree: jest.fn(),
    create: jest.fn(),
    remove: jest.fn()
  },
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn()
    }
  },
  tabs: {
    create: jest.fn(),
    query: jest.fn()
  },
  browserAction: {
    setBadgeText: jest.fn()
  }
};
Object.defineProperty(window, 'chrome', { value: chrome });

Object.defineProperty(window, 'localStorage', { value: storageMock() });
Object.defineProperty(window, 'sessionStorage', { value: storageMock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});

window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
}))


// Needed for mocking ga.js
const scriptTag = document.createElement('script');
document.documentElement.appendChild(scriptTag);
