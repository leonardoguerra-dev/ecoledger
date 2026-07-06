import { useContext } from 'react';
import { EnergyContext } from '@/context/EnergyContext';

/**
 * Custom hook to consume the Predictive Energy Simulation engine.
 */
export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
};