export type UserRole = 'admin' | 'fpo' | 'investor' | 'farmer';

export interface InvestorPreferences {
  investorType: 'Individual' | 'Institution' | 'Corporate' | 'Impact Investor' | 'Other' | string;
  preferredCrops: string[];
  preferredDistricts: string[];
  capitalRange: string;
  investmentHorizon: 'Short Term' | 'Medium Term' | 'Long Term' | string;
  riskPreference: 'Conservative' | 'Balanced' | 'Growth' | string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  fpoId?: string;
  fpoName?: string;
  orgName?: string;
  department?: string;
  adminId?: string;
  phone?: string;
  panCinNumber?: string;
  portfolioValue?: number;
  farmerId?: string;
  state?: string;
  district?: string;
  village?: string;
  primaryCrop?: string;
  secondaryCrops?: string[];
  acreage?: number;
  cultivatedAcreage?: number;
  expectedYield?: string | number;
  investorPreferences?: InvestorPreferences;
  joinedDate?: string;
  is2FAEnabled?: boolean;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
export type CreditRating = 'AAA' | 'AA+' | 'AA' | 'AA-' | 'A+' | 'A' | 'A-' | 'BBB+' | 'BBB';
export type SectorType =
  | 'Horticulture'
  | 'Paddy & Cereals'
  | 'Dairy & Livestock'
  | 'Spices & Plantation'
  | 'Coconut & Oilseeds'
  | 'Millets & Pulses';

export type VerificationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING'
  | 'UNDER REVIEW'
  | 'CHANGES REQUESTED'
  | 'VERIFIED'
  | 'REJECTED';

export interface FpoVerificationHistoryItem {
  id: string;
  action: 'SUBMITTED' | 'UNDER_REVIEW' | 'UNDER REVIEW' | 'CHANGES_REQUESTED' | 'CHANGES REQUESTED' | 'VERIFIED' | 'REJECTED' | 'DOCUMENT_UPDATED' | string;
  actionDate: string;
  actionTime?: string;
  performedBy: string;
  reason?: string;
  notes?: string;
}

export interface FpoDocumentItem {
  id: string;
  name?: string;
  title: string;
  category: string;
  status: 'VERIFIED' | 'SUBMITTED' | 'CHANGES_REQUESTED' | 'MISSING' | 'UNDER REVIEW' | string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  uploadedDate: string;
  isDemo?: boolean;
  notes?: string;
}

export interface AdminActivityItem {
  id: string;
  fpoId?: string;
  fpoName: string;
  fpoTicker?: string;
  ticker?: string;
  action: string;
  title?: string;
  description?: string;
  details: string;
  timestamp: string;
  timeAgo: string;
  performedBy?: string;
  type: 'SUCCESS' | 'WARNING' | 'INFO' | 'verification' | 'survey' | 'rebalance' | 'alert' | 'rejection' | 'changes' | 'document' | string;
  category?: 'VERIFICATION' | 'SURVEY' | 'DOCUMENTS' | 'INDEX' | string;
}

export interface DataCompletenessBreakdown {
  overallPercentage: number;
  totalScore: number;
  completedAreasCount: number;
  totalAreasCount: number;
  missingFields: string[];
  areas: {
    key: string;
    label: string;
    isComplete: boolean;
    status: 'COMPLETE' | 'INCOMPLETE' | 'MISSING';
    details: string;
  }[];
  breakdown?: Record<string, { present: boolean; status: string }>;
}

export interface TnfiScoreFactorBreakdown {
  financialHealth: number; // 20%
  growth: number;          // 15%
  profitability: number;   // 15%
  governance: number;      // 15%
  marketPosition: number;  // 15%
  agriStrength: number;    // 10%
  risk: number;            // 10% (higher means safer / lower risk)
}

export interface FpoFactorBreakdown {
  marketPrice: number;    // 0 - 100
  demand: number;         // 0 - 100
  harvest: number;        // 0 - 100
  profitability: number;  // 0 - 100
  climate: number;        // 0 - 100
  water: number;          // 0 - 100 (higher = better water security)
  buyerReadiness: number; // 0 - 100
  growth: number;         // 0 - 100
}

export interface FpoFinancials {
  revenueCr: number;
  ebitdaCr: number;
  patCr: number;
  netMarginPercent: number;
  operatingMarginPercent?: number;
  eps?: number;
  bookValuePerShare?: number;
  debtToEquity: number;
  roePercent?: number;
  returnOnEquityPercent?: number;
  currentRatio?: number;
  reserveFundsLakhs?: number;
  annualGrowthPercent: number;
  dividendYieldPercent?: number;
}

export interface FpoFundingRecord {
  id: string;
  fpoId: string;
  source: string;
  fundingType?: 'GRANT' | 'EQUITY' | 'DEBT' | 'WORKING_CAPITAL' | 'SUBSIDY' | string;
  amountLakhs: number;
  purpose: string;
  disbursementDate?: string;
  sanctionDate?: string;
  outstandingLakhs?: number;
  status?: 'REQUESTED' | 'APPROVED' | 'DISBURSED' | 'UTILISED' | 'REPAID' | string;
  utilizationPercent?: number;
  interestRatePercent?: number;
  tenureMonths?: number;
  facilityType?: string;
  disbursedPercent?: number;
}

export interface FpoCropItem {
  id: string;
  cropId?: string;
  cropName: string;
  acres?: number;
  acreage?: number;
  fundingLakhs?: number;
  cultivationCostPerAcre?: number;
  expectedYieldTonnesPerAcre?: number;
  expectedHarvestTonnes?: number;
  currentCropMarketPricePerQtl?: number;
  marketPricePerQtl?: number;
  harvestValueLakhs?: number;
  harvestValue?: number;
  revenueLakhs?: number;
  expectedRevenue?: number;
  costLakhs?: number;
  expectedProfitLakhs?: number;
  expectedProfit?: number;
  marginPercent?: number;
  demandScore?: number;
  climateScore?: number;
  climateSuitabilityScore?: number;
  waterRiskScore?: number;
  buyerOfftakePercent?: number;
  buyerName?: string;
  buyerReadinessPercent?: number;
  harvestDate?: string;
  risk?: RiskLevel;
}

export interface FpoChangeRequest {
  section: string;
  field: string;
  reason: string;
  requestedBy: string;
  requestedDate: string;
  status: 'PENDING_FPO_UPDATE' | 'RESOLVED';
}

export interface FPO {
  id: string;
  code?: string;
  name: string;
  ticker: string;
  district: string;
  state?: string;
  establishedYear?: number;
  sector: SectorType;
  totalFarmers?: number;
  farmerCount?: number;
  fundedAcres?: number;
  totalAcreage?: number;
  cultivationFundingLakhs?: number;
  expectedYieldTonnesPerAcre?: number;
  expectedHarvestTonnes?: number;
  currentCropMarketPrice?: number;
  harvestValueLakhs?: number;
  harvestValue?: number;
  harvestValueCr?: number;
  revenueLakhs?: number;
  revenueCr?: number;
  expectedRevenue?: number;
  costLakhs?: number;
  expectedProfitLakhs?: number;
  expectedProfit?: number;
  patCr?: number;
  profitMarginPercent?: number;
  profitMargin?: number;
  revenueGrowth?: number;
  indexWeight?: number;
  performanceScore?: number;
  tnfiScore?: number;
  rank?: number;
  fpoIndexValue?: number;
  financialScore?: number;
  financialHealthScore?: number;
  agriculturalScore?: number;
  agriculturalStrengthScore?: number;
  growthScore?: number;
  profitabilityScore?: number;
  waterRiskScore?: number;
  governanceScore?: number;
  marketPositionScore?: number;
  riskScore?: number;
  demandScore?: number;
  supplyPressureScore?: number;
  climateScore?: number;
  waterRisk?: number;
  buyerReadiness?: number;
  fpoPerformanceIndex?: number;
  performanceIndex?: number;
  indexChange24h?: number;
  perf1D?: number;
  perf1W?: number;
  perf1M?: number;
  perf3M?: number;
  perf1Y?: number;
  factorBreakdown?: FpoFactorBreakdown;
  primaryCrop: string;
  secondaryCrops?: string[];
  risk?: RiskLevel;
  riskLevel?: RiskLevel;
  riskRating?: 'LOW' | 'MEDIUM' | 'ELEVATED' | string;
  creditRating?: CreditRating;
  ceoName?: string;
  contactEmail?: string;
  contactPhone?: string;
  auditStatus?: string;
  financials?: FpoFinancials;
  cropPortfolio?: FpoCropItem[];
  fundingRecords?: FpoFundingRecord[];
  history?: Array<{
    date: string;
    indexValue: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volumeTonnes: number;
  }>;
  stockPrice?: number;
  marketCapCr?: number;
  change24h?: number;
  // Verification & Admin Workflow Fields
  verificationStatus?: VerificationStatus;
  submittedDate?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  verificationRemarks?: string;
  rejectionReason?: string;
  changeRequest?: FpoChangeRequest;
  dataConfidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  lastUpdated?: string;
  lastAdminAction?: string;
  lastActionDate?: string;
  lastActionBy?: string;
  surveyStatus?: 'Completed' | 'Pending' | 'Outdated' | 'In Review' | 'Changes Required';
  surveyCompletedDate?: string;
  documentsStatus?: 'All Submitted' | 'Verified' | 'Missing Documents' | 'Changes Required';
  documents?: FpoDocumentItem[];
  verificationHistory?: FpoVerificationHistoryItem[];
  isInTnfi50?: boolean;
  registrationId?: string;
  address?: string;
  formationDate?: string;
  authorizedPerson?: string;
  villagesCovered?: number;
  dataCompleteness?: number;
  primaryCommodity?: string;
  cinNumber?: string;
  panNumber?: string;
  yearEstablished?: number;
  statutoryAuditor?: string;
  totalMembers?: number;
  activeFarmers?: number;
  paidUpShareCapitalLakhs?: number;
  buyerOfftakePercent?: number;
  buyerNames?: string[];
  climateSuitabilityScore?: number;
  totalFundingRaised?: number;
  subScores?: TnfiScoreFactorBreakdown;
}

export interface Farmer {
  id: string;
  code: string;
  name: string;
  fpoId: string;
  fpoName: string;
  district: string;
  village: string;
  cropName: string;
  primaryCrop?: string;
  acres?: number;
  acreage?: number;
  landHoldingAcres?: number;
  fundingLakhs?: number;
  currentCropPricePerQtl?: number;
  expectedYieldTonnesPerAcre?: number;
  expectedHarvestTonnes: number;
  annualYieldTonnes?: number;
  expectedHarvestValueLakhs?: number;
  expectedIncomeRs?: number;
  cropHealthPercent: number;
  waterStatus?: 'Optimal' | 'Adequate' | 'Moderate Stress' | 'High Deficit' | string;
  climateStatus?: 'Favorable' | 'Mild Heatwave' | 'Rainfall Deficit' | 'Monsoon Alert' | string;
  nextAction?: string;
  soilMoisturePercent?: number;
  fertilizerSchedule?: string;
  shareholdingUnits: number;
  dividendsEarnedRs?: number;
  creditSanctionedLakhs: number;
  creditDisbursedLakhs: number;
  creditScore?: number;
  kycStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED' | string;
  joinedDate?: string;
  phone: string;
}

export interface BuyerOfftake {
  id: string;
  buyerName: string;
  type: 'Enterprise FMCG' | 'Agri Processor' | 'Export House' | 'Organics Retail' | string;
  cropName: string;
  crop?: string;
  fpoId: string;
  fpoName: string;
  contractQuantityTonnes: number;
  contractedVolumeTonnes?: number;
  agreedPricePerQtl: number;
  offtakeStatus?: 'FULFILLED' | 'IN_DELIVERY' | 'SCHEDULED' | 'PENDING_INSPECTION' | string;
  paymentStatus?: 'ESCROW_SECURED' | 'AAA_ON_TIME' | 'CURRENT' | 'IN_TRANSIT' | string;
  contractStatus?: 'ACTIVE' | 'PENDING_RENEWAL' | 'COMPLETED' | string;
  paymentTerms?: string;
  deliveryTerms?: string;
  counterpartyRating?: string;
  tenureMonths?: number;
  buyerReadiness?: number;
  readinessScore?: number;
  offtakeFulfillmentPercent?: number;
  contactPerson?: string;
  contactEmail?: string;
  deliveryTimeline?: string;
}

export interface DistrictData {
  id: string;
  name: string;
  tamilName?: string;
  xCoord: number;
  yCoord: number;
  activeFpos: number;
  totalFarmers: number;
  fundingCr: number;
  totalAcreage: number;
  harvestTonnes: number;
  harvestValueCr: number;
  profitCr: number;
  demandScore?: number;
  climateScore?: number;
  waterRiskScore?: number;
  avgFpoIndex?: number;
  primaryCrops: string[];
  marketCapCr?: number;
}

export interface CropMarketQuote {
  id: string;
  cropName: string;
  category: 'Cereal' | 'Cash Crop' | 'Horticulture' | 'Spices' | 'Oilseeds' | 'Pulses';
  modalPricePerQtl: number;
  minPricePerQtl: number;
  maxPricePerQtl: number;
  change24hPercent: number;
  arrivalTonnes: number;
  primaryMandi: string;
  mspBenchmarkPerQtl: number;
  demandPressureScore: number;
  harvestSeason: string;
  priceTrend: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
}

export interface DemandSignal {
  id: string;
  cropName: string;
  demandIndex: number;
  supplyIndex: number;
  demandPressure: number;
  inventoryLevel: 'Low' | 'Balanced' | 'High' | 'Surplus';
  procurementDemandTonnes: number;
  projectedPricePerQtl: number;
  status: 'OPPORTUNITY' | 'STRENGTHENING' | 'PRESSURE' | 'BALANCED';
  keyBuyers: string[];
  alertMessage: string;
}

export interface ClimateSignal {
  district: string;
  temperatureC: number;
  rainfallMm: number;
  rainfallDeviationPercent: number;
  humidityPercent: number;
  droughtRisk: 'Low' | 'Moderate' | 'Elevated' | 'Severe';
  floodRisk: 'Low' | 'Moderate' | 'High';
  cropStressIndex: number;
  climateScore: number;
  forecast7Day: string;
  advisory: string;
}

export interface WaterSignal {
  district: string;
  waterAvailabilityIndex: number;
  irrigationCoveragePercent: number;
  groundwaterDepthMeters: number;
  groundwaterStatus: 'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited';
  waterStressScore: number;
  seasonalRequirementMCM: number;
  waterRiskIndex: number;
  reservoirLevelPercent: number;
  waterAdvisory: string;
}

export interface FundingFlowRecord {
  id: string;
  fpoId: string;
  fpoName: string;
  cropName: string;
  district: string;
  sanctionedLakhs: number;
  disbursedLakhs: number;
  outstandingLakhs: number;
  expectedRecoveryLakhs: number;
  recoveryRatePercent: number;
  status: 'DISBURSED' | 'IN_CULTIVATION' | 'HARVEST_RECOVERY' | 'SETTLED';
  disbursalDate: string;
  harvestDate: string;
}

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  type: 'trade' | 'harvest' | 'climate' | 'water' | 'demand' | 'funding' | 'index' | 'dividend' | string;
  targetView?: string;
  targetId?: string;
  time: string;
  read: boolean;
}

export interface AgriMarketSimulatorState {
  cropName: string;
  cropPricePerQtl: number;
  baseCropPricePerQtl: number;
  fundedAcres: number;
  baseFundedAcres: number;
  expectedYieldTonnesPerAcre: number;
  baseExpectedYield: number;
  demandScore: number;
  baseDemandScore: number;
  climateScore: number;
  baseClimateScore: number;
  waterRiskScore: number;
  baseWaterRiskScore: number;
  buyerReadinessPercent: number;
  baseBuyerReadiness: number;
  projectedIndexTarget?: number;
  avgRevenueGrowthPercent?: number;
  ebitdaMultiple?: number;
  interestRatePercent?: number;
  institutionalInflowCr?: number;
  [key: string]: any;
}

export type FpoMarketSimulatorState = AgriMarketSimulatorState;

export interface FpoStock {
  id: string;
  ticker: string;
  name: string;
  district: string;
  state?: string;
  sector: SectorType;
  primaryCrop?: string;
  currentPrice?: number;
  price?: number;
  changeValue?: number;
  changePercent?: number;
  change24h?: number;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  yearHigh?: number;
  yearLow?: number;
  volumeUnits?: number;
  volumeTonnes?: number;
  marketCapCr: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYieldPercent?: number;
  creditRating: CreditRating;
  tnfiScore?: number;
  totalMembers?: number;
  totalAcreage?: number;
  establishedYear?: number;
  ceoName?: string;
  contactEmail?: string;
  auditStatus?: string;
  governanceScore?: number;
  riskLevel?: RiskLevel;
  risk?: RiskLevel;
  fpoIndex?: number;
  revenueCr?: number;
  profitCr?: number;
  financials: FpoFinancials;
  priceHistory?: Array<{ time: string; price: number; volume: number }>;
  history?: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volumeTonnes: number;
  }>;
}

export interface TnfiIndexData {
  indexValue: number;
  currentValue?: number;
  changeValue?: number;
  changeAmount?: number;
  changePercent: number;
  change24h?: number;
  change24hPoints?: number;
  dayHigh: number;
  dayLow: number;
  prevClose?: number;
  yearHigh?: number;
  yearLow?: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  totalMarketCapCr: number;
  totalMembers?: number;
  listedFposCount?: number;
  volumeTonnes?: number;
  advances?: number;
  declines?: number;
  unchanged?: number;
  projectedIndexTarget?: number;
  sectorWeights?: Array<{
    sector: SectorType;
    weightPercent: number;
    return24h: number;
    marketCapCr: number;
    fpoCount: number;
  }>;
  history?: Array<{
    date: string;
    indexValue?: number;
    value?: number;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    volume?: number;
    volumeTonnes?: number;
  }>;
}

export interface PortfolioHolding {
  id: string;
  ticker: string;
  fpoName?: string;
  name?: string;
  assetType?: string;
  units?: number;
  quantity?: number;
  totalUnits?: number;
  avgBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  investedValue?: number;
  investedAmount?: number;
  unrealizedPnL?: number;
  unrealizedProfit?: number;
  unrealizedPnLPercent?: number;
  returnPercent?: number;
  allocationPercent?: number;
  sector: SectorType;
  dividendYieldPercent?: number;
}

export interface PortfolioTransaction {
  id: string;
  type: string;
  ticker: string;
  name?: string;
  fpoName?: string;
  units?: number;
  quantity?: number;
  price: number;
  totalAmount: number;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'SETTLED' | string;
  txHash?: string;
}

export interface ExpressionOfInterest {
  id: string;
  fpoId: string;
  fpoName: string;
  ticker?: string;
  crop: string;
  district?: string;
  opportunityId?: string;
  opportunityTitle?: string;
  investorName: string;
  organisation?: string;
  investorEntity?: string;
  email?: string;
  investorEmail?: string;
  phone?: string;
  interestedAmountLakhs: number;
  message?: string;
  notes?: string;
  proposedStructure?: string;
  submittedDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_DISCUSSION' | 'DECLINED';
}

export interface CapitalOpportunity {
  id: string;
  fpoId: string;
  fpoName: string;
  ticker: string;
  district: string;
  crop: string;
  title: string;
  fundingRequiredLakhs: number;
  purpose: string;
  description?: string;
  fundedAcres: number;
  expectedHarvestTonnes: number;
  expectedRevenueLakhs: number;
  expectedProfitLakhs: number;
  profitMarginPercent: number;
  demandScore: number;
  demandLevel: 'HIGH' | 'MODERATE' | 'STABLE';
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED';
  performanceIndex: number;
  status: 'FUNDING REQUESTED' | 'UNDER EVALUATION' | 'ACTIVE' | 'CLOSED';
  stage?: string;
  instrumentType?: string;
  targetAmountLakhs?: number;
  committedAmountLakhs?: number;
  minAllocationLakhs?: number;
  projectedIrrPercent?: number;
  farmerBeneficiaries?: number;
  offtakeBuyer?: string;
  buyerReadiness: number;
  createdDate: string;
  tenureMonths?: number;
  expectedReturnPercent?: number;
  strengths?: string[];
  risks?: string[];
  dataCompleteness?: number;
}

export interface CapitalRaiseCampaign {
  id: string;
  fpoId: string;
  fpoName: string;
  ticker: string;
  district: string;
  purpose?: string;
  cropFocus?: string;
  targetRaiseCr?: number;
  targetAmountCr?: number;
  raisedSoFarCr?: number;
  raisedAmountCr?: number;
  minTicketRs?: number;
  minInvestment?: number;
  pricePerShare?: number;
  unitPrice?: number;
  expectedYieldPercent?: number;
  expectedAnnualYieldPercent?: number;
  tenureMonths?: number;
  daysRemaining?: number;
  deadline?: string;
  investorsCount?: number;
  subscribersCount?: number;
  rating?: CreditRating;
  creditRating?: CreditRating;
  instrumentType?: string;
  sector?: SectorType;
  valuationCr?: number;
  status: 'LIVE' | 'UPCOMING' | 'CLOSED' | string;
}

export interface FpoAiEvaluation {
  fpoId: string;
  ticker: string;
  compositeScore?: number;
  compositeTnfiScore?: number;
  rating?: CreditRating;
  riskTier?: RiskLevel;
  productionEfficiency?: number;
  governanceTransparency?: number;
  marketOfftakeSecurity?: number;
  climateWaterResilience?: number;
  financialSolvency?: number;
  summary?: string;
  strengths?: string[];
  vulnerabilities?: string[];
  recommendation?: 'STRONG BUY' | 'BUY' | 'HOLD' | 'REDUCE' | string;
  performancePrediction?: {
    predictedRevenueGrowth1Y: number;
    predictedPatGrowth1Y: number;
    confidenceScore: number;
    algorithm: string;
  };
  riskAssessment?: {
    riskGrade: string;
    probabilityOfDefaultPercent: number;
    governanceStabilityScore: number;
  };
  anomalyDetection?: {
    anomaliesFound: number;
    status: string;
    details: string;
  };
  topDrivers?: Array<{
    name: string;
    category: string;
    weight: number;
    score: number;
    impact: string;
  }>;
}

export interface AiInsight {
  id: string;
  type?: string;
  headline?: string;
  explanation?: string;
  title?: string;
  category?: string;
  impact?: string;
  district?: string;
  fpoId?: string;
  targetTicker?: string;
  urgency?: string;
  recommendedAction?: string;
  actionableInsight?: string;
  timestamp: string;
  summary?: string;
}
