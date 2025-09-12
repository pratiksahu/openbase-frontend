import { env } from '@/lib/env';

export const config = {
  development: {
    api: {
      timeout: 10000,
      retries: 1,
    },
    cache: {
      ttl: 60, // 1 minute
    },
    logging: {
      level: 'debug',
    },
    features: {
      analytics: false,
      monitoring: false,
      errorTracking: false,
    },
  },
  production: {
    api: {
      timeout: 5000,
      retries: 3,
    },
    cache: {
      ttl: 300, // 5 minutes
    },
    logging: {
      level: 'error',
    },
    features: {
      analytics: true,
      monitoring: true,
      errorTracking: true,
    },
  },
  preview: {
    api: {
      timeout: 7500,
      retries: 2,
    },
    cache: {
      ttl: 180, // 3 minutes
    },
    logging: {
      level: 'warn',
    },
    features: {
      analytics: false,
      monitoring: true,
      errorTracking: true,
    },
  },
  test: {
    api: {
      timeout: 15000,
      retries: 0,
    },
    cache: {
      ttl: 0, // No caching in tests
    },
    logging: {
      level: 'silent',
    },
    features: {
      analytics: false,
      monitoring: false,
      errorTracking: false,
    },
  },
} as const;

type Environment = keyof typeof config;
type Config = typeof config[Environment];

export const getCurrentConfig = (): Config => {
  const environment = env.NODE_ENV as Environment;
  return config[environment] || config.development;
};

export const isProduction = (): boolean => {
  return env.NODE_ENV === 'production';
};

export const isDevelopment = (): boolean => {
  return env.NODE_ENV === 'development';
};

export const isTest = (): boolean => {
  return env.NODE_ENV === 'test';
};

export const isPreview = (): boolean => {
  return env.VERCEL_ENV === 'preview';
};