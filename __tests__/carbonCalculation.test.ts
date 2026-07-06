import { describe, test, expect } from 'vitest';
import { calculateCarbonTax, calculateManoversImpact } from '@/utils/carbonCalculations';
import { IndustrialPlant, TransitionManover } from '@/types/energy';

describe('Carbon Tax Calculations Engine', () => {
  
  test('should return 0 taxation if emissions are below the regulatory limit', () => {
    const tax = calculateCarbonTax(1500, 2000, 85);
    expect(tax).toBe(0);
  });

  test('should return correct tax penalty if emissions exceed the allowance limit', () => {
    // Excess is 200 tons (2200 - 2000). Tax rate is 85 EUR/ton. Expected: 17000 EUR
    const tax = calculateCarbonTax(2200, 2000, 85);
    expect(tax).toBe(17000);
  });
});

describe('Manovers Dynamic Impact Evaluator', () => {
  
  // Mock data specifically structured for isolated testing setups
  const mockPlants: IndustrialPlant[] = [
    { id: 'p1', name: 'Test Plant', location: 'Rome', sector: 'Manufacturing', currentEmissions: 10000, energySource: 'Gas' }
  ];

  test('should accurately calculate CO2 reductions and financial savings from active strategies', () => {
    const activeManovers: TransitionManover[] = [
      { id: 'm1', title: 'Solar PV', plantId: 'p1', reductionPercentage: 20, cost: 100000, status: 'Active' }
    ];
    
    const taxRate = 100; // 100 EUR per ton

    const result = calculateManoversImpact(activeManovers, mockPlants, taxRate);

    // 20% of 10000 currentEmissions = 2000 tons reduced
    expect(result.totalCo2Reduced).toBe(2000);
    // Cost mapping should match the maneuver specifications
    expect(result.totalInvestmentCost).toBe(100000);
    // 2000 tons reduced * 100 EUR tax rate = 200000 EUR saved from fines
    expect(result.taxSavings).toBe(200000);
  });
});