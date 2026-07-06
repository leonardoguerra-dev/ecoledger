"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  PublicBaselineData,
  IndustrialPlant,
  TransitionManover,
} from "@/types/energy";
import { energyService } from "@/services/energyService";
import { useAuth } from "./AuthContext";
import { getDictionary, DictionaryType } from "@/utils/getDictionaries";

interface EnergyContextType {
  publicData: PublicBaselineData | null;
  premiumPlants: IndustrialPlant[];
  activeManovers: TransitionManover[];
  isLoading: boolean;
  isPremiumLoading: boolean;
  addManover: (manover: Omit<TransitionManover, "id" | "status">) => void;
  removeManover: (id: string) => void;
  calculateSimulatedEmissions: () => number;
  updatePlantEmissions: (plantId: string, newEmissions: number) => void;
  t: DictionaryType | null; // Globally exposed and typed dictionary payload
}

export const EnergyContext = createContext<EnergyContextType | undefined>(
  undefined,
);

export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const [publicData, setPublicData] = useState<PublicBaselineData | null>(null);
  const [premiumPlants, setPremiumPlants] = useState<IndustrialPlant[]>([]);
  const [activeManovers, setActiveManovers] = useState<TransitionManover[]>([]);
  const [dict, setDict] = useState<DictionaryType | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPremiumLoading, setIsPremiumLoading] = useState<boolean>(false);

  // Core Sync: Resolve translation bundle synchronously on layout parameter change
  useEffect(() => {
    getDictionary(lang).then((loadedDictionary) => {
      setDict(loadedDictionary);
    });
  }, [lang]);

  // Fetch initial public baseline data on application mount
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

  // Incremental fetch triggered when user changes to authenticated status
  useEffect(() => {
    const loadPremiumData = async () => {
      if (!isAuthenticated) {
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

  const updatePlantEmissions = (plantId: string, newEmissions: number) => {
    setPremiumPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === plantId
          ? { ...plant, currentEmissions: newEmissions }
          : plant,
      ),
    );
  };

  const calculateSimulatedEmissions = (): number => {
    if (!publicData) return 0;

    const latestMonth =
      publicData.monthlyHistory[publicData.monthlyHistory.length - 1];
    let totalEmissions = latestMonth.emissions;

    activeManovers.forEach((manover) => {
      const targetPlant = premiumPlants.find((p) => p.id === manover.plantId);
      if (targetPlant) {
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
        isLoading: isLoading || !dict, // Interface stays in loading placeholder until translations are ready
        isPremiumLoading,
        addManover,
        removeManover,
        calculateSimulatedEmissions,
        updatePlantEmissions,
        t: dict, // Available everywhere instantly via useEnergy()
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
