/**
 * API Client - Base HTTP Client with Interceptors and Error Handling
 *
 * This module provides a centralized HTTP client with:
 * - Request/Response interceptors
 * - Authentication handling
 * - Error handling and retry logic
 * - Request cancellation
 * - Rate limiting
 * - Caching support
 *
 * @fileoverview Base API client for all HTTP requests
 * @version 1.0.0
 */

// =============================================================================
// Types and Interfaces
// =============================================================================

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  rateLimitRequests: number;
  rateLimitWindow: number;
}

export interface ApiRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
  retryAttempts?: number;
  signal?: AbortSignal;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  response?: {
    data: any;
    status: number;
    statusText: string;
  };
  code?: string;
  isTimeout?: boolean;
  isNetworkError?: boolean;
  isRetryable?: boolean;
}

export interface RequestInterceptor {
  onFulfilled?: (config: ApiRequest) => ApiRequest | Promise<ApiRequest>;
  onRejected?: (error: any) => any;
}

export interface ResponseInterceptor {
  onFulfilled?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
  onRejected?: (error: ApiError) => any;
}

export interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
  etag?: string;
}

// =============================================================================
// Default Configuration
// =============================================================================

const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: '/api',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  rateLimitRequests: 100,
  rateLimitWindow: 60000, // 1 minute
};

// =============================================================================
// API Client Class
// =============================================================================

export class ApiClient {
  private config: ApiClientConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private rateLimitTracker: Map<string, number[]> = new Map();
  private cache: Map<string, CacheEntry> = new Map();
  private pendingRequests: Map<string, Promise<ApiResponse>> = new Map();

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.setupDefaultInterceptors();
  }

  // =============================================================================
  // Configuration Methods
  // =============================================================================

  updateConfig(config: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): ApiClientConfig {
    return { ...this.config };
  }

  // =============================================================================
  // Interceptor Management
  // =============================================================================

  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }

  private setupDefaultInterceptors(): void {
    // Request interceptor for authentication
    this.addRequestInterceptor({
      onFulfilled: async (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        // Add default headers
        config.headers = {
          'Content-Type': 'application/json',
          ...config.headers,
        };

        return config;
      },
    });

    // Response interceptor for error handling
    this.addResponseInterceptor({
      onFulfilled: (response) => response,
      onRejected: async (error: ApiError) => {
        // Handle 401 unauthorized
        if (error.status === 401) {
          await this.handleUnauthorized();
        }

        // Handle 429 rate limiting
        if (error.status === 429) {
          throw this.createApiError('Rate limit exceeded', error);
        }

        throw error;
      },
    });
  }

  // =============================================================================
  // Authentication Methods
  // =============================================================================

  private getAuthToken(): string | null {
    // In a real app, this would get the token from storage or auth context
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    return null;
  }

  private async handleUnauthorized(): Promise<void> {
    // Clear auth tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }

    // Redirect to login or trigger auth refresh
    // This would typically dispatch an action or call an auth service
    console.warn('Authentication required - redirecting to login');
  }

  // =============================================================================
  // Rate Limiting
  // =============================================================================

  private isRateLimited(url: string): boolean {
    const now = Date.now();
    const requests = this.rateLimitTracker.get(url) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(
      timestamp => now - timestamp < this.config.rateLimitWindow
    );

    // Update the tracker
    this.rateLimitTracker.set(url, validRequests);

    // Check if we're at the limit
    return validRequests.length >= this.config.rateLimitRequests;
  }

  private trackRequest(url: string): void {
    const now = Date.now();
    const requests = this.rateLimitTracker.get(url) || [];
    requests.push(now);
    this.rateLimitTracker.set(url, requests);
  }

  // =============================================================================
  // Caching
  // =============================================================================

  private getCacheKey(request: ApiRequest): string {
    const { url, method, params } = request;
    return `${method}:${url}:${JSON.stringify(params || {})}`;
  }

  private getCachedResponse(cacheKey: string): CacheEntry | null {
    const entry = this.cache.get(cacheKey);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }

    return entry;
  }

  private setCachedResponse(cacheKey: string, data: any, ttl: number = 300000): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
    } else {
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    }
  }

  // =============================================================================
  // Request Deduplication
  // =============================================================================

  private getRequestKey(request: ApiRequest): string {
    return this.getCacheKey(request);
  }

  private async deduplicateRequest<T>(
    request: ApiRequest,
    executor: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> {
    const requestKey = this.getRequestKey(request);

    // If there's already a pending request for this endpoint, return that promise
    const existingRequest = this.pendingRequests.get(requestKey);
    if (existingRequest) {
      return existingRequest as Promise<ApiResponse<T>>;
    }

    // Create new request promise
    const requestPromise = executor().finally(() => {
      // Clean up pending request when done
      this.pendingRequests.delete(requestKey);
    });

    // Track the pending request
    this.pendingRequests.set(requestKey, requestPromise);

    return requestPromise;
  }

  // =============================================================================
  // Error Handling
  // =============================================================================

  private createApiError(message: string, originalError?: any): ApiError {
    const error = new Error(message) as ApiError;

    if (originalError) {
      error.status = originalError.status;
      error.statusText = originalError.statusText;
      error.response = originalError.response;
      error.isTimeout = originalError.name === 'TimeoutError';
      error.isNetworkError = originalError.name === 'NetworkError' || !originalError.status;
      error.isRetryable = this.isRetryableError(originalError);
    }

    return error;
  }

  private isRetryableError(error: any): boolean {
    if (!error.status) return true; // Network errors are retryable

    // Retry on server errors but not client errors
    return error.status >= 500 || error.status === 408 || error.status === 429;
  }

  // =============================================================================
  // Retry Logic
  // =============================================================================

  private async withRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = this.config.retryAttempts,
    delay: number = this.config.retryDelay
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry if it's not a retryable error
        if (!this.isRetryableError(error)) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === maxAttempts) {
          throw error;
        }

        // Wait before retrying with exponential backoff
        const retryDelay = delay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await this.sleep(retryDelay);
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // =============================================================================
  // Main Request Method
  // =============================================================================

  async request<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
    // Apply request interceptors
    let processedRequest = request;
    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onFulfilled) {
        processedRequest = await interceptor.onFulfilled(processedRequest);
      }
    }

    // Build full URL
    const fullUrl = this.buildUrl(processedRequest.url, processedRequest.params);

    // Check rate limiting
    if (this.isRateLimited(fullUrl)) {
      throw this.createApiError('Rate limit exceeded');
    }

    // Check cache for GET requests
    const cacheKey = this.getCacheKey(processedRequest);
    if (processedRequest.method === 'GET') {
      const cached = this.getCachedResponse(cacheKey);
      if (cached) {
        return {
          data: cached.data,
          status: 200,
          statusText: 'OK',
          headers: {},
        };
      }
    }

    // Deduplicate requests
    return this.deduplicateRequest(processedRequest, async () => {
      try {
        // Track the request for rate limiting
        this.trackRequest(fullUrl);

        // Execute the request with retry logic
        const response = await this.withRetry(
          () => this.executeRequest<T>(processedRequest, fullUrl),
          processedRequest.retryAttempts || this.config.retryAttempts
        );

        // Cache GET responses
        if (processedRequest.method === 'GET') {
          this.setCachedResponse(cacheKey, response.data);
        }

        // Apply response interceptors
        let processedResponse = response;
        for (const interceptor of this.responseInterceptors) {
          if (interceptor.onFulfilled) {
            processedResponse = await interceptor.onFulfilled(processedResponse);
          }
        }

        return processedResponse;

      } catch (error) {
        // Apply response interceptors for errors
        let processedError = error as ApiError;
        for (const interceptor of this.responseInterceptors) {
          if (interceptor.onRejected) {
            try {
              processedError = await interceptor.onRejected(processedError);
            } catch (interceptorError) {
              processedError = interceptorError as ApiError;
            }
          }
        }

        throw processedError;
      }
    });
  }

  // =============================================================================
  // Execute Request
  // =============================================================================

  private async executeRequest<T>(request: ApiRequest, fullUrl: string): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const signal = request.signal || controller.signal;

    // Set up timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, request.timeout || this.config.timeout);

    try {
      const fetchOptions: RequestInit = {
        method: request.method,
        headers: request.headers,
        signal,
      };

      // Add body for non-GET requests
      if (request.body && request.method !== 'GET') {
        if (typeof request.body === 'object') {
          fetchOptions.body = JSON.stringify(request.body);
        } else {
          fetchOptions.body = request.body;
        }
      }

      const response = await fetch(fullUrl, fetchOptions);

      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        const error = this.createApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          {
            status: response.status,
            statusText: response.statusText,
            response: {
              data: errorData,
              status: response.status,
              statusText: response.statusText,
            }
          }
        );

        throw error;
      }

      // Parse response data
      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as any;
      }

      // Build headers object
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers,
      };

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw this.createApiError('Request timeout', { name: 'TimeoutError' });
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw this.createApiError('Network error', { name: 'NetworkError' });
      }

      throw error;
    }
  }

  // =============================================================================
  // URL Building
  // =============================================================================

  private buildUrl(url: string, params?: Record<string, any>): string {
    // Handle absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return this.addParams(url, params);
    }

    // Handle relative URLs
    const baseUrl = this.config.baseURL.endsWith('/')
      ? this.config.baseURL.slice(0, -1)
      : this.config.baseURL;

    const path = url.startsWith('/') ? url : `/${url}`;
    const fullUrl = `${baseUrl}${path}`;

    return this.addParams(fullUrl, params);
  }

  private addParams(url: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        urlParams.append(key, String(value));
      }
    });

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${urlParams.toString()}`;
  }

  // =============================================================================
  // Convenience Methods
  // =============================================================================

  async get<T = any>(url: string, params?: Record<string, any>, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...config,
    });
  }

  async post<T = any>(url: string, body?: any, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      body,
      ...config,
    });
  }

  async put<T = any>(url: string, body?: any, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      body,
      ...config,
    });
  }

  async patch<T = any>(url: string, body?: any, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PATCH',
      body,
      ...config,
    });
  }

  async delete<T = any>(url: string, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...config,
    });
  }

  // =============================================================================
  // Utility Methods
  // =============================================================================

  createCancelToken(): { token: AbortSignal; cancel: () => void } {
    const controller = new AbortController();
    return {
      token: controller.signal,
      cancel: () => controller.abort(),
    };
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  getStats(): {
    cacheSize: number;
    pendingRequests: number;
    rateLimitTrackers: number;
  } {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      rateLimitTrackers: this.rateLimitTracker.size,
    };
  }
}

// =============================================================================
// Default Instance
// =============================================================================

export const apiClient = new ApiClient();

export default apiClient;