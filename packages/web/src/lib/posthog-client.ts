import posthog from 'posthog-js';

/**
 * Capture event for PostHog analytics
 */
export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog) {
    const sampleRate = process.env.NODE_ENV === 'production' ? 1 : 0.1;
    if (Math.random() < sampleRate) {
      posthog.capture(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      });
    }
  }
};

/**
 * Identify user for PostHog
 */
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.identify(userId, {
      ...properties,
      identified_at: new Date().toISOString(),
    });
  }
};

/**
 * Reset user session
 */
export const resetPostHogUser = () => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.reset();
  }
};

/**
 * Set global properties for all events
 */
export const setGlobalProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.register(properties);
  }
};
