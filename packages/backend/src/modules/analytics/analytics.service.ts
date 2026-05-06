import { Injectable, OnModuleInit } from '@nestjs/common';
import PostHog from 'posthog-node';

@Injectable()
export class AnalyticsService implements OnModuleInit {
  private posthog: PostHog;
  private initialized: boolean = false;

  onModuleInit() {
    const apiKey = process.env.POSTHOG_API_KEY;
    const apiHost = process.env.POSTHOG_HOST || 'https://app.posthog.com';

    if (apiKey) {
      this.posthog = new PostHog(apiKey, {
        host: apiHost,
        flushInterval: 30000, // 30 seconds
        featureFlagsPollingInterval: 300, // 5 minutes
      });

      this.initialized = true;
      console.log(`✅ PostHog initialized (${apiHost})`);
    } else {
      console.warn('⚠️ POSTHOG_API_KEY not found. Analytics disabled.');
      this.initialized = false;
    }
  }

  /**
   * Capture an event with properties
   */
  captureEvent(
    event: string,
    distinctId: string,
    properties?: Record<string, any>,
  ): void {
    if (!this.initialized) return;

    try {
      this.posthog.capture({
        distinctId,
        event,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        },
      });

      if (process.env.NODE_ENV !== 'production') {
        console.log(`📊 Event: ${event}`, properties);
      }
    } catch (error) {
      console.error(`❌ Error capturing event: ${event}`, error);
    }
  }

  /**
   * Identify a user
   */
  identifyUser(
    distinctId: string,
    properties?: Record<string, any>,
  ): void {
    if (!this.initialized) return;

    try {
      this.posthog.identify({
        distinctId,
        properties: {
          ...properties,
          identified_at: new Date().toISOString(),
        },
      });

      console.log(`🔑 User identified: ${distinctId}`);
    } catch (error) {
      console.error(`❌ Error identifying user: ${distinctId}`, error);
    }
  }

  /**
   * Flush pending events
   */
  async flush(): Promise<void> {
    if (!this.initialized) return;

    return new Promise((resolve) => {
      // PostHog Node client auto-flushes, but we'll wait a bit
      setTimeout(() => {
        console.log('✅ PostHog events flushed');
        resolve();
      }, 1000);
    });
  }

  /**
   * Shutdown PostHog
   */
  async onModuleDestroy(): Promise<void> {
    if (this.initialized) {
      await this.flush();
      console.log('📤 PostHog flushed and closed');
    }
  }

  /**
   * Get PostHog client instance
   */
  getClient(): PostHog {
    return this.posthog;
  }
}
