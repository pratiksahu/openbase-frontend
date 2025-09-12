import { faker } from '@faker-js/faker';

// Mock data factories
export const createMockUser = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
});

export const createMockPost = () => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(3),
  excerpt: faker.lorem.paragraph(),
  slug: faker.lorem.slug(),
  author: createMockUser(),
  publishedAt: faker.date.past().toISOString(),
  tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
    faker.lorem.word()
  ),
});

export const createMockApiResponse = <T>(data: T, status = 200) => ({
  data,
  status,
  message: status === 200 ? 'Success' : 'Error',
});

// Mock API handlers using MSW
export const mockApiHandlers = [
  // Add MSW handlers here
];

// Mock localStorage
export const mockLocalStorage = () => {
  const storage: Record<string, string> = {};

  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach(key => delete storage[key]);
    },
  };
};

// Mock fetch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockFetch = (response: any, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status < 400,
    status,
    json: jest.fn().mockResolvedValue(response),
    text: jest.fn().mockResolvedValue(JSON.stringify(response)),
  });
};

// Reset all mocks
export const resetAllMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};