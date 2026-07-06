import { MonthlyBaselineEmissions, IndustrialPlant, TransitionManover } from '@/types/energy';

/**
 * Calculates the Carbon Tax applied exclusively to emissions that exceed the regulatory limit.
 * Formula: Excess Tons * Tax Rate per Ton
 */
export const calculateCarbonTax = (emissions: number, limit: number, taxRate: number): number => {
  if (emissions <= limit) return 0;
  return (emissions - limit) * taxRate;
};

/**
 * Computes the total potential financial savings and environmental impacts of active maneuvers.
 */
export const calculateManoversImpact = (
  activeManovers: TransitionManover[],
  premiumPlants: IndustrialPlant[],
  taxRate: number
) => {
  let totalCo2Reduced = 0;
  let totalInvestmentCost = 0;

  activeManovers.forEach((manover) => {
    const targetPlant = premiumPlants.find((p) => p.id === manover.plantId);
    if (targetPlant) {
      // Impact is calculated based on the specific plant's baseline contribution
      const reduction = targetPlant.currentEmissions * (manover.reductionPercentage / 100);
      totalCo2Reduced += reduction;
      totalInvestmentCost += manover.cost;
    }
  });

  const taxSavings = totalCo2Reduced * taxRate;

  return {
    totalCo2Reduced,      // Expressed in metric tons of CO2
    totalInvestmentCost,  // Expressed in EUR
    taxSavings            // Reclaimed capital from avoided fines in EUR
  };
};