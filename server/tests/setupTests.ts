// Global setup for tests. Keep minimal for now.

// Increase default timeout for slow CI environments if needed
jest.setTimeout(10000);

// Optionally mock environment variables
process.env.NODE_ENV = 'test';

