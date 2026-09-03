import {
  FpoStock,
  TnfiIndexData,
  PortfolioHolding,
  PortfolioTransaction,
  CapitalRaiseCampaign,
  FpoAiEvaluation,
  FPO,
  Farmer,
  DistrictData,
  BuyerOfftake,
  AiInsight,
  PlatformNotification,
  CapitalOpportunity,
  ExpressionOfInterest
} from '../types';
import { TNFI_50_FPOS, TNFI_50_STOCKS } from './tnfi50Data';

export const TNFI_INDEX_DATA: TnfiIndexData = {
  indexValue: 1245.68,
  changeValue: 18.42,
  changePercent: 1.50,
  dayHigh: 1248.90,
  dayLow: 1220.45,
  prevClose: 1227.26,
  yearHigh: 1380.00,
  yearLow: 980.50,
  peRatio: 12.8,
  pbRatio: 1.94,
  dividendYield: 5.62,
  totalMarketCapCr: 1845.6,
  totalMembers: 134200,
  listedFposCount: 50,
  sectorWeights: [
    { sector: 'Horticulture', weightPercent: 28.0, return24h: 2.1, marketCapCr: 516.8, fpoCount: 14 },
    { sector: 'Paddy & Cereals', weightPercent: 24.0, return24h: 1.4, marketCapCr: 442.9, fpoCount: 11 },
    { sector: 'Spices & Plantation', weightPercent: 18.0, return24h: 2.3, marketCapCr: 332.2, fpoCount: 9 },
    { sector: 'Coconut & Oilseeds', weightPercent: 14.0, return24h: 1.1, marketCapCr: 258.4, fpoCount: 7 },
    { sector: 'Dairy & Livestock', weightPercent: 10.0, return24h: 1.6, marketCapCr: 184.6, fpoCount: 5 },
    { sector: 'Millets & Pulses', weightPercent: 6.0, return24h: 0.9, marketCapCr: 110.7, fpoCount: 4 }
  ],
  history: [
    { date: 'Aug 08', indexValue: 1210.20, open: 1205.00, high: 1215.40, low: 1202.10, close: 1210.20, volume: 14200 },
    { date: 'Aug 09', indexValue: 1218.60, open: 1205.00, high: 1222.00, low: 1208.50, close: 1218.60, volume: 18500 },
    { date: 'Aug 10', indexValue: 1224.30, open: 1218.60, high: 1228.10, low: 1216.00, close: 1224.30, volume: 22100 },
    { date: 'Aug 11', indexValue: 1220.10, open: 1224.30, high: 1226.50, low: 1215.20, close: 1220.10, volume: 16400 },
    { date: 'Aug 12', indexValue: 1232.80, open: 1220.10, high: 1236.40, low: 1219.00, close: 1232.80, volume: 24800 },
    { date: 'Aug 13', indexValue: 1227.26, open: 1232.80, high: 1235.00, low: 1224.80, close: 1227.26, volume: 19700 },
    { date: 'Aug 14', indexValue: 1245.68, open: 1228.50, high: 1248.90, low: 1220.45, close: 1245.68, volume: 31200 }
  ]
};

export const LISTED_FPO_STOCKS: FpoStock[] = TNFI_50_STOCKS;

export const INITIAL_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'hold-1',
    ticker: 'TNFI-ETF',
    name: 'TNFI Top 24 FPO Index Fund Unit',
    assetType: 'TNFI ETF (Index Unit)',
    quantity: 1200,
    avgBuyPrice: 1180.50,
    currentPrice: 1245.68,
    investedValue: 1416600,
    currentValue: 1494816,
    unrealizedProfit: 78216,
    returnPercent: 5.52,
    dividendYieldPercent: 5.62,
    sector: 'Horticulture'
  },
  {
    id: 'hold-2',
    ticker: 'KAVERI',
    name: 'Kaveri Horticulture FPO Ltd',
    assetType: 'FPO Equity',
    quantity: 2500,
    avgBuyPrice: 122.00,
    currentPrice: 142.50,
    investedValue: 305000,
    currentValue: 356250,
    unrealizedProfit: 51250,
    returnPercent: 16.80,
    dividendYieldPercent: 5.4,
    sector: 'Horticulture'
  },
  {
    id: 'hold-3',
    ticker: 'NILGIRI',
    name: 'Nilgiris Dairy & Green Tea FPO',
    assetType: 'FPO Equity',
    quantity: 1000,
    avgBuyPrice: 188.40,
    currentPrice: 215.80,
    investedValue: 188400,
    currentValue: 215800,
    unrealizedProfit: 27400,
    returnPercent: 14.54,
    dividendYieldPercent: 4.8,
    sector: 'Dairy & Livestock'
  },
  {
    id: 'hold-4',
    ticker: 'CDELTA',
    name: 'Cauvery Delta Paddy Farmers FPO',
    assetType: 'FPO Equity',
    quantity: 3000,
    avgBuyPrice: 91.00,
    currentPrice: 98.20,
    investedValue: 273000,
    currentValue: 294600,
    unrealizedProfit: 21600,
    returnPercent: 7.91,
    dividendYieldPercent: 6.2,
    sector: 'Paddy & Cereals'
  },
  {
    id: 'hold-5',
    ticker: 'KONGU-BOND-28',
    name: 'Kongu Cold-Storage 9.25% Agri-Bond',
    assetType: 'Agri-Infrastructure Bond',
    quantity: 120,
    avgBuyPrice: 10000,
    currentPrice: 10250,
    investedValue: 1200000,
    currentValue: 1230000,
    unrealizedProfit: 30000,
    returnPercent: 2.50,
    dividendYieldPercent: 9.25,
    sector: 'Coconut & Oilseeds'
  }
];

export const INITIAL_TRANSACTIONS: PortfolioTransaction[] = [
  {
    id: 'tx-1',
    timestamp: '2026-08-14 11:32 AM',
    ticker: 'KAVERI',
    name: 'Kaveri Horticulture FPO Ltd',
    type: 'BUY',
    quantity: 500,
    price: 141.20,
    totalAmount: 70600,
    status: 'EXECUTED'
  },
  {
    id: 'tx-2',
    timestamp: '2026-08-13 02:15 PM',
    ticker: 'TNFI-ETF',
    name: 'TNFI Top 24 FPO Index Fund',
    type: 'BUY',
    quantity: 200,
    price: 1228.40,
    totalAmount: 245680,
    status: 'EXECUTED'
  },
  {
    id: 'tx-3',
    timestamp: '2026-08-11 10:00 AM',
    ticker: 'CDELTA',
    name: 'Cauvery Delta Paddy Farmers FPO',
    type: 'DIVIDEND_PAYOUT',
    quantity: 3000,
    price: 5.80,
    totalAmount: 17400,
    status: 'SETTLED'
  },
  {
    id: 'tx-4',
    timestamp: '2026-08-08 03:45 PM',
    ticker: 'NILGIRI',
    name: 'Nilgiris Dairy & Green Tea FPO',
    type: 'BUY',
    quantity: 400,
    price: 208.50,
    totalAmount: 83400,
    status: 'EXECUTED'
  }
];

export const CAPITAL_RAISE_CAMPAIGNS: CapitalRaiseCampaign[] = [
  {
    id: 'ipo-1',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    ticker: 'KAVERI',
    sector: 'Horticulture',
    district: 'Tiruppur',
    instrumentType: 'Growth Equity (Series A)',
    targetAmountCr: 5.0,
    raisedAmountCr: 4.25,
    minInvestment: 25000,
    unitPrice: 140.00,
    valuationCr: 24.0,
    purpose: 'Expanding IQF blast-freezing plant & automated banana ripening chambers to serve export buyers.',
    status: 'CLOSING_SOON',
    deadline: 'Aug 25, 2026',
    investorsCount: 382,
    creditRating: 'AAA'
  },
  {
    id: 'ipo-2',
    fpoId: 'fpo-1004',
    fpoName: 'Kongu Coconut & Oilseed Producers FPO',
    ticker: 'KONGU',
    sector: 'Coconut & Oilseeds',
    district: 'Coimbatore',
    instrumentType: 'Agri-Infra Bond',
    targetAmountCr: 8.0,
    raisedAmountCr: 5.60,
    minInvestment: 50000,
    tenureMonths: 36,
    expectedYieldPercent: 9.40,
    unitPrice: 10000,
    valuationCr: 32.0,
    purpose: 'Constructing 2,500 MT solar-powered desiccated coconut & virgin cold-press refinery.',
    status: 'OPEN',
    deadline: 'Sep 10, 2026',
    investorsCount: 540,
    creditRating: 'AA+'
  },
  {
    id: 'ipo-3',
    fpoId: 'fpo-1003',
    fpoName: 'Nilgiris Dairy & Green Tea FPO',
    ticker: 'NILGIRI',
    sector: 'Dairy & Livestock',
    district: 'Nilgiris',
    instrumentType: 'Growth Equity (Series A)',
    targetAmountCr: 4.0,
    raisedAmountCr: 4.0,
    minInvestment: 20000,
    unitPrice: 210.00,
    valuationCr: 20.0,
    purpose: 'Direct-to-consumer A2 milk bottling and cold-chain refrigerated delivery fleet in Coimbatore & Chennai.',
    status: 'OVER_SUBSCRIBED',
    deadline: 'Aug 18, 2026',
    investorsCount: 620,
    creditRating: 'AAA'
  },
  {
    id: 'ipo-4',
    fpoId: 'fpo-1005',
    fpoName: 'Madurai Jasmine & Floriculture FPO',
    ticker: 'MADURAI',
    sector: 'Horticulture',
    district: 'Madurai',
    instrumentType: 'Working Capital Green Note',
    targetAmountCr: 3.0,
    raisedAmountCr: 1.80,
    minInvestment: 15000,
    tenureMonths: 18,
    expectedYieldPercent: 8.90,
    unitPrice: 5000,
    valuationCr: 16.5,
    purpose: 'Daily spot auction liquidity support and international air cargo cold-transit packaging.',
    status: 'OPEN',
    deadline: 'Sep 30, 2026',
    investorsCount: 290,
    creditRating: 'AA'
  }
];

export const AI_EVALUATIONS: FpoAiEvaluation[] = [
  {
    fpoId: 'fpo-1001',
    ticker: 'KAVERI',
    compositeTnfiScore: 92,
    performancePrediction: {
      predictedRevenueGrowth1Y: 28.4,
      predictedPatGrowth1Y: 31.2,
      confidenceScore: 94.6,
      algorithm: 'LightGBM Regression v3.2'
    },
    riskAssessment: {
      riskGrade: 'LOW RISK',
      probabilityOfDefaultPercent: 0.42,
      governanceStabilityScore: 96
    },
    anomalyDetection: {
      anomaliesFound: 0,
      status: 'CLEAN',
      details: 'All financial submissions, GST reconciliations, and member patronage bonuses pass automated cross-validation.'
    },
    topDrivers: [
      { name: 'Revenue per Member Growth', category: 'Financial', weight: 0.28, score: 94, impact: 'POSITIVE' },
      { name: 'Buyer Escrow Fulfillment %', category: 'Market Reach', weight: 0.24, score: 98, impact: 'POSITIVE' },
      { name: 'Board Independence & AGM Audits', category: 'Governance', weight: 0.22, score: 96, impact: 'POSITIVE' },
      { name: 'Debt Service Coverage Ratio (3.8x)', category: 'Financial', weight: 0.16, score: 91, impact: 'POSITIVE' },
      { name: 'Digital Ledger Adoption', category: 'Operational', weight: 0.10, score: 88, impact: 'POSITIVE' }
    ]
  },
  {
    fpoId: 'fpo-1002',
    ticker: 'CDELTA',
    compositeTnfiScore: 89,
    performancePrediction: {
      predictedRevenueGrowth1Y: 22.1,
      predictedPatGrowth1Y: 24.5,
      confidenceScore: 92.1,
      algorithm: 'LightGBM Regression v3.2'
    },
    riskAssessment: {
      riskGrade: 'LOW RISK',
      probabilityOfDefaultPercent: 0.68,
      governanceStabilityScore: 91
    },
    anomalyDetection: {
      anomaliesFound: 0,
      status: 'CLEAN',
      details: 'Samba harvest procurement contracts verified with Food Corporation of India and private rice mills.'
    },
    topDrivers: [
      { name: 'Member Base Scale (2,180 farmers)', category: 'Operational', weight: 0.30, score: 95, impact: 'POSITIVE' },
      { name: 'Government MSP Procurement Lock', category: 'Market Reach', weight: 0.25, score: 93, impact: 'POSITIVE' },
      { name: 'Operating Margin Consistency', category: 'Financial', weight: 0.25, score: 86, impact: 'POSITIVE' },
      { name: 'Patronage Bonus Distribution', category: 'Governance', weight: 0.20, score: 88, impact: 'POSITIVE' }
    ]
  }
];

export const INITIAL_FPOS: FPO[] = TNFI_50_FPOS;

export const INITIAL_FARMERS: Farmer[] = [
  {
    id: 'f-101',
    code: 'F-24081',
    name: 'S. Ramasamy',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    district: 'Coimbatore',
    village: 'Palladam',
    cropName: 'Groundnut (TMV-7)',
    acreage: 4.5,
    expectedHarvestTonnes: 5.4,
    cropHealthPercent: 94,
    shareholdingUnits: 450,
    dividendsEarnedRs: 12850,
    creditSanctionedLakhs: 2.5,
    creditDisbursedLakhs: 2.5,
    phone: '+91 94431 82710'
  },
  {
    id: 'f-104',
    code: 'F-24084',
    name: 'P. Subramanian',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    district: 'Coimbatore',
    village: 'Sulur',
    cropName: 'Grand Naine Banana',
    acreage: 5.0,
    expectedHarvestTonnes: 42.0,
    cropHealthPercent: 96,
    shareholdingUnits: 500,
    dividendsEarnedRs: 15400,
    creditSanctionedLakhs: 3.0,
    creditDisbursedLakhs: 3.0,
    phone: '+91 98422 33411'
  },
  {
    id: 'f-105',
    code: 'F-24085',
    name: 'V. Murugesan',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    district: 'Coimbatore',
    village: 'Pollachi North',
    cropName: 'Hybrid Cotton',
    acreage: 3.5,
    expectedHarvestTonnes: 4.2,
    cropHealthPercent: 92,
    shareholdingUnits: 350,
    dividendsEarnedRs: 9800,
    creditSanctionedLakhs: 1.8,
    creditDisbursedLakhs: 1.8,
    phone: '+91 94421 90876'
  },
  {
    id: 'f-106',
    code: 'F-24086',
    name: 'K. Meenakshi',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    district: 'Coimbatore',
    village: 'Kinathukadavu',
    cropName: 'Turmeric (Salem Hybrid)',
    acreage: 2.8,
    expectedHarvestTonnes: 8.4,
    cropHealthPercent: 95,
    shareholdingUnits: 280,
    dividendsEarnedRs: 11200,
    creditSanctionedLakhs: 2.0,
    creditDisbursedLakhs: 2.0,
    phone: '+91 97880 14523'
  },
  {
    id: 'f-107',
    code: 'F-24087',
    name: 'T. Palaniswamy',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    district: 'Coimbatore',
    village: 'Annur',
    cropName: 'Groundnut (TMV-7)',
    acreage: 6.2,
    expectedHarvestTonnes: 7.8,
    cropHealthPercent: 90,
    shareholdingUnits: 620,
    dividendsEarnedRs: 17500,
    creditSanctionedLakhs: 3.5,
    creditDisbursedLakhs: 3.5,
    phone: '+91 94435 67891'
  },
  {
    id: 'f-102',
    code: 'F-24082',
    name: 'M. Selvaraj',
    fpoId: 'fpo-1002',
    fpoName: 'Cauvery Delta Paddy Farmers FPO',
    district: 'Thanjavur',
    village: 'Orathanadu',
    cropName: 'Paddy Samba CR1009',
    acreage: 6.0,
    expectedHarvestTonnes: 26,
    cropHealthPercent: 91,
    shareholdingUnits: 600,
    dividendsEarnedRs: 18400,
    creditSanctionedLakhs: 3.2,
    creditDisbursedLakhs: 3.2,
    phone: '+91 94862 10934'
  },
  {
    id: 'f-103',
    code: 'F-24083',
    name: 'K. Lakshmi',
    fpoId: 'fpo-1003',
    fpoName: 'Nilgiris Dairy & Green Tea FPO',
    district: 'Nilgiris',
    village: 'Kotagiri',
    cropName: 'Organic Green Tea & Dairy',
    acreage: 3.2,
    expectedHarvestTonnes: 14,
    cropHealthPercent: 96,
    shareholdingUnits: 320,
    dividendsEarnedRs: 15600,
    creditSanctionedLakhs: 2.0,
    creditDisbursedLakhs: 2.0,
    phone: '+91 94420 55192'
  },
  {
    id: 'f-108',
    code: 'F-24088',
    name: 'R. Soundararajan',
    fpoId: 'fpo-1004',
    fpoName: 'Kongu Coconut & Oilseed Producers FPO',
    district: 'Coimbatore',
    village: 'Pollachi South',
    cropName: 'Tall x Dwarf Hybrid Coconut',
    acreage: 8.0,
    expectedHarvestTonnes: 48,
    cropHealthPercent: 95,
    shareholdingUnits: 800,
    dividendsEarnedRs: 24000,
    creditSanctionedLakhs: 4.5,
    creditDisbursedLakhs: 4.5,
    phone: '+91 94433 22110'
  }
];

export const INITIAL_DISTRICTS: DistrictData[] = [
  {
    id: 'dist-cbe',
    name: 'Coimbatore',
    tamilName: 'கோயம்புத்தூர்',
    xCoord: 28,
    yCoord: 52,
    activeFpos: 6,
    totalFarmers: 42500,
    fundingCr: 68.4,
    totalAcreage: 48000,
    harvestTonnes: 124000,
    harvestValueCr: 410.5,
    profitCr: 122.8,
    marketCapCr: 840.0,
    primaryCrops: ['Coconut', 'Groundnut', 'Dairy', 'Poultry']
  },
  {
    id: 'dist-thanj',
    name: 'Thanjavur',
    tamilName: 'தஞ்சாவூர்',
    xCoord: 62,
    yCoord: 58,
    activeFpos: 5,
    totalFarmers: 58200,
    fundingCr: 84.2,
    totalAcreage: 72000,
    harvestTonnes: 215000,
    harvestValueCr: 540.2,
    profitCr: 168.0,
    marketCapCr: 920.5,
    primaryCrops: ['Paddy Samba', 'Kuruvai', 'Pulses', 'Banana']
  },
  {
    id: 'dist-nilgiri',
    name: 'Nilgiris',
    tamilName: 'நீலகிரி',
    xCoord: 24,
    yCoord: 44,
    activeFpos: 3,
    totalFarmers: 18900,
    fundingCr: 32.0,
    totalAcreage: 21000,
    harvestTonnes: 48000,
    harvestValueCr: 210.0,
    profitCr: 74.5,
    marketCapCr: 420.0,
    primaryCrops: ['Tea', 'Dairy', 'Exotic Vegetables']
  },
  {
    id: 'dist-erode',
    name: 'Erode',
    tamilName: 'ஈரோடு',
    xCoord: 34,
    yCoord: 48,
    activeFpos: 4,
    totalFarmers: 36400,
    fundingCr: 52.8,
    totalAcreage: 39000,
    harvestTonnes: 94000,
    harvestValueCr: 320.0,
    profitCr: 96.0,
    marketCapCr: 560.0,
    primaryCrops: ['Turmeric', 'Sugarcane', 'Millets', 'Banana']
  },
  {
    id: 'dist-madurai',
    name: 'Madurai',
    tamilName: 'மதுரை',
    xCoord: 46,
    yCoord: 70,
    activeFpos: 4,
    totalFarmers: 31200,
    fundingCr: 44.5,
    totalAcreage: 32000,
    harvestTonnes: 68000,
    harvestValueCr: 260.0,
    profitCr: 82.0,
    marketCapCr: 480.0,
    primaryCrops: ['Jasmine', 'Pulses', 'Cotton', 'Millets']
  }
];

export const INITIAL_BUYERS: BuyerOfftake[] = [
  {
    id: 'buy-1',
    buyerName: 'ITC Agri Business Division',
    type: 'Enterprise FMCG',
    cropName: 'Paddy & Wheat Flour',
    fpoId: 'fpo-1002',
    fpoName: 'Cauvery Delta Paddy Farmers FPO',
    contractQuantityTonnes: 12000,
    agreedPricePerQtl: 2480,
    offtakeFulfillmentPercent: 98.4,
    paymentStatus: 'AAA_ON_TIME',
    readinessScore: 98
  },
  {
    id: 'buy-2',
    buyerName: 'Marico Consumer Care Ltd',
    type: 'Enterprise FMCG',
    cropName: 'Groundnut & Copra',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    contractQuantityTonnes: 3200,
    agreedPricePerQtl: 6850,
    offtakeFulfillmentPercent: 96.5,
    paymentStatus: 'AAA_ON_TIME',
    readinessScore: 95
  },
  {
    id: 'buy-3',
    buyerName: 'WayCool Foods & Products',
    type: 'Agri Processor',
    cropName: 'Grand Naine Bananas',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    contractQuantityTonnes: 6400,
    agreedPricePerQtl: 2950,
    offtakeFulfillmentPercent: 94.2,
    paymentStatus: 'ESCROW_SECURED',
    readinessScore: 92
  },
  {
    id: 'buy-4',
    buyerName: 'Everest Spices & Seasonings',
    type: 'Enterprise FMCG',
    cropName: 'Turmeric (Salem Hybrid)',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    contractQuantityTonnes: 1100,
    agreedPricePerQtl: 13400,
    offtakeFulfillmentPercent: 92.0,
    paymentStatus: 'ESCROW_SECURED',
    readinessScore: 90
  },
  {
    id: 'buy-5',
    buyerName: 'Falcon Exim Gulf Trade',
    type: 'Institutional Exporter',
    cropName: 'Grand Naine Bananas & Vegetables',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    contractQuantityTonnes: 2400,
    agreedPricePerQtl: 3200,
    offtakeFulfillmentPercent: 88.0,
    paymentStatus: 'ESCROW_SECURED',
    readinessScore: 88
  }
];

export const INITIAL_INSIGHTS: AiInsight[] = [
  {
    id: 'ins-1',
    type: 'FPO_EARNINGS',
    headline: 'Kaveri Horticulture Q2 Net Profit Jumps +31.2% YoY',
    explanation: 'Surge in export-grade cold-stored banana shipments to Gulf markets expanded EBITDA margins from 11.2% to 14.2%.',
    impact: 'Upward earnings revision with TNFI composite score rising to 92/100.',
    recommendedAction: 'Accumulate KAVERI stock units or allocate to TNFI Horticulture sub-basket.',
    urgency: 'HIGH',
    timestamp: '28 mins ago',
    targetTicker: 'KAVERI'
  },
  {
    id: 'ins-2',
    type: 'INDEX_REBALANCE',
    headline: 'TNFI Index Semi-Annual Rebalancing: Dairy Sector Weight Increased',
    explanation: 'Due to steady year-round cash flows and premium pricing in A2 milk cooperatives, dairy weight increased from 15% to 18%.',
    impact: 'Institutional capital inflows of ₹42 Cr anticipated into NILGIRI and NAMAKKAL equities.',
    recommendedAction: 'Rebalance portfolio towards updated benchmark weights.',
    urgency: 'MEDIUM',
    timestamp: '2 hours ago',
    targetTicker: 'TNFI-ETF'
  },
  {
    id: 'ins-3',
    type: 'IPO_ALERT',
    headline: 'Kongu Coconut Launches ₹8 Cr Agri-Infra 9.40% Green Bond',
    explanation: 'Fully backed by 2,500 MT warehouse assets with credit rating of AA+ from ICRA/CRISIL.',
    impact: 'Provides guaranteed quarterly yield with priority liquidation preference.',
    recommendedAction: 'Subscribe via Capital Raise primary portal.',
    urgency: 'INFO',
    timestamp: '5 hours ago',
    targetTicker: 'KONGU'
  }
];

export const INITIAL_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'notif-1',
    title: 'Trade Executed: 500 KAVERI @ ₹141.20',
    message: 'Your buy limit order for Kaveri Horticulture FPO units was filled on the TNFI matching engine.',
    type: 'trade',
    targetView: 'portfolio',
    time: '11:32 AM',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Dividend Received: ₹17,400 from CDELTA',
    message: 'Cauvery Delta Paddy FPO annual dividend has been credited to your investment cash wallet.',
    type: 'dividend',
    targetView: 'portfolio',
    time: 'Yesterday',
    read: false
  },
  {
    id: 'notif-3',
    title: 'TNFI Index Hits New All-Time High of 1,248.90',
    message: 'Broad-based rally across Horticulture (+2.4%) and Coconut (+3.1%) constituents drove the surge.',
    type: 'index',
    targetView: 'market-index',
    time: 'Aug 14',
    read: true
  }
];

export const INITIAL_CAPITAL_OPPORTUNITIES: CapitalOpportunity[] = [
  {
    id: 'opp-1',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    ticker: 'KAVERI',
    district: 'Coimbatore',
    crop: 'Groundnut (TMV-7)',
    title: 'Groundnut Cultivation & Primary Processing Expansion',
    fundingRequiredLakhs: 25.0,
    purpose: 'Pre-season input advance and micro-decorticating plant for 450 smallholders.',
    fundedAcres: 520,
    expectedHarvestTonnes: 420,
    expectedRevenueLakhs: 142.8,
    expectedProfitLakhs: 28.5,
    profitMarginPercent: 20.0,
    demandScore: 92,
    demandLevel: 'HIGH',
    riskLevel: 'LOW',
    performanceIndex: 88.4,
    status: 'FUNDING REQUESTED',
    buyerReadiness: 94,
    createdDate: '2026-08-10',
    tenureMonths: 18,
    expectedReturnPercent: 9.5,
    strengths: [
      'Strong forward offtake contract signed with Marico & ITC Agri',
      'Positive historical profit margin averaging 19.8%',
      '100% drip irrigation coverage across 520 target acres'
    ],
    risks: [
      'Minor water table variation during peak pod-filling stage',
      'Mandi price fluctuations outside MSP corridor'
    ],
    dataCompleteness: 94
  },
  {
    id: 'opp-2',
    fpoId: 'fpo-1003',
    fpoName: 'Erode Manjal Farmers Producer Co',
    ticker: 'ERODE-TURMERIC',
    district: 'Erode',
    crop: 'Turmeric (Finger)',
    title: 'Organic Turmeric Solar Polishing & Curcumin Extraction Unit',
    fundingRequiredLakhs: 40.0,
    purpose: 'Post-harvest steam-boiling and solar tunnel dryer facility to achieve export-grade curcumin (>4.2%).',
    fundedAcres: 380,
    expectedHarvestTonnes: 350,
    expectedRevenueLakhs: 285.0,
    expectedProfitLakhs: 65.0,
    profitMarginPercent: 22.8,
    demandScore: 95,
    demandLevel: 'HIGH',
    riskLevel: 'LOW',
    performanceIndex: 91.2,
    status: 'FUNDING REQUESTED',
    buyerReadiness: 96,
    createdDate: '2026-08-12',
    tenureMonths: 24,
    expectedReturnPercent: 10.2,
    strengths: [
      'GI tagged Erode turmeric commands 15% price premium',
      'Institutional offtake partner: Synthite Spices & Everest Masala',
      'Zero default credit history on previous NABARD grants'
    ],
    risks: [
      'Export quarantine phytosanitary testing lead times',
      'Seasonality concentration in Feb-March harvest window'
    ],
    dataCompleteness: 92
  },
  {
    id: 'opp-3',
    fpoId: 'fpo-1002',
    fpoName: 'Cauvery Delta Paddy Producer Co',
    ticker: 'CAUVERY',
    district: 'Thanjavur',
    crop: 'Paddy (Samba / Ponni)',
    title: 'Samba Paddy Certified Seed & Bulk Storage Expansion',
    fundingRequiredLakhs: 50.0,
    purpose: 'Silo grain drying unit and pre-harvest procurement financing for 800 delta farmers.',
    fundedAcres: 1200,
    expectedHarvestTonnes: 1800,
    expectedRevenueLakhs: 396.0,
    expectedProfitLakhs: 72.5,
    profitMarginPercent: 18.3,
    demandScore: 89,
    demandLevel: 'HIGH',
    riskLevel: 'LOW',
    performanceIndex: 86.8,
    status: 'FUNDING REQUESTED',
    buyerReadiness: 91,
    createdDate: '2026-08-14',
    tenureMonths: 12,
    expectedReturnPercent: 8.8,
    strengths: [
      'Guaranteed MSP floor price protection backed by TN Civil Supplies',
      'Canal irrigation security via Mettur reservoir buffer',
      'High member retention: 2,400 active farmer shareholders'
    ],
    risks: [
      'Late monsoon rainfall variability during October sowing',
      'Storage pest management compliance requirements'
    ],
    dataCompleteness: 88
  },
  {
    id: 'opp-4',
    fpoId: 'fpo-1004',
    fpoName: 'Kongu Coconut Producers FPO',
    ticker: 'KONGU',
    district: 'Tiruppur',
    crop: 'Coconut (Copra & Desiccated)',
    title: 'Virgin Coconut Oil & Copra Dryer Infrastructure',
    fundingRequiredLakhs: 35.0,
    purpose: 'Cold-pressed virgin coconut oil extraction setup for premium wellness retail markets.',
    fundedAcres: 640,
    expectedHarvestTonnes: 620,
    expectedRevenueLakhs: 215.0,
    expectedProfitLakhs: 44.0,
    profitMarginPercent: 20.5,
    demandScore: 84,
    demandLevel: 'MODERATE',
    riskLevel: 'LOW',
    performanceIndex: 84.6,
    status: 'FUNDING REQUESTED',
    buyerReadiness: 88,
    createdDate: '2026-08-15',
    tenureMonths: 36,
    expectedReturnPercent: 9.8,
    strengths: [
      'Year-round continuous harvesting cycles (every 45 days)',
      'High-margin value addition (Virgin oil realized at ₹420/L vs raw copra ₹110/kg)',
      'Established regional retail network across Tamil Nadu & Kerala'
    ],
    risks: [
      'White fly pest stress in non-irrigated groves',
      'Imported palm oil price substitution pressure'
    ],
    dataCompleteness: 86
  },
  {
    id: 'opp-5',
    fpoId: 'fpo-1046',
    fpoName: 'Theni Banana Growers FPO Ltd',
    ticker: 'THENI-BANANA',
    district: 'Theni',
    crop: 'Banana (Grand Naine & Nendran)',
    title: 'Grand Naine Post-Harvest Packhouse & Refrigerated Transit',
    fundingRequiredLakhs: 30.0,
    purpose: 'Pre-cooling chamber and 2 reefer trucks to supply Metro supermarket chains in Bengaluru & Chennai.',
    fundedAcres: 410,
    expectedHarvestTonnes: 1200,
    expectedRevenueLakhs: 240.0,
    expectedProfitLakhs: 48.0,
    profitMarginPercent: 20.0,
    demandScore: 91,
    demandLevel: 'HIGH',
    riskLevel: 'MODERATE',
    performanceIndex: 87.2,
    status: 'FUNDING REQUESTED',
    buyerReadiness: 93,
    createdDate: '2026-08-18',
    tenureMonths: 24,
    expectedReturnPercent: 9.4,
    strengths: [
      'Perennial river-fed irrigation from Vaigai basin',
      'Daily harvest capabilities with direct APMC collection points',
      'Contract with WayCool & Nilgiris Supermarkets'
    ],
    risks: [
      'High perishability window (requires <72h cold chain continuity)',
      'Localized wind storm risks during fruiting stages'
    ],
    dataCompleteness: 90
  },
  {
    id: 'opp-6',
    fpoId: 'fpo-1012',
    fpoName: 'Madurai Millets & Pulses FPO',
    ticker: 'MADURAI-MILLET',
    district: 'Madurai',
    crop: 'Millets (Kodo & Barnyard)',
    title: 'Climate-Resilient Small Millets Processing & Value-Add Hub',
    fundingRequiredLakhs: 20.0,
    purpose: 'De-hulling, sorting, and packaging setup for dryland smallholders.',
    fundedAcres: 350,
    expectedHarvestTonnes: 280,
    expectedRevenueLakhs: 112.0,
    expectedProfitLakhs: 26.8,
    profitMarginPercent: 23.9,
    demandScore: 93,
    demandLevel: 'HIGH',
    riskLevel: 'LOW',
    performanceIndex: 85.5,
    status: 'FUNDING REQUESTED',
    buyerReadiness: 89,
    createdDate: '2026-08-20',
    tenureMonths: 18,
    expectedReturnPercent: 9.0,
    strengths: [
      'Very low water footprint (drought-proof crop)',
      'Growing urban superfood demand with government school breakfast scheme tenders',
      'Organic certified grower base'
    ],
    risks: [
      'Lower baseline yields compared to hybrid cereals',
      'Localized processing machinery calibration'
    ],
    dataCompleteness: 85
  }
];

export const INITIAL_EXPRESSIONS_OF_INTEREST: ExpressionOfInterest[] = [
  {
    id: 'eoi-1',
    fpoId: 'fpo-1001',
    fpoName: 'Kaveri Horticulture FPO Ltd',
    ticker: 'KAVERI',
    crop: 'Groundnut (TMV-7)',
    district: 'Coimbatore',
    opportunityId: 'opp-1',
    opportunityTitle: 'Groundnut Cultivation & Primary Processing Expansion',
    investorName: 'Tamil Nadu Agri Growth Syndicate',
    organisation: 'TN Agri Venture Capital Fund',
    email: 'investor@tnfi.in',
    phone: '+91 98401 23456',
    interestedAmountLakhs: 25.0,
    message: 'We are interested in co-financing the 520-acre groundnut working capital cycle with 18-month structured debt.',
    submittedDate: '2026-08-22',
    status: 'PENDING'
  }
];

export const INITIAL_WATCHLIST: string[] = ['fpo-1001', 'fpo-1003', 'fpo-1002', 'fpo-1046'];

