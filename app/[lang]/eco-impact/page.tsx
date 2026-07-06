"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { Edit as EditIcon } from "@mui/icons-material";

import { useEnergy } from "@/hooks/useEnergy";
import { calculateCarbonTax } from "@/utils/carbonCalculations";
import PlantEditModal from "@/components/eco-impact/PlantEditModal";
import { IndustrialPlant } from "@/types/energy";

export default function EcoImpactPage() {
  const {
    publicData,
    premiumPlants,
    isLoading,
    calculateSimulatedEmissions,
    updatePlantEmissions,
    t: globalDict,
  } = useEnergy();

  // Core filter and modal target structural variables state management
  const [selectedSector, setSelectedSector] = React.useState<string>("All");
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [activePlant, setActivePlant] = React.useState<IndustrialPlant | null>(
    null,
  );

  // Guard rails to prevent rendering empty elements before full dictionary resolution
  if (isLoading || !publicData || !globalDict) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const t = globalDict.ecoImpact;

  const energyMixData = [
    { id: 0, value: 35, label: "Solar", color: "#4caf50" },
    { id: 1, value: 25, label: "Gas", color: "#ff9800" },
    { id: 2, value: 15, label: "Wind", color: "#2196f3" },
    { id: 3, value: 15, label: "Oil", color: "#795548" },
    { id: 4, value: 5, label: "Hydro", color: "#00bcd4" },
    { id: 5, value: 5, label: "Coal", color: "#212121" },
  ];

  const latestMonthData =
    publicData.monthlyHistory[publicData.monthlyHistory.length - 1];
  const totalSimulatedEmissions = calculateSimulatedEmissions();

  const simulatedTaxRisk = calculateCarbonTax(
    totalSimulatedEmissions,
    latestMonthData.limit,
    publicData.currentCarbonTaxRate,
  );

  const regionalBenchmarkCap =
    premiumPlants.length > 0
      ? Math.round(latestMonthData.limit / premiumPlants.length)
      : 250;

  // Perform dynamic filtration mapping based on user selection parameters
  const filteredPlants = premiumPlants.filter(
    (p) => selectedSector === "All" || p.sector === selectedSector,
  );

  const branchCompliance = filteredPlants.map((plant) => {
    const currentCo2 = plant.currentEmissions;
    const isViolated = currentCo2 > regionalBenchmarkCap;

    return {
      id: plant.id,
      name: plant.name,
      currentCo2: currentCo2,
      maxCap: regionalBenchmarkCap,
      status: isViolated ? t.statusViolation : t.statusCompliant,
      isViolated,
      rawPlant: plant,
    };
  });

  return (
    <Box sx={{ flexGrow: 1, py: 2, color: "text.primary" }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
          gutterBottom
        >
          {t.title}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {t.subtitle}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid sx={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                {t.chartMixTitle}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PieChart
                  series={[
                    {
                      data: energyMixData,
                      innerRadius: 60,
                      outerRadius: 100,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  height={260}
                  slotProps={{
                    legend: {
                      direction: "vertical",
                      position: { vertical: "middle", horizontal: "end" },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {t.taxExposureTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t.taxExposureDesc}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t.potentialPenalty}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: simulatedTaxRisk > 0 ? "error.main" : "success.main",
                    my: 1,
                  }}
                >
                  €{simulatedTaxRisk.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.penaltyCalculated
                    ? t.penaltyCalculated.replace(
                        "{rate}",
                        publicData.currentCarbonTaxRate.toString(),
                      )
                    : `Calculated at €${publicData.currentCarbonTaxRate}/tCO₂ on dynamic simulation context.`}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              mt: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {t.tableTitle}
            </Typography>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="sector-filter-label">
                {t.filterLabel || "Sector Filter"}
              </InputLabel>
              <Select
                labelId="sector-filter-label"
                value={selectedSector}
                label={t.filterLabel || "Sector Filter"}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <MenuItem value="All">{t.filterAll || "All Sectors"}</MenuItem>
                <MenuItem value="Manufacturing">
                  {t.sectorManufacturing || "Manufacturing"}
                </MenuItem>
                <MenuItem value="Chemical">
                  {t.sectorChemical || "Chemical"}
                </MenuItem>
                <MenuItem value="Logistics">
                  {t.sectorLogistics || "Logistics"}
                </MenuItem>
                <MenuItem value="Energy">{t.sectorEnergy || "Energy"}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: "0px 2px 8px rgba(0,0,0,0.05)" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>{t.thBranch}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t.thProgress}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    {t.thCurrent}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    {t.thCap}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    {t.thStatus}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    {t.thActions || "Actions"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branchCompliance.map((branch) => {
                  const percentage = Math.min(
                    (branch.currentCo2 / branch.maxCap) * 100,
                    100,
                  );

                  return (
                    <TableRow key={branch.id} hover>
                      <TableCell sx={{ fontWeight: 600, width: "20%" }}>
                        {branch.name}
                      </TableCell>
                      <TableCell sx={{ width: "35%" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            color={
                              branch.isViolated
                                ? "error"
                                : percentage > 80
                                  ? "warning"
                                  : "success"
                            }
                            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", minWidth: 45 }}
                          >
                            {Math.round(
                              (branch.currentCo2 / branch.maxCap) * 100,
                            )}
                            %
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500 }}>
                        {branch.currentCo2} t/CO₂
                      </TableCell>
                      <TableCell align="right" sx={{ color: "text.secondary" }}>
                        {branch.maxCap} t/CO₂
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            display: "inline-block",
                            fontSize: 12,
                            fontWeight: "bold",
                            bgcolor: branch.isViolated
                              ? "error.light"
                              : "success.light",
                            color: branch.isViolated
                              ? "error.dark"
                              : "success.dark",
                          }}
                        >
                          {branch.status}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => {
                            setActivePlant(branch.rawPlant);
                            setIsModalOpen(true);
                          }}
                          aria-label={branch.name}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {branchCompliance.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      {t.noPlantsFound ||
                        "No industrial plants telemetry found matching the selected sector criterion."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Embedded isolated operational data input modifier with local key mounting lifecycle trigger */}
      <PlantEditModal
        key={activePlant?.id || "empty"}
        open={isModalOpen}
        plant={activePlant}
        onClose={() => {
          setIsModalOpen(false);
          setActivePlant(null);
        }}
        onSave={updatePlantEmissions}
      />
    </Box>
  );
}
