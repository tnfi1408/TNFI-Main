import { FPO, FpoCropItem, FpoFactorBreakdown, RiskLevel, DataCompletenessBreakdown } from '../types';

/**
 * Currency formatter helper for INR (₹, Lakhs & Crores)
 */
export function formatCurrencyINR(amount?: number | null, precision = 2): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(precision)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(precision)} L`;
  }
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: precision })}`;
}

export function formatInCrores(amountCr?: number | null): string {
  if (amountCr === undefined || amountCr === null || isNaN(amountCr)) return '₹0.0 Cr';
  return `₹${amountCr.toFixed(1)} Cr`;
}

export function formatInLakhsOrCrores(amountLakhs?: number | null, showLakhSuffix = true): string {
  if (amountLakhs === undefined || amountLakhs === null || isNaN(amountLakhs)) {
    return showLakhSuffix ? '₹0.0 Lakhs' : '₹0.0L';
  }
  if (amountLakhs >= 10000000) {
    return `₹${(amountLakhs / 10000000).toFixed(2)} Cr`;
  }
  if (amountLakhs >= 100) {
    return `₹${(amountLakhs / 100).toFixed(2)} Cr`;
  }
  return `₹${amountLakhs.toFixed(1)}${showLakhSuffix ? ' Lakhs' : 'L'}`;
}

/**
 * Calculate total Harvest Value in Lakhs:
 * Harvest Value (₹) = Crop Price (₹/qtl) * (Expected Harvest Tonnes * 10 qtl/tonne)
 * In Lakhs = ₹ / 100,000
 */
export function calculateHarvestValue(cropPricePerQtl?: number, expectedHarvestTonnes?: number): number {
  if (!cropPricePerQtl || !expectedHarvestTonnes || cropPricePerQtl <= 0 || expectedHarvestTonnes <= 0) return 0;
  const totalRupees = cropPricePerQtl * (expectedHarvestTonnes * 10);
  return Number((totalRupees / 100000).toFixed(2));
}

/**
 * Calculate Expected Revenue in Lakhs:
 * Revenue = Harvest Value * (Buyer Readiness / Offtake Fulfillment %)
 */
export function calculateRevenue(harvestValueLakhs?: number, buyerReadinessPercent: number = 95): number {
  if (!harvestValueLakhs || isNaN(harvestValueLakhs)) return 0;
  const readinessFactor = Math.min(100, Math.max(10, buyerReadinessPercent || 95)) / 100;
  return Number((harvestValueLakhs * readinessFactor).toFixed(2));
}

/**
 * Calculate Expected Profit in Lakhs:
 * Profit = Revenue - Cost (Funding/Input Expenditure)
 */
export function calculateProfit(revenueLakhs?: number, costLakhs?: number): number {
  const rev = revenueLakhs || 0;
  const cost = costLakhs || 0;
  return Number((rev - cost).toFixed(2));
}

/**
 * Calculate Profit Margin %:
 * Margin = (Profit / Revenue) * 100
 */
export function calculateMargin(profitLakhs?: number, revenueLakhs?: number): number {
  if (!revenueLakhs || revenueLakhs <= 0) return 0;
  const margin = ((profitLakhs || 0) / revenueLakhs) * 100;
  return Number(margin.toFixed(1));
}

/**
 * Calculate composite Demand Score (0 - 100):
 * Driven by buyer procurement demand, market price premium over MSP, and supply pressure.
 */
export function calculateDemandScore(
  demandPressure: number,
  buyerOfftakePercent: number,
  mandiPriceMomentum: number
): number {
  const raw = (demandPressure * 0.45) + (buyerOfftakePercent * 0.35) + (mandiPriceMomentum * 0.20);
  return Math.min(100, Math.max(10, Math.round(raw)));
}

/**
 * Calculate Climate Score (0 - 100):
 * Higher is better (optimal weather, good rainfall, low crop stress).
 */
export function calculateClimateScore(
  rainfallAdequacyScore: number,
  temperatureSuitability: number,
  droughtRiskFactor: number
): number {
  const raw = (rainfallAdequacyScore * 0.40) + (temperatureSuitability * 0.40) - (droughtRiskFactor * 0.20);
  return Math.min(100, Math.max(10, Math.round(raw)));
}

/**
 * Calculate Water Risk (0 - 100):
 * Higher indicates greater risk / water stress.
 */
export function calculateWaterRisk(
  waterStress: number,
  irrigationDeficitPercent: number,
  groundwaterDepletionScore: number
): number {
  const raw = (waterStress * 0.40) + (irrigationDeficitPercent * 0.35) + (groundwaterDepletionScore * 0.25);
  return Math.min(100, Math.max(5, Math.round(raw)));
}

/**
 * Calculate Buyer Readiness % (0 - 100):
 * Contracts signed, escrow locks, and institutional offtake history.
 */
export function calculateBuyerReadiness(
  contractFulfillmentScore: number,
  escrowSecured: boolean,
  paymentSpeedScore: number
): number {
  const escrowBonus = escrowSecured ? 15 : 0;
  const raw = (contractFulfillmentScore * 0.50) + (paymentSpeedScore * 0.35) + escrowBonus;
  return Math.min(100, Math.max(10, Math.round(raw)));
}

/**
 * Calculate FPO Performance Index (e.g. 5,000 - 10,000 scale):
 *
 * Agricultural Fundamental Drivers:
 * CROP MARKET PRICE → FUNDED ACREAGE → EXPECTED YIELD → EXPECTED HARVEST → HARVEST VALUE → DEMAND → SUPPLY PRESSURE → CLIMATE → WATER RISK → BUYER/OFFTAKE → REVENUE → PROFIT → FPO PERFORMANCE INDEX
 *
 * Factors (0 - 100):
 * - Market Price (weight: 15%)
 * - Demand (weight: 15%)
 * - Harvest / Yield (weight: 15%)
 * - Profitability / Margin (weight: 20%)
 * - Climate (weight: 10%)
 * - Water Security [100 - WaterRisk] (weight: 10%)
 * - Buyer Readiness (weight: 10%)
 * - Growth / Member Scale (weight: 5%)
 */
export function calculateFPOIndex(factors: {
  marketPriceScore: number;
  demandScore: number;
  harvestScore: number;
  profitabilityScore: number;
  climateScore: number;
  waterRiskScore: number;
  buyerReadinessScore: number;
  growthScore?: number;
}): {
  totalIndex: number;
  factorBreakdown: FpoFactorBreakdown;
  overallScore: number;
} {
  const growth = factors.growthScore ?? 80;
  const waterSecurity = Math.max(0, 100 - factors.waterRiskScore);

  const weightedSum =
    (factors.marketPriceScore * 0.15) +
    (factors.demandScore * 0.15) +
    (factors.harvestScore * 0.15) +
    (factors.profitabilityScore * 0.20) +
    (factors.climateScore * 0.10) +
    (waterSecurity * 0.10) +
    (factors.buyerReadinessScore * 0.10) +
    (growth * 0.05);

  const overallScore = Math.min(100, Math.max(10, Math.round(weightedSum)));
  // Scale score (10 - 100) to index points (1,000 - 10,000)
  const totalIndex = Math.round(overallScore * 95 + 500);

  const factorBreakdown: FpoFactorBreakdown = {
    marketPrice: Math.min(100, Math.max(10, Math.round(factors.marketPriceScore))),
    demand: Math.min(100, Math.max(10, Math.round(factors.demandScore))),
    harvest: Math.min(100, Math.max(10, Math.round(factors.harvestScore))),
    profitability: Math.min(100, Math.max(10, Math.round(factors.profitabilityScore))),
    climate: Math.min(100, Math.max(10, Math.round(factors.climateScore))),
    water: Math.min(100, Math.max(10, Math.round(waterSecurity))),
    buyerReadiness: Math.min(100, Math.max(10, Math.round(factors.buyerReadinessScore))),
    growth: Math.min(100, Math.max(10, Math.round(growth)))
  };

  return {
    totalIndex,
    factorBreakdown,
    overallScore
  };
}

/**
 * Determine Risk Level based on fundamental agricultural risk factors
 */
export function calculatePortfolioMetrics(
  holdings: Array<{
    currentValue: number;
    investedAmount: number;
    unrealizedPnL: number;
    totalUnits?: number;
  }>
) {
  const totalPortfolioValue = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
  const totalInvested = holdings.reduce((sum, h) => sum + (h.investedAmount || 0), 0);
  const totalPnL = totalPortfolioValue - totalInvested;
  const totalReturnPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const dayPnL = totalPortfolioValue * 0.0142; // simulated benchmark drift
  const dayPnLPercent = 1.42;

  return {
    totalPortfolioValue,
    totalInvested,
    totalPnL,
    totalReturnPercent,
    dayPnL,
    dayPnLPercent,
    cashBalance: 408534
  };
}

export function calculateFinancialScore(revenueGrowth: number, netMargin: number, roe: number, debtToEquity: number): number {
  const growthComp = Math.min(100, Math.max(0, revenueGrowth * 3.0));
  const marginComp = Math.min(100, Math.max(0, netMargin * 3.5));
  const roeComp = Math.min(100, Math.max(0, roe * 4.0));
  const debtComp = Math.max(0, 100 - (debtToEquity * 40));
  const raw = (growthComp * 0.25) + (marginComp * 0.35) + (roeComp * 0.25) + (debtComp * 0.15);
  return Math.min(100, Math.max(10, Math.round(raw)));
}

export function calculateAgriculturalScore(
  expectedYieldScore: number,
  harvestRealizationScore: number,
  climateResilience: number,
  waterSecurity: number
): number {
  const raw = (expectedYieldScore * 0.30) + (harvestRealizationScore * 0.30) + (climateResilience * 0.20) + (waterSecurity * 0.20);
  return Math.min(100, Math.max(10, Math.round(raw)));
}

export function calculateRiskScore(climateRisk: number, waterRisk: number, concentrationRisk: number, marketVolatilityRisk: number): number {
  const avgRisk = (climateRisk * 0.25) + (waterRisk * 0.35) + (concentrationRisk * 0.20) + (marketVolatilityRisk * 0.20);
  // Return risk score 0 - 100 where higher means lower risk (safer)
  return Math.min(100, Math.max(10, Math.round(100 - avgRisk)));
}

export function calculateGovernanceScore(auditStatusOk: boolean, boardCompletenessScore: number, reportingTimelinessScore: number): number {
  const auditBonus = auditStatusOk ? 35 : 10;
  const raw = auditBonus + (boardCompletenessScore * 0.35) + (reportingTimelinessScore * 0.30);
  return Math.min(100, Math.max(10, Math.round(raw)));
}

/**
 * Composite FPO Performance Score (0 - 100 scale):
 * Financial Performance:    30%
 * Agricultural Performance: 25%
 * Market Demand:            15%
 * Growth Trajectory:        10%
 * Risk & Water Security:    10%
 * Governance:               10%
 * (Clearly noted as DEMO methodology weights)
 */
export function calculateFPOPerformanceScore(components: {
  financialScore: number;
  agriculturalScore: number;
  demandScore: number;
  growthScore: number;
  riskScore: number;
  governanceScore: number;
}): number {
  const raw =
    (components.financialScore * 0.30) +
    (components.agriculturalScore * 0.25) +
    (components.demandScore * 0.15) +
    (components.growthScore * 0.10) +
    (components.riskScore * 0.10) +
    (components.governanceScore * 0.10);
  return Number(Math.min(100, Math.max(10, raw)).toFixed(1));
}

/**
 * Calculate Index Weight % given an array of FPOs with their performance scores or market caps
 */
export function calculateIndexWeight(fpoScoreOrMarketCap: number, totalSum: number): number {
  if (totalSum <= 0) return 0;
  return Number(((fpoScoreOrMarketCap / totalSum) * 100).toFixed(2));
}

/**
 * Recompute full agricultural and financial aggregate metrics for an FPO entity
 */
export function recomputeFpoAggregates(fpo: FPO): FPO {
  const crops = (fpo.cropPortfolio && fpo.cropPortfolio.length > 0)
    ? fpo.cropPortfolio.map(crop => {
        const acreage = Number(crop.acreage || crop.acres || 100);
        const yieldPerAcre = Number(crop.expectedYieldTonnesPerAcre || 2.5);
        const pricePerQtl = Number(crop.marketPricePerQtl || crop.currentCropMarketPricePerQtl || 3500);
        const costPerAcre = Number(crop.cultivationCostPerAcre || 18000);
        const offtakePercent = Number(crop.buyerOfftakePercent || 90);
        const buyerReadiness = Number(crop.buyerReadinessPercent || offtakePercent);

        const harvestTonnes = Number((acreage * yieldPerAcre).toFixed(1));
        const harvestValLakhs = calculateHarvestValue(pricePerQtl, harvestTonnes);
        const harvestValRupees = harvestValLakhs * 100000;
        const revenueLakhs = calculateRevenue(harvestValLakhs, offtakePercent);
        const revenueRupees = revenueLakhs * 100000;
        const costLakhs = Number(((acreage * costPerAcre) / 100000).toFixed(2));
        const costRupees = acreage * costPerAcre;
        const profitLakhs = calculateProfit(revenueLakhs, costLakhs);
        const profitRupees = revenueRupees - costRupees;
        const margin = calculateMargin(profitLakhs, revenueLakhs);

        return {
          ...crop,
          acreage,
          acres: acreage,
          expectedYieldTonnesPerAcre: yieldPerAcre,
          marketPricePerQtl: pricePerQtl,
          currentCropMarketPricePerQtl: pricePerQtl,
          cultivationCostPerAcre: costPerAcre,
          buyerOfftakePercent: offtakePercent,
          buyerReadinessPercent: buyerReadiness,
          expectedHarvestTonnes: harvestTonnes,
          harvestValueLakhs: harvestValLakhs,
          harvestValue: harvestValRupees,
          revenueLakhs,
          expectedRevenue: revenueRupees,
          costLakhs,
          expectedProfitLakhs: profitLakhs,
          expectedProfit: profitRupees,
          marginPercent: margin
        };
      })
    : [];

  const totalAcreage = crops.length > 0
    ? crops.reduce((sum, c) => sum + (c.acreage || c.acres || 0), 0)
    : (fpo.totalAcreage || fpo.fundedAcres || 1200);

  const totalHarvestTonnes = crops.length > 0
    ? Number(crops.reduce((sum, c) => sum + (c.expectedHarvestTonnes || 0), 0).toFixed(1))
    : (fpo.expectedHarvestTonnes || 2400);

  const totalHarvestValueLakhs = crops.length > 0
    ? Number(crops.reduce((sum, c) => sum + (c.harvestValueLakhs || 0), 0).toFixed(2))
    : (fpo.harvestValueLakhs || (totalHarvestTonnes * 3500 * 10) / 100000);

  const totalRevenueLakhs = crops.length > 0
    ? Number(crops.reduce((sum, c) => sum + (c.revenueLakhs || 0), 0).toFixed(2))
    : (fpo.revenueLakhs || totalHarvestValueLakhs * 0.9);

  const totalCostLakhs = crops.length > 0
    ? Number(crops.reduce((sum, c) => sum + (c.costLakhs || 0), 0).toFixed(2))
    : (fpo.costLakhs || totalAcreage * 0.18);

  const totalProfitLakhs = crops.length > 0
    ? Number((totalRevenueLakhs - totalCostLakhs).toFixed(2))
    : (fpo.expectedProfitLakhs || totalRevenueLakhs * 0.22);

  const profitMarginPercent = totalRevenueLakhs > 0
    ? Number(((totalProfitLakhs / totalRevenueLakhs) * 100).toFixed(1))
    : 18.5;

  const harvestValueRupees = totalHarvestValueLakhs * 100000;
  const revenueRupees = totalRevenueLakhs * 100000;
  const profitRupees = totalProfitLakhs * 100000;
  const revenueCr = Number((revenueRupees / 10000000).toFixed(2));
  const harvestValueCr = Number((harvestValueRupees / 10000000).toFixed(2));

  // Determine factor scores
  const avgMarketPriceScore = crops.length > 0
    ? Math.min(100, Math.max(20, Math.round(
        crops.reduce((sum, c) => sum + ((c.marketPricePerQtl || 3500) / 4500) * 85, 0) / crops.length
      )))
    : (fpo.factorBreakdown?.marketPrice || 86);

  const avgDemandScore = crops.length > 0
    ? Math.round(crops.reduce((sum, c) => sum + (c.demandScore || 85), 0) / crops.length)
    : (fpo.demandScore || fpo.factorBreakdown?.demand || 88);

  const harvestScore = Math.min(100, Math.max(30, Math.round((totalHarvestTonnes / (totalAcreage * 2.2 || 1)) * 85)));
  const profitabilityScore = Math.min(100, Math.max(30, Math.round(profitMarginPercent * 4.2)));

  const climateScore = crops.length > 0
    ? Math.round(crops.reduce((sum, c) => sum + (c.climateScore || c.climateSuitabilityScore || 85), 0) / crops.length)
    : (fpo.climateScore || fpo.factorBreakdown?.climate || 85);

  const waterRiskScore = crops.length > 0
    ? Math.round(crops.reduce((sum, c) => sum + (c.waterRiskScore || 24), 0) / crops.length)
    : (fpo.waterRiskScore || fpo.waterRisk || 24);

  const buyerReadinessScore = crops.length > 0
    ? Math.round(crops.reduce((sum, c) => sum + (c.buyerReadinessPercent || c.buyerOfftakePercent || 90), 0) / crops.length)
    : (fpo.buyerReadiness || fpo.factorBreakdown?.buyerReadiness || 90);

  const indexCalc = calculateFPOIndex({
    marketPriceScore: avgMarketPriceScore,
    demandScore: avgDemandScore,
    harvestScore,
    profitabilityScore,
    climateScore,
    waterRiskScore,
    buyerReadinessScore,
    growthScore: fpo.growthScore || 85
  });

  return {
    ...fpo,
    cropPortfolio: crops,
    totalAcreage,
    fundedAcres: totalAcreage,
    expectedHarvestTonnes: totalHarvestTonnes,
    harvestValue: harvestValueRupees,
    harvestValueLakhs: totalHarvestValueLakhs,
    harvestValueCr,
    expectedRevenue: revenueRupees,
    revenueLakhs: totalRevenueLakhs,
    revenueCr,
    costLakhs: totalCostLakhs,
    expectedProfit: profitRupees,
    expectedProfitLakhs: totalProfitLakhs,
    profitMargin: profitMarginPercent,
    profitMarginPercent,
    demandScore: avgDemandScore,
    climateScore,
    waterRiskScore,
    buyerReadiness: buyerReadinessScore,
    fpoPerformanceIndex: Number((indexCalc.overallScore).toFixed(1)),
    performanceScore: Number((indexCalc.overallScore).toFixed(1)),
    factorBreakdown: indexCalc.factorBreakdown
  };
}

export interface IndexDeltaExplanationItem {
  factor: string;
  changeValue: number;
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  reason: string;
}

/**
 * Derive explanation items between two FPO states
 */
export function calculateIndexDeltaExplanation(
  prev?: Partial<FPO>,
  current?: Partial<FPO>
): IndexDeltaExplanationItem[] {
  if (!prev || !current) return [];

  const items: IndexDeltaExplanationItem[] = [];

  const prevFactors = prev.factorBreakdown;
  const currFactors = current.factorBreakdown;

  if (prevFactors && currFactors) {
    const marketDelta = (currFactors.marketPrice - prevFactors.marketPrice) * 0.15;
    if (Math.abs(marketDelta) >= 0.2) {
      items.push({
        factor: 'Market Price Parity',
        changeValue: Number(marketDelta.toFixed(1)),
        direction: marketDelta > 0 ? 'UP' : 'DOWN',
        reason: marketDelta > 0 ? 'Weighted mandi market price improved over MSP benchmark' : 'Spot market prices contracted relative to baseline'
      });
    }

    const harvestDelta = (currFactors.harvest - prevFactors.harvest) * 0.15;
    if (Math.abs(harvestDelta) >= 0.2) {
      items.push({
        factor: 'Expected Harvest Realization',
        changeValue: Number(harvestDelta.toFixed(1)),
        direction: harvestDelta > 0 ? 'UP' : 'DOWN',
        reason: harvestDelta > 0 ? 'Acreage productivity and expected yield increased' : 'Harvest realization revised downward'
      });
    }

    const profitDelta = (currFactors.profitability - prevFactors.profitability) * 0.20;
    if (Math.abs(profitDelta) >= 0.2) {
      items.push({
        factor: 'Net Operating Margin',
        changeValue: Number(profitDelta.toFixed(1)),
        direction: profitDelta > 0 ? 'UP' : 'DOWN',
        reason: profitDelta > 0 ? 'Operating efficiency and cultivation margin expanded' : 'Input cost pressure compressed margin'
      });
    }

    const buyerDelta = (currFactors.buyerReadiness - prevFactors.buyerReadiness) * 0.10;
    if (Math.abs(buyerDelta) >= 0.2) {
      items.push({
        factor: 'Buyer Readiness & Escrow',
        changeValue: Number(buyerDelta.toFixed(1)),
        direction: buyerDelta > 0 ? 'UP' : 'DOWN',
        reason: buyerDelta > 0 ? 'Institutional buyer offtake commitments strengthened' : 'Pending buyer contracts required'
      });
    }

    const waterDelta = (currFactors.water - prevFactors.water) * 0.10;
    if (Math.abs(waterDelta) >= 0.2) {
      items.push({
        factor: 'Water Security Index',
        changeValue: Number(waterDelta.toFixed(1)),
        direction: waterDelta > 0 ? 'UP' : 'DOWN',
        reason: waterDelta > 0 ? 'Irrigation coverage and groundwater storage improved' : 'Water stress factor increased'
      });
    }
  }

  return items;
}

/**
 * 9-Factor TNFI Required Data Completeness Engine
 * Calculates percentage completeness across:
 * 1. Organisation Details & Registration
 * 2. Membership & Acreage Data
 * 3. Crop Portfolio & Yields
 * 4. Cultivation Funding
 * 5. Financials & Audit
 * 6. Market Prices & Demand Telemetry
 * 7. Buyer Offtake & Escrow
 * 8. Climate Resilience Telemetry
 * 9. Water Security & Irrigation
 */
export function calculateDataCompleteness(fpo: Partial<FPO>): DataCompletenessBreakdown {
  const hasOrg = Boolean(
    fpo.name &&
    (fpo.ticker || fpo.code) &&
    (fpo.district || fpo.state) &&
    (fpo.ceoName || fpo.authorizedPerson || fpo.establishedYear)
  );

  const hasMembership = Boolean(
    (fpo.totalFarmers || fpo.farmerCount || 0) > 0 &&
    (fpo.fundedAcres || fpo.totalAcreage || 0) > 0
  );

  const hasCrop = Boolean(
    fpo.primaryCrop &&
    ((fpo.expectedHarvestTonnes || 0) > 0 || (fpo.cropPortfolio && fpo.cropPortfolio.length > 0))
  );

  const hasFunding = Boolean(
    (fpo.cultivationFundingLakhs || 0) > 0 ||
    (fpo.revenueCr || 0) > 0 ||
    (fpo.expectedRevenue || 0) > 0
  );

  const hasFinancial = Boolean(
    (fpo.revenueCr || fpo.revenueLakhs || fpo.expectedRevenue) &&
    (fpo.profitMarginPercent !== undefined || fpo.patCr !== undefined) &&
    fpo.auditStatus &&
    !fpo.auditStatus.toLowerCase().includes('pending audit')
  );

  const hasMarket = Boolean(
    (fpo.factorBreakdown?.demand !== undefined && fpo.factorBreakdown.demand > 0) ||
    (fpo.demandScore !== undefined && fpo.demandScore > 0) ||
    (fpo.currentCropMarketPrice !== undefined && fpo.currentCropMarketPrice > 0) ||
    (fpo.subScores && (fpo.subScores as any).marketPosition > 0)
  );

  // Buyer Offtake verification
  const isBuyerComplete = Boolean(
    fpo.verificationStatus === 'VERIFIED' ||
    fpo.documentsStatus === 'All Submitted' ||
    fpo.documentsStatus === 'Verified' ||
    (fpo.documents && fpo.documents.some(d => d.title.toLowerCase().includes('buyer') && (d.status === 'VERIFIED' || d.status === 'SUBMITTED'))) ||
    ((fpo.factorBreakdown?.buyerReadiness || (fpo.subScores as any)?.governance || 0) >= 80 && fpo.verificationStatus !== 'CHANGES REQUESTED')
  );

  const hasClimate = Boolean(
    fpo.factorBreakdown?.climate !== undefined ||
    fpo.climateScore !== undefined ||
    (fpo.subScores && (fpo.subScores as any).risk !== undefined) ||
    fpo.riskRating
  );

  const hasWater = Boolean(
    fpo.factorBreakdown?.water !== undefined ||
    fpo.waterRiskScore !== undefined ||
    fpo.waterRisk !== undefined ||
    (fpo.subScores && (fpo.subScores as any).risk !== undefined)
  );

  const areas = [
    {
      key: 'organisation',
      label: 'Organisation & Governance',
      isComplete: hasOrg,
      status: hasOrg ? ('COMPLETE' as const) : ('INCOMPLETE' as const),
      details: fpo.registrationId ? `CIN/Reg: ${fpo.registrationId}` : `Est. ${fpo.establishedYear || 2018} • CEO: ${fpo.ceoName || 'Authorized Lead'}`
    },
    {
      key: 'membership',
      label: 'Membership & Acreage Telemetry',
      isComplete: hasMembership,
      status: hasMembership ? ('COMPLETE' as const) : ('INCOMPLETE' as const),
      details: `${(fpo.totalFarmers || fpo.farmerCount || 1200).toLocaleString()} smallholders • ${(fpo.fundedAcres || fpo.totalAcreage || 2400).toLocaleString()} acres`
    },
    {
      key: 'crop',
      label: 'Crop Portfolio & Expected Yield',
      isComplete: hasCrop,
      status: hasCrop ? ('COMPLETE' as const) : ('INCOMPLETE' as const),
      details: `${fpo.primaryCrop || 'Primary Agri Crop'} • Projected ${((fpo.expectedHarvestTonnes || 3200)).toLocaleString()} MT`
    },
    {
      key: 'funding',
      label: 'Cultivation Funding & Working Capital',
      isComplete: hasFunding,
      status: hasFunding ? ('COMPLETE' as const) : ('INCOMPLETE' as const),
      details: `Working Capital Disbursed: ₹${(fpo.revenueCr ? (fpo.revenueCr * 0.32).toFixed(1) : '8.4')} Cr`
    },
    {
      key: 'financial',
      label: 'Financial Statements & Statutory Audit',
      isComplete: hasFinancial,
      status: hasFinancial ? ('COMPLETE' as const) : ('INCOMPLETE' as const),
      details: `Rev: ₹${fpo.revenueCr || 28.5} Cr • Margin: ${fpo.profitMarginPercent || 16.5}% • ${fpo.auditStatus || 'Statutory Audited'}`
    },
    {
      key: 'market',
      label: 'Market Pricing & Mandi Parity',
      isComplete: hasMarket,
      status: hasMarket ? ('COMPLETE' as const) : ('INCOMPLETE' as const),
      details: `Demand Index: ${fpo.factorBreakdown?.demand || (fpo.subScores as any)?.marketPosition || 88}/100`
    },
    {
      key: 'buyer',
      label: 'Buyer Offtake & Escrow Contracts',
      isComplete: isBuyerComplete,
      status: isBuyerComplete ? ('COMPLETE' as const) : (fpo.verificationStatus === 'CHANGES REQUESTED' ? ('INCOMPLETE' as const) : ('MISSING' as const)),
      details: isBuyerComplete ? 'Offtake contracts active with FMCG / APMC buyers' : 'Buyer escrow agreement incomplete or pending submission'
    },
    {
      key: 'climate',
      label: 'Agro-Climate Risk Assessment',
      isComplete: hasClimate,
      status: hasClimate ? ('COMPLETE' as const) : ('INCOMPLETE' as const),
      details: `Climate resilience: ${fpo.factorBreakdown?.climate || (fpo.subScores as any)?.risk || 86}/100`
    },
    {
      key: 'water',
      label: 'Water Security & Irrigation Telemetry',
      isComplete: hasWater,
      status: hasWater ? ('COMPLETE' as const) : ('INCOMPLETE' as const),
      details: `Water resilience: ${fpo.factorBreakdown?.water || 84}/100`
    }
  ];

  const completedAreasCount = areas.filter(a => a.isComplete).length;
  const totalAreasCount = areas.length;
  const overallPercentage = Math.round((completedAreasCount / totalAreasCount) * 1000) / 10;
  const missingFields = areas.filter(a => !a.isComplete).map(a => a.label);

  const breakdown: Record<string, { present: boolean; status: string }> = {};
  areas.forEach(a => {
    breakdown[a.key] = { present: a.isComplete, status: a.status };
  });

  return {
    overallPercentage,
    totalScore: overallPercentage,
    completedAreasCount,
    totalAreasCount,
    missingFields,
    areas,
    breakdown
  };
}

/**
 * TNFI 50 Eligibility Verification Check (Platform Demonstration Model)
 * An FPO qualifies for TNFI 50 admission when:
 * 1. TNFI Platform Verification Status = VERIFIED
 * 2. Data Completeness >= 80%
 * 3. Performance Score >= 70.0 / 100
 * 4. Agricultural & Financial metrics present
 */
export function checkTnfi50Eligibility(fpo: Partial<FPO>): {
  isEligible: boolean;
  reason: string;
  badge: 'ELIGIBLE' | 'NOT YET ELIGIBLE';
  details: string[];
  reasons: string[];
} {
  const completeness = calculateDataCompleteness(fpo);
  const score = fpo.performanceScore || fpo.tnfiScore || 0;
  const isVerified = fpo.verificationStatus === 'VERIFIED';
  const hasAdequateData = completeness.overallPercentage >= 80;
  const hasPassingScore = score >= 70;

  const details: string[] = [];

  if (!isVerified) {
    details.push(`TNFI Verification Status: ${fpo.verificationStatus || 'UNDER REVIEW'} (Requires 'TNFI VERIFIED')`);
  }
  if (!hasAdequateData) {
    details.push(`Data Completeness: ${completeness.overallPercentage}% (Requires ≥ 80%)`);
  }
  if (!hasPassingScore) {
    details.push(`Performance Score: ${score.toFixed(1)}/100 (Requires ≥ 70.0)`);
  }

  if (isVerified && hasAdequateData && hasPassingScore) {
    return {
      isEligible: true,
      reason: 'Meets all constituent eligibility thresholds (TNFI Verified, ≥80% Data Completeness, ≥70 Score).',
      badge: 'ELIGIBLE',
      details: ['TNFI Platform Verified', `Data Completeness: ${completeness.overallPercentage}%`, `Composite Score: ${score.toFixed(1)}/100`],
      reasons: ['TNFI Platform Verified', `Data Completeness: ${completeness.overallPercentage}%`, `Composite Score: ${score.toFixed(1)}/100`]
    };
  }

  const primaryReason = !isVerified
    ? `FPO verification incomplete (Current: ${fpo.verificationStatus || 'UNDER REVIEW'})`
    : !hasAdequateData
    ? `Data completeness is ${completeness.overallPercentage}% (Minimum 80% required)`
    : `Performance score (${score.toFixed(1)}/100) below 70.0 threshold`;

  return {
    isEligible: false,
    reason: primaryReason,
    badge: 'NOT YET ELIGIBLE',
    details,
    reasons: details
  };
}

/**
 * Data Quality & Confidence Indicator Engine
 * Calculates data confidence tier (HIGH, MEDIUM, LOW) based on:
 * - Data Completeness % (40% weight)
 * - Statutory Verification Status (30% weight)
 * - Document Repository Verification Ratio (20% weight)
 * - Operational Telemetry Freshness & Audit (10% weight)
 */
export function calculateDataConfidence(fpo: Partial<FPO>): {
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number;
  label: string;
  reasons: string[];
  tooltipText: string;
} {
  const completeness = calculateDataCompleteness(fpo);
  const completenessScore = completeness.overallPercentage; // 0 - 100

  const isVerified = fpo.verificationStatus === 'VERIFIED';
  const isUnderReview = fpo.verificationStatus === 'UNDER REVIEW';
  const verificationScore = isVerified ? 100 : isUnderReview ? 65 : 35;

  const totalDocs = fpo.documents?.length || 1;
  const verifiedDocs = fpo.documents?.filter(d => d.status === 'VERIFIED').length || 0;
  const docScore = (verifiedDocs / Math.max(1, totalDocs)) * 100;

  const hasAudit = fpo.auditStatus && !fpo.auditStatus.toLowerCase().includes('pending');
  const auditScore = hasAudit ? 100 : 40;

  const weightedScore = Math.round(
    completenessScore * 0.40 +
    verificationScore * 0.30 +
    docScore * 0.20 +
    auditScore * 0.10
  );

  const reasons: string[] = [];

  if (completenessScore >= 85) {
    reasons.push(`${completenessScore}% profile & agricultural telemetry complete`);
  } else {
    reasons.push(`Missing telemetry in ${completeness.missingFields.length} statutory areas`);
  }

  if (isVerified) {
    reasons.push('TNFI Verification Desk approved with verified audit trail');
  } else if (isUnderReview) {
    reasons.push('Under active review by TNFI Verification Desk');
  } else {
    reasons.push('Statutory verification pending or requires update');
  }

  if (verifiedDocs > 0) {
    reasons.push(`${verifiedDocs} of ${totalDocs} supporting documents verified`);
  }

  if (weightedScore >= 80) {
    return {
      confidence: 'HIGH',
      score: weightedScore,
      label: 'High Confidence',
      reasons,
      tooltipText: 'High Data Confidence: Comprehensive profile telemetry, statutory documents vetted, and verified FPO status.'
    };
  } else if (weightedScore >= 55) {
    return {
      confidence: 'MEDIUM',
      score: weightedScore,
      label: 'Medium Confidence',
      reasons,
      tooltipText: 'Medium Data Confidence: Core agricultural figures submitted; verification in progress or select documents pending.'
    };
  } else {
    return {
      confidence: 'LOW',
      score: weightedScore,
      label: 'Low Confidence',
      reasons,
      tooltipText: 'Low Data Confidence: Incomplete statutory information or unverified preliminary self-reported draft data.'
    };
  }
}

/**
 * Validates FPO Agricultural & Financial Data Integrity
 * Checks for negative inputs, mathematical mismatches, and logical warnings
 */
export function validateFpoData(fpo: Partial<FPO>): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Non-negative checks
  if ((fpo.totalAcreage !== undefined && fpo.totalAcreage < 0) || (fpo.fundedAcres !== undefined && fpo.fundedAcres < 0)) {
    errors.push('Acreage cannot be a negative value.');
  }
  if (fpo.expectedHarvestTonnes !== undefined && fpo.expectedHarvestTonnes < 0) {
    errors.push('Expected harvest tonnage cannot be negative.');
  }
  if (fpo.cultivationFundingLakhs !== undefined && fpo.cultivationFundingLakhs < 0) {
    errors.push('Funding requirement cannot be negative.');
  }
  if (fpo.expectedYieldTonnesPerAcre !== undefined && fpo.expectedYieldTonnesPerAcre < 0) {
    errors.push('Yield per acre cannot be negative.');
  }

  // Portfolio level check
  if (fpo.cropPortfolio && fpo.cropPortfolio.length > 0) {
    fpo.cropPortfolio.forEach((c, idx) => {
      if ((c.acreage || c.acres || 0) < 0) {
        errors.push(`Crop #${idx + 1} (${c.cropName}): Acreage cannot be negative.`);
      }
      if ((c.marketPricePerQtl || 0) <= 0) {
        warnings.push(`Crop #${idx + 1} (${c.cropName}): Market price is missing or zero.`);
      }
      if ((c.expectedYieldTonnesPerAcre || 0) <= 0) {
        warnings.push(`Crop #${idx + 1} (${c.cropName}): Expected yield is zero.`);
      }
    });

    const sumAcreage = fpo.cropPortfolio.reduce((sum, c) => sum + (c.acreage || c.acres || 0), 0);
    const declaredAcreage = fpo.totalAcreage || fpo.fundedAcres || 0;
    if (declaredAcreage > 0 && Math.abs(sumAcreage - declaredAcreage) > (declaredAcreage * 0.25)) {
      warnings.push(`Sum of crop acreage (${sumAcreage} acres) deviates from total declared acreage (${declaredAcreage} acres).`);
    }
  }

  // Financial sanity checks
  if (fpo.revenueLakhs && fpo.costLakhs) {
    const expectedProfit = fpo.revenueLakhs - fpo.costLakhs;
    if (fpo.expectedProfitLakhs !== undefined && Math.abs(fpo.expectedProfitLakhs - expectedProfit) > 5) {
      warnings.push(`Reported profit (₹${fpo.expectedProfitLakhs}L) differs from (Revenue - Cost = ₹${expectedProfit.toFixed(1)}L).`);
    }
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
}

/**
 * Key Fundamental Drivers Explainer for FPO Performance Index
 * Derives top positive and negative operating drivers for investor & FPO transparency
 */
export function getFpoIndexKeyDrivers(fpo: Partial<FPO>): {
  positiveDrivers: Array<{ title: string; detail: string; score: number; impact: 'HIGH' | 'MEDIUM' }>;
  negativeDrivers: Array<{ title: string; detail: string; score: number; impact: 'HIGH' | 'MEDIUM' }>;
} {
  const factors = fpo.factorBreakdown || {
    marketPrice: 85,
    demand: 88,
    harvest: 82,
    profitability: 84,
    climate: 86,
    water: 80,
    buyerReadiness: 90,
    growth: 85
  };

  const positiveDrivers: Array<{ title: string; detail: string; score: number; impact: 'HIGH' | 'MEDIUM' }> = [];
  const negativeDrivers: Array<{ title: string; detail: string; score: number; impact: 'HIGH' | 'MEDIUM' }> = [];

  // Buyer Readiness
  if (factors.buyerReadiness >= 85) {
    positiveDrivers.push({
      title: 'Institutional Buyer Offtake Security',
      detail: `${fpo.buyerOfftakePercent || factors.buyerReadiness}% harvest committed with verified corporate buyers & escrow backup`,
      score: factors.buyerReadiness,
      impact: 'HIGH'
    });
  } else {
    negativeDrivers.push({
      title: 'Buyer Offtake Commitments Pending',
      detail: 'Offtake contract coverage is below benchmark threshold',
      score: factors.buyerReadiness,
      impact: 'MEDIUM'
    });
  }

  // Profitability
  if (factors.profitability >= 80) {
    positiveDrivers.push({
      title: 'Robust Operating Margin',
      detail: `Net operating profit margin of ${fpo.profitMarginPercent || fpo.profitMargin || 18.5}% supports working capital coverage`,
      score: factors.profitability,
      impact: 'HIGH'
    });
  } else {
    negativeDrivers.push({
      title: 'Input Cost Pressure',
      detail: 'Operating margins compressed due to cultivation input expenditures',
      score: factors.profitability,
      impact: 'HIGH'
    });
  }

  // Demand
  if (factors.demand >= 80) {
    positiveDrivers.push({
      title: 'Strong Mandi & Processor Demand',
      detail: `Favorable demand pressure index (${factors.demand}/100) across primary commodity cluster`,
      score: factors.demand,
      impact: 'MEDIUM'
    });
  } else {
    negativeDrivers.push({
      title: 'Soft Regional Procurement Demand',
      detail: 'Arrival volumes creating temporary market price resistance',
      score: factors.demand,
      impact: 'MEDIUM'
    });
  }

  // Water Security
  if (factors.water >= 80) {
    positiveDrivers.push({
      title: 'Water Security & Drip Coverage',
      detail: 'Low groundwater stress and high micro-irrigation network coverage',
      score: factors.water,
      impact: 'MEDIUM'
    });
  } else {
    negativeDrivers.push({
      title: 'Elevated Seasonal Water Stress',
      detail: 'Groundwater table depletion in district requires contingency irrigation',
      score: factors.water,
      impact: 'HIGH'
    });
  }

  // Climate
  if (factors.climate >= 80) {
    positiveDrivers.push({
      title: 'Optimal Agro-Climatic Suitability',
      detail: 'NDVI canopy health and seasonal rainfall deviation within safe bounds',
      score: factors.climate,
      impact: 'MEDIUM'
    });
  } else {
    negativeDrivers.push({
      title: 'Agro-Climate Weather Vulnerability',
      detail: 'Forecasted rainfall deficit requires crop resilience protocols',
      score: factors.climate,
      impact: 'MEDIUM'
    });
  }

  return {
    positiveDrivers,
    negativeDrivers
  };
}




