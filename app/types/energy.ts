// Core types for Energy Transition Simulator
export type EnergySource = 'Gas' | 'Oil' | 'Coal' | 'Solar' | 'Wind' | 'Hydro';
export type BranchLocation = 'Milan HQ' | 'Rome Plant' | 'Paris Facility' | 'Berlin Hub';
export type ManeuverStatus = 'ACTUAL' | 'SIMULATION';

export interface EnergyTransitionManeuver {
  id: number;
  date: string; // Used within the 12-month standard cycle (e.g., "Month 01" or Month Names)
  branch: BranchLocation;
  energySource: EnergySource;
  mwhDelta: number; // Positive for increase, negative for decrease
  costImpact: number; // Cost savings (negative) or extra investment (positive) in EUR
  co2Saved: number; // Metric tons of CO2e reduced (tCO2e)
  status: ManeuverStatus;
  description: string;
}

export type NewManeuverInput = Omit<EnergyTransitionManeuver, 'id'>;