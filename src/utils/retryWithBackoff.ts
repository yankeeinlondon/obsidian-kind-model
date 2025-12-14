import { wait } from "./wait";

export interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
}

/**
 * Retry a function with exponential backoff.
 *
 * @param fn - The async function to retry
 * @param options - Configuration for retry behavior
 * @returns The result of the function
 * @throws The last error if all attempts fail
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    }
    catch (error) {
      if (attempt === options.maxAttempts) {
        throw error;
      }
      await wait(options.initialDelay * attempt);
    }
  }
  // TypeScript needs this for exhaustiveness checking
  throw new Error("Retry failed unexpectedly");
}
