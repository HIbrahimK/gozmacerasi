import { useCallback } from 'react';
import posthog from 'posthog-js';

interface EventProperties {
  [key: string]: any;
}

export function usePostHog() {
  const captureEvent = useCallback((eventName: string, properties?: EventProperties) => {
    if (typeof window !== 'undefined' && posthog) {
      // Sample rate: 10% in dev, 100% in prod
      const sampleRate = process.env.NODE_ENV === 'production' ? 1 : 0.1;
      if (Math.random() < sampleRate) {
        posthog.capture(eventName, {
          ...properties,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        });
        console.log(`📊 Event captured: ${eventName}`, properties);
      }
    }
  }, []);

  const identifyUser = useCallback((userId: string, properties?: EventProperties) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.identify(userId, {
        ...properties,
        identified_at: new Date().toISOString(),
      });
      console.log(`🔑 User identified: ${userId}`);
    }
  }, []);

  const resetUser = useCallback(() => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.reset();
      console.log('🔄 User reset');
    }
  }, []);

  return {
    captureEvent,
    identifyUser,
    resetUser,
    posthog,
  };
}
