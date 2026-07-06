import { PublicBaselineData, PremiumBaselineData } from '@/types/energy';

// Helper to simulate network latency for a realistic enterprise UI feeling
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const energyService = {
  /**
   * Fetches aggregated public data visible to all dashboard visitors.
   * Maps to the future unauthenticated public API endpoint.
   */
  async getPublicBaseline(): Promise<PublicBaselineData> {
    await delay(600); // Simulate network roundtrip
    const response = await fetch('/mock/baseline_public.json');
    if (!response.ok) {
      throw new Error('Failed to fetch public energy baseline data');
    }
    return response.json();
  },

  /**
   * Fetches premium granular data required for prediction and simulation engine.
   * Maps to the future authenticated/protected API endpoint.
   * @param token Future JWT or session identifier
   */
  async getPremiumBaseline(/*token?: string*/): Promise<PremiumBaselineData> {
    await delay(800); // Simulate authenticated complex DB query latency
    const response = await fetch('/mock/baseline_premium.json');
    if (!response.ok) {
      throw new Error('Unauthorized or premium dataset missing');
    }
    return response.json();
  }
};