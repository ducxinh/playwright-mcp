/**
 * Environment Configuration
 * Centralized configuration management for different environments
 */

export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl?: string;
  timeout: {
    default: number;
    navigation: number;
    assertion: number;
  };
  retries: number;
  workers: number;
}

export class Environment {
  private static instance: Environment;
  private config: EnvironmentConfig;

  private constructor() {
    const env = process.env.TEST_ENV || "staging";
    this.config = this.loadConfig(env);
  }

  static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  private loadConfig(env: string): EnvironmentConfig {
    const configs: Record<string, EnvironmentConfig> = {
      local: {
        baseUrl: process.env.BASE_URL || "http://localhost:3000",
        apiUrl: process.env.API_URL || "http://localhost:3000/api",
        timeout: {
          default: 30000,
          navigation: 30000,
          assertion: 5000,
        },
        retries: 0,
        workers: 4,
      },
      staging: {
        baseUrl: process.env.BASE_URL || "https://dummy-demo-njndex.web.app",
        apiUrl: process.env.API_URL || "https://dummy-demo-njndex.web.app/api",
        timeout: {
          default: 40000,
          navigation: 40000,
          assertion: 10000,
        },
        retries: 1,
        workers: 2,
      },
      production: {
        baseUrl: process.env.BASE_URL || "https://dummy-demo-njndex.web.app",
        apiUrl: process.env.API_URL || "https://dummy-demo-njndex.web.app/api",
        timeout: {
          default: 60000,
          navigation: 60000,
          assertion: 15000,
        },
        retries: 2,
        workers: 1,
      },
    };

    return configs[env] || configs.staging;
  }

  getConfig(): EnvironmentConfig {
    return this.config;
  }

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  get apiUrl(): string {
    return this.config.apiUrl || this.config.baseUrl;
  }

  get timeout() {
    return this.config.timeout;
  }

  get retries(): number {
    return this.config.retries;
  }

  get workers(): number {
    return this.config.workers;
  }
}

export const env = Environment.getInstance();
