"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PublicBaselineData,
  IndustrialPlant,
  TransitionManover,
} from "@/types/energy";
import { energyService } from "@/services/energyService";
import { useAuth } from "./AuthContext";

interface EnergyContextType {
  publicData: PublicBaselineData | null;
  premiumPlants: IndustrialPlant[];
  activeManovers: TransitionManover[];
  isLoading: boolean;
  isPremiumLoading: boolean;
  addManover: (manover: Omit<TransitionManover, "id" | "status">) => void;
  removeManover: (id: string) => void;
  calculateSimulatedEmissions: () => number;
}

export const EnergyContext = createContext<EnergyContextType | undefined>(
  undefined,
);

export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  // State management for decoupled incremental loading
  const [publicData, setPublicData] = useState<PublicBaselineData | null>(null);
  const [premiumPlants, setPremiumPlants] = useState<IndustrialPlant[]>([]);
  const [activeManovers, setActiveManovers] = useState<TransitionManover[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPremiumLoading, setIsPremiumLoading] = useState<boolean>(false);

  // Step 1: Fetch initial public baseline data on application mount
  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const data = await energyService.getPublicBaseline();
        setPublicData(data);
      } catch (error) {
        console.error("Error loading public baseline:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPublicData();
  }, []);

  // Step 2: Incremental fetch triggered when user changes to authenticated status
  useEffect(() => {
    const loadPremiumData = async () => {
      if (!isAuthenticated) {
        // Reset premium states if user logs out
        setPremiumPlants([]);
        setActiveManovers([]);
        return;
      }

      setIsPremiumLoading(true);
      try {
        const data = await energyService.getPremiumBaseline();
        setPremiumPlants(data.plants);
      } catch (error) {
        console.error("Error loading premium architecture data:", error);
      } finally {
        setIsPremiumLoading(false);
      }
    };

    loadPremiumData();
  }, [isAuthenticated]);

  // Step 3: Runtime context calculations (Sandbox Environment)
  const addManover = (newManover: Omit<TransitionManover, "id" | "status">) => {
    const manover: TransitionManover = {
      ...newManover,
      id: `manover-${Date.now()}`,
      status: "Active",
    };
    setActiveManovers((prev) => [...prev, manover]);
  };

  const removeManover = (id: string) => {
    setActiveManovers((prev) => prev.filter((m) => m.id !== id));
  };

  // Business Logic: Computes real-time dynamic environmental impacts
  const calculateSimulatedEmissions = (): number => {
    if (!publicData) return 0;

    // Start from the latest historical month baseline as reference
    const latestMonth =
      publicData.monthlyHistory[publicData.monthlyHistory.length - 1];
    let totalEmissions = latestMonth.emissions;

    // Apply active mitigation strategies to their targeted plants
    activeManovers.forEach((manover) => {
      const targetPlant = premiumPlants.find((p) => p.id === manover.plantId);
      if (targetPlant) {
        // Calculate raw reduction based on specific plant baseline contribution
        const absoluteReduction =
          targetPlant.currentEmissions * (manover.reductionPercentage / 100);
        totalEmissions -= absoluteReduction;
      }
    });

    return Math.max(0, totalEmissions);
  };

  return (
    <EnergyContext.Provider
      value={{
        publicData,
        premiumPlants,
        activeManovers,
        isLoading,
        isPremiumLoading,
        addManover,
        removeManover,
        calculateSimulatedEmissions,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (!context) {
    throw new Error("useEnergy must be used within an EnergyProvider");
  }
  return context;
};
