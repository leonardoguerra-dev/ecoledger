// Represents historical, aggregated emissions data available to all users
export interface MonthlyBaselineEmissions {
  month: string;      // e.g., "Jan", "Feb"
  emissions: number;  // Historical CO2 emissions in tons
  limit: number;      // Regulated CO2 emission limit in tons
}

// Data structure returned by the public API endpoint (Pre-Login)
export interface PublicBaselineData {
  companyName: string;
  totalHistoricalEmissions: number;
  currentCarbonTaxRate: number; // Cost per excess ton of CO2
  monthlyHistory: MonthlyBaselineEmissions[];
}

// Details of an industrial plant, accessible only by authenticated users
export interface IndustrialPlant {
  id: string;
  name: string;
  location: string;
  sector: 'Manufacturing' | 'Chemical' | 'Logistics' | 'Energy';
  currentEmissions: number;
  energySource: string;
}

// Structure of a simulated transition strategy (Runtime only)
export interface TransitionManover {
  id: string;
  title: string;
  plantId: string;
  reductionPercentage: number; // Expected emission reduction (e.g., 15 for 15%)
  cost: number;                // Investment cost in EUR
  status: 'Pending' | 'Active';
}

// Data structure returned by the premium API endpoint (Post-Login)
export interface PremiumBaselineData {
  plants: IndustrialPlant[];
  allowedManovers: Omit<TransitionManover, 'id' | 'status'>[]; // Templates for available strategies
}