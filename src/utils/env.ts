/**
 * Environment Configuration Validator
 *
 * Validates and provides type-safe access to environment variables.
 * Fails fast on startup if required variables are missing.
 *
 * @critical - All environment variables must be validated before use
 */

import { logger } from './logger';

/**
 * Environment variable configuration interface
 */
interface EnvConfig {
  // API Configuration
  apiUrl: string;

  // Content Configuration
  pageContentId: string;

  // Role IDs for RBAC
  superAdminRoleId: number;
  adminRoleId: number;

  // Runtime flags
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Environment validation error class
 */
class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

/**
 * Environment Configuration Manager
 *
 * Singleton class that validates and provides access to environment variables.
 * Validates all required variables on first access and caches the result.
 */
class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private config: EnvConfig | null = null;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.validateAndLoad();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  /**
   * Validate and load environment variables
   * @throws {EnvValidationError} If required variables are missing or invalid
   */
  private validateAndLoad(): void {
    const errors: string[] = [];

    // Get raw environment variables
    const apiUrl = import.meta.env.VITE_API_URL;
    const pageContentId = import.meta.env.VITE_PAGE_CONTENT_ID;
    const superAdminRoleId = import.meta.env.VITE_SUPERADMIN;
    const adminRoleId = import.meta.env.VITE_ADMIN;

    // Validate required variables
    if (!apiUrl || typeof apiUrl !== 'string') {
      errors.push('VITE_API_URL is required and must be a non-empty string');
    }

    if (!pageContentId || typeof pageContentId !== 'string') {
      errors.push(
        'VITE_PAGE_CONTENT_ID is required and must be a non-empty string'
      );
    }

    // Validate role IDs (optional with defaults, but must be valid numbers if provided)
    const parsedSuperAdminRoleId = this.parseRoleId(
      superAdminRoleId,
      'VITE_SUPERADMIN',
      32562
    );
    const parsedAdminRoleId = this.parseRoleId(adminRoleId, 'VITE_ADMIN', 2);

    if (parsedSuperAdminRoleId.error) errors.push(parsedSuperAdminRoleId.error);
    if (parsedAdminRoleId.error) errors.push(parsedAdminRoleId.error);

    // If there are validation errors, throw
    if (errors.length > 0) {
      const errorMessage = `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`;
      logger.error(errorMessage);
      throw new EnvValidationError(errorMessage);
    }

    // Store validated configuration
    this.config = {
      apiUrl: apiUrl as string,
      pageContentId: pageContentId as string,
      superAdminRoleId: parsedSuperAdminRoleId.value!,
      adminRoleId: parsedAdminRoleId.value!,
      isDevelopment: import.meta.env.DEV === true,
      isProduction: import.meta.env.PROD === true,
    };

    // Log successful validation in development
    logger.info('✅ Environment variables validated successfully');
    logger.debug('Environment config:', {
      apiUrl: this.config.apiUrl,
      pageContentId: this.config.pageContentId,
      isDevelopment: this.config.isDevelopment,
      isProduction: this.config.isProduction,
      // Don't log role IDs for security
    });
  }

  /**
   * Parse and validate a role ID
   */
  private parseRoleId(
    value: string | undefined,
    name: string,
    defaultValue: number
  ): { value?: number; error?: string } {
    if (value === undefined || value === '') {
      // Use default value
      logger.debug(`${name} not set, using default: ${defaultValue}`);
      return { value: defaultValue };
    }

    const parsed = Number(value);
    if (isNaN(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
      return {
        error: `${name} must be a positive integer (got: ${value})`,
      };
    }

    return { value: parsed };
  }

  /**
   * Get the validated configuration
   * @throws {Error} If configuration is not loaded (should never happen)
   */
  public getConfig(): EnvConfig {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }
    return this.config;
  }

  /**
   * Get API URL
   */
  public get apiUrl(): string {
    return this.getConfig().apiUrl;
  }

  /**
   * Get Page Content ID
   */
  public get pageContentId(): string {
    return this.getConfig().pageContentId;
  }

  /**
   * Get Super Admin Role ID
   */
  public get superAdminRoleId(): number {
    return this.getConfig().superAdminRoleId;
  }

  /**
   * Get Admin Role ID
   */
  public get adminRoleId(): number {
    return this.getConfig().adminRoleId;
  }

  /**
   * Check if running in development mode
   */
  public get isDevelopment(): boolean {
    return this.getConfig().isDevelopment;
  }

  /**
   * Check if running in production mode
   */
  public get isProduction(): boolean {
    return this.getConfig().isProduction;
  }
}

// Export singleton instance
export const env = EnvironmentConfig.getInstance();

// Export types
export type { EnvConfig };
export { EnvValidationError };

/**
 * Usage Examples:
 *
 * // Import the env instance
 * import { env } from '@/utils/env';
 *
 * // Access validated environment variables
 * const apiUrl = env.apiUrl;
 * const isDev = env.isDevelopment;
 * const roleId = env.superAdminRoleId;
 *
 * // Or get the full config object
 * const config = env.getConfig();
 * console.log(config.apiUrl);
 *
 * // The validator runs automatically on first import
 * // If validation fails, the app will throw an error on startup
 */
