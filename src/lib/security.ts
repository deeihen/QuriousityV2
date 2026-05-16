/**
 * Security utilities to prevent abuse and spamming.
 */

// Simple in-memory rate limiter for client-side protection
const rateLimits = new Map<string, number>();

/**
 * Checks if an action is allowed based on a cooldown period.
 * @param action - Unique name for the action (e.g., 'join-quiz', 'create-quiz')
 * @param cooldownMs - Cooldown period in milliseconds
 * @returns true if the action is allowed, false otherwise
 */
export const checkRateLimit = (action: string, cooldownMs: number): boolean => {
  const now = Date.now();
  const lastAction = rateLimits.get(action) || 0;

  if (now - lastAction < cooldownMs) {
    return false;
  }

  rateLimits.set(action, now);
  return true;
};

/**
 * Clears rate limit for an action (useful for resetting after a specific failure or success if needed)
 */
export const clearRateLimit = (action: string) => {
  rateLimits.delete(action);
};
