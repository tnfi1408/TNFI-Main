import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Sparkles,
  BarChart2,
  SlidersHorizontal,
  DollarSign,
  Layers,
  Building2,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FpoStock, SectorType } from '../types';

export const FpoStockMarket: React.FC = () => {
  const {
    fpoStocks,
    selectedSector,
    setSelectedSector,
    selectedTicker,
    setSelectedTicker,
    executeTrade,
    portfolioMetrics,
    setCurrentView
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [tradeModalStock, setTradeModalStock] = useState<FpoStock | null>(null);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(100);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [tradeFeedback, setTradeFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const sectors: (SectorType | 'ALL')[] = [
    'ALL',
    'Horticulture',
    'Paddy & Cereals',
    'Dairy & Livestock',
    'Spices & Plantation',
    'Coconut & Oilseeds',
    'Millets & Pulses'
  ];

  const filteredStocks = fpoStocks.filter(stock => {
    const matchesSector = selectedSector === 'ALL' || stock.sector === selectedSector;
    const matchesSearch =
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.primaryCrop.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const handleOpenTrade = (stock: FpoStock, type: 'BUY' | 'SELL') => {
    setTradeModalStock(stock);
    setTradeType(type);
    setQuantity(100);
    setTradeFeedback(null);
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeModalStock) return;
    const result = executeTrade(tradeModalStock.ticker, tradeType, quantity, orderType);
    setTradeFeedback(result);
    if (result.success) {
      setTimeout(() => {
        setTradeModalStock(null);
        setTradeFeedback(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#10140D] border border-[#2A3320] shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#7A8F35]/15 text-[#9CAF45] border border-[#7A8F35]/30">
              EQUITIES & PORTFOLIO TRADING
            </span>
            <span className="text-xs text-[#969D88] font-mono">TAMIL NADU VETTED LISTINGS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F4EA] tracking-tight">
            FPO Stock Market & Equities
          </h1>
          <p className="text-xs sm:text-sm text-[#969D88] mt-1 max-w-2xl">
            Trade standardized equity units of high-performing Tamil Nadu Farmer Producer Organizations with verified audited financials, dividend yields, and institutional governance ratings.
          </p>
        </div>

        {/* Quick Portfolio Balance Card */}
        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#080A07] border border-[#2A3320]">
          <div>
            <span className="text-[10px] font-mono text-[#969D88] block uppercase">AVAILABLE CASH WALLET</span>
            <span className="text-lg font-extrabold text-[#8FAF3D] font-mono-nums">
              ₹{(portfolioMetrics?.cashBalance || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <button
            onClick={() => setCurrentView('portfolio')}
            className="px-3 py-2 rounded-lg bg-[#7A8F35]/20 hover:bg-[#7A8F35]/35 text-[#9CAF45] border border-[#7A8F35]/35 text-xs font-bold transition-colors cursor-pointer"
          >
            My Portfolio →
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-[#10140D] border border-[#2A3320]">
        {/* Sector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scroll">
          {sectors.map(sector => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSector === sector
                  ? 'bg-[#7A8F35] text-white shadow-md shadow-[#7A8F35]/30'
                  : 'bg-[#161B11] text-[#969D88] hover:text-[#F3F4EA] hover:bg-[#1a2114] border border-[#2A3320]'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Search input & View switcher */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-[#969D88] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticker, crop, district..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080A07] border border-[#2A3320] text-xs text-[#F3F4EA] placeholder-[#969D88]/60 focus:outline-none focus:border-[#7A8F35] font-sans"
            />
          </div>

          <div className="flex items-center rounded-lg bg-[#080A07] border border-[#2A3320] p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#7A8F35] text-white' : 'text-[#969D88] hover:text-[#F3F4EA]'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                viewMode === 'table' ? 'bg-[#7A8F35] text-white' : 'text-[#969D88] hover:text-[#F3F4EA]'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStocks.map(stock => {
            const isPositive = stock.changePercent >= 0;
            return (
              <div
                key={stock.id}
                className="p-5 rounded-2xl bg-[#10140D] hover:bg-[#161B11] border border-[#2A3320] hover:border-[#7A8F35]/50 transition-all shadow-xl flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Row: Ticker & Rating */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-[#F3F4EA] font-mono tracking-wide">
                          {stock.ticker}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold font-mono bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
                          {stock.creditRating}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#161B11] text-[#9CAF45] border border-[#2A3320]">
                          {stock.sector}
                        </span>
                      </div>
                      <h3 className="font-semibold text-xs text-[#F3F4EA] mt-0.5 line-clamp-1">
                        {stock.name}
                      </h3>
                      <span className="text-[11px] text-[#969D88]">
                        {stock.district}, TN • {(stock.totalMembers || 0).toLocaleString()} Members
                      </span>
                    </div>

                    {/* AI TNFI Score badge */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#161B11] border border-[#7A8F35]/30">
                        <Sparkles className="w-3 h-3 text-[#D6A83A]" />
                        <span className="text-xs font-black text-[#9CAF45] font-mono">
                          {stock.tnfiScore}
                        </span>
                        <span className="text-[9px] text-[#969D88] font-mono">/100</span>
                      </div>
                      <span className="text-[9px] text-[#969D88] font-mono mt-0.5">TNFI Score</span>
                    </div>
                  </div>

                  {/* Stock Price & Change Hero */}
                  <div className="flex items-baseline justify-between py-2.5 my-2 border-y border-[#2A3320]">
                    <div>
                      <span className="text-[10px] text-[#969D88] block font-mono">EQUITY SHARE PRICE</span>
                      <span className="text-2xl font-black text-[#F3F4EA] font-mono-nums">
                        ₹{(stock.currentPrice || stock.price || 0).toFixed(2)}
                      </span>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-mono text-xs font-bold ${
                        isPositive
                          ? 'bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30'
                          : 'bg-[#D65C5C]/15 text-[#D65C5C] border border-[#D65C5C]/30'
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {isPositive ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}% (₹{(stock.changeValue || stock.change24h || 0).toFixed(2)})
                    </div>
                  </div>

                  {/* Agricultural Drivers Micro-Bar */}
                  <div className="p-2 rounded-xl bg-[#080A07] border border-[#2A3320] mb-2.5 space-y-1 text-[10px] font-mono">
                    <div className="flex justify-between items-center text-[#969D88]">
                      <span className="text-[#F3F4EA] font-sans font-medium">Crop: <strong className="text-[#9CAF45] font-mono">{stock.primaryCrop || 'Multi-Crop'}</strong></span>
                      <span className="text-[#8FAF3D] font-bold">Mandi Spot: +{(((stock.changePercent || 0) + 1.2)).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-[#969D88] overflow-x-auto custom-scroll">
                      <span className="px-1.5 py-0.5 rounded bg-[#161B11] border border-[#2A3320] text-[#9CAF45] whitespace-nowrap">
                        Demand: High
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#8FAF3D]/10 border border-[#8FAF3D]/30 text-[#8FAF3D] whitespace-nowrap">
                        Yield: +4.8%
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#53652A]/20 border border-[#53652A]/40 text-[#F3F4EA] whitespace-nowrap">
                        TN Agro-Zone
                      </span>
                    </div>
                  </div>

                  {/* Key Financial Multiples Matrix */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#080A07] border border-[#2A3320] text-xs font-mono-nums mb-3">
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">Mkt Cap</span>
                      <span className="font-bold text-[#F3F4EA]">₹{stock.marketCapCr} Cr</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">P/E Ratio</span>
                      <span className="font-bold text-[#9CAF45]">{stock.peRatio}x</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">Div Yield</span>
                      <span className="font-bold text-[#8FAF3D]">{stock.dividendYieldPercent}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">Revenue</span>
                      <span className="font-bold text-[#F3F4EA]">₹{stock.financials.revenueCr} Cr</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">Net PAT</span>
                      <span className="font-bold text-[#8FAF3D]">₹{stock.financials.patCr} Cr</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#969D88] block font-sans">ROE</span>
                      <span className="font-bold text-[#D6A83A]">{stock.financials.roePercent}%</span>
                    </div>
                  </div>

                  {/* 52-Week Range Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[10px] text-[#969D88] font-mono">
                      <span>52W L: ₹{stock.yearLow}</span>
                      <span>52W H: ₹{stock.yearHigh}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#080A07] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#53652A] to-[#8FAF3D]"
                        style={{
                          width: `${Math.min(100, Math.max(5, ((stock.currentPrice - stock.yearLow) / (stock.yearHigh - stock.yearLow)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#2A3320]">
                  <button
                    onClick={() => setCurrentView('fpo-detail', stock.id)}
                    className="flex-1 py-2 rounded-lg bg-[#080A07] hover:bg-[#161B11] text-[#969D88] hover:text-[#F3F4EA] border border-[#2A3320] text-xs font-bold transition-colors text-center cursor-pointer"
                  >
                    Financials
                  </button>
                  <button
                    onClick={() => handleOpenTrade(stock, 'BUY')}
                    className="flex-1 py-2 rounded-lg bg-[#7A8F35] hover:bg-[#9CAF45] text-white text-xs font-bold transition-colors shadow-md shadow-[#7A8F35]/30 cursor-pointer"
                  >
                    Buy Unit
                  </button>
                  <button
                    onClick={() => handleOpenTrade(stock, 'SELL')}
                    className="flex-1 py-2 rounded-lg bg-[#D65C5C]/20 hover:bg-[#D65C5C]/35 text-[#D65C5C] border border-[#D65C5C]/30 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Sell Unit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Screener Table View */
        <div className="rounded-2xl bg-[#10140D] border border-[#2A3320] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scroll">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080A07] border-b border-[#2A3320] text-[#969D88] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">TICKER & FPO</th>
                  <th className="py-3.5 px-3">SECTOR</th>
                  <th className="py-3.5 px-3">PRICE (₹)</th>
                  <th className="py-3.5 px-3">24H CHANGE</th>
                  <th className="py-3.5 px-3">MKT CAP</th>
                  <th className="py-3.5 px-3">P/E</th>
                  <th className="py-3.5 px-3">DIV YIELD</th>
                  <th className="py-3.5 px-3">TNFI SCORE</th>
                  <th className="py-3.5 px-3">RATING</th>
                  <th className="py-3.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3320]/60 font-sans">
                {filteredStocks.map(stock => {
                  const isPositive = stock.changePercent >= 0;
                  return (
                    <tr key={stock.id} className="hover:bg-[#161B11] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#F3F4EA] font-mono text-sm">{stock.ticker}</div>
                        <div className="text-[11px] text-[#969D88] line-clamp-1">{stock.name}</div>
                      </td>
                      <td className="py-3.5 px-3 text-[#969D88]">
                        <span className="px-2 py-0.5 rounded bg-[#161B11] border border-[#2A3320] text-[#9CAF45] text-[10px]">
                          {stock.sector}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold font-mono-nums text-[#F3F4EA] text-sm">
                        ₹{(stock.currentPrice || stock.price || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-bold font-mono-nums">
                        <span className={isPositive ? 'text-[#8FAF3D]' : 'text-[#D65C5C]'}>
                          {isPositive ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono-nums text-[#F3F4EA]">
                        ₹{stock.marketCapCr} Cr
                      </td>
                      <td className="py-3.5 px-3 font-mono-nums text-[#9CAF45] font-bold">
                        {stock.peRatio}x
                      </td>
                      <td className="py-3.5 px-3 font-mono-nums text-[#8FAF3D] font-bold">
                        {stock.dividendYieldPercent}%
                      </td>
                      <td className="py-3.5 px-3 font-mono-nums font-bold text-[#D6A83A]">
                        {stock.tnfiScore}/100
                      </td>
                      <td className="py-3.5 px-3 font-mono">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30">
                          {stock.creditRating}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenTrade(stock, 'BUY')}
                            className="px-2.5 py-1 rounded bg-[#7A8F35] hover:bg-[#9CAF45] text-white font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Buy
                          </button>
                          <button
                            onClick={() => handleOpenTrade(stock, 'SELL')}
                            className="px-2.5 py-1 rounded bg-[#D65C5C]/20 hover:bg-[#D65C5C]/35 text-[#D65C5C] border border-[#D65C5C]/30 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trade Execution Modal */}
      {tradeModalStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#10140D] border border-[#7A8F35]/40 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setTradeModalStock(null)}
              className="absolute top-4 right-4 text-[#969D88] hover:text-[#F3F4EA] p-1 rounded-lg bg-[#080A07] border border-[#2A3320] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#F3F4EA] font-mono">
                  {tradeModalStock.ticker}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#7A8F35]/15 text-[#9CAF45] border border-[#7A8F35]/30">
                  {tradeModalStock.sector}
                </span>
              </div>
              <p className="text-xs text-[#969D88] mt-0.5">{tradeModalStock.name}</p>
            </div>

            {/* Trade Type Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#080A07] border border-[#2A3320]">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tradeType === 'BUY'
                    ? 'bg-[#7A8F35] text-white shadow-lg'
                    : 'text-[#969D88] hover:text-[#F3F4EA]'
                }`}
              >
                BUY / INVEST
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tradeType === 'SELL'
                    ? 'bg-[#D65C5C] text-white shadow-lg'
                    : 'text-[#969D88] hover:text-[#F3F4EA]'
                }`}
              >
                SELL / EXIT
              </button>
            </div>

            <form onSubmit={handleExecuteTrade} className="space-y-3">
              {/* Order Type */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setOrderType('MARKET')}
                  className={`py-1.5 px-3 rounded-lg border cursor-pointer ${
                    orderType === 'MARKET'
                      ? 'bg-[#7A8F35]/30 text-[#9CAF45] border-[#9CAF45]'
                      : 'bg-[#080A07] text-[#969D88] border-[#2A3320]'
                  }`}
                >
                  Market Order
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('LIMIT')}
                  className={`py-1.5 px-3 rounded-lg border cursor-pointer ${
                    orderType === 'LIMIT'
                      ? 'bg-[#7A8F35]/30 text-[#9CAF45] border-[#9CAF45]'
                      : 'bg-[#080A07] text-[#969D88] border-[#2A3320]'
                  }`}
                >
                  Limit Order
                </button>
              </div>

              {/* Unit Price display */}
              <div className="p-3 rounded-xl bg-[#080A07] border border-[#2A3320] flex items-center justify-between text-xs font-mono">
                <span className="text-[#969D88]">Execution Unit Price:</span>
                <span className="text-base font-extrabold text-[#F3F4EA]">
                  ₹{(tradeModalStock.currentPrice || tradeModalStock.price || 0).toFixed(2)}
                </span>
              </div>

              {/* Quantity input */}
              <div>
                <label className="block text-[11px] font-mono text-[#969D88] mb-1">
                  Quantity (Units):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl bg-[#080A07] border border-[#2A3320] text-sm font-mono-nums text-[#F3F4EA] focus:outline-none focus:border-[#7A8F35]"
                  />
                  <div className="flex items-center gap-1">
                    {[100, 500, 1000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setQuantity(amt)}
                        className="px-2 py-2 rounded-lg bg-[#161B11] border border-[#2A3320] text-[10px] font-mono text-[#9CAF45] hover:bg-[#7A8F35]/30 cursor-pointer"
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trade Summary Calc */}
              <div className="p-3.5 rounded-xl bg-[#161B11] border border-[#2A3320] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#969D88]">
                  <span>Total Order Value:</span>
                  <span className="font-bold text-[#F3F4EA] font-mono-nums">
                    ₹{(quantity * tradeModalStock.currentPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-[#969D88] text-[10px]">
                  <span>Exchange & Clearing Fee:</span>
                  <span>₹0.00 (Zero Fee for TN Cooperatives)</span>
                </div>
                <div className="flex justify-between text-[#8FAF3D] font-bold pt-1 border-t border-[#2A3320]">
                  <span>Estimated Annual Dividend:</span>
                  <span>
                    ₹{((quantity * tradeModalStock.currentPrice * tradeModalStock.dividendYieldPercent) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/yr
                  </span>
                </div>
              </div>

              {tradeFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono ${
                    tradeFeedback.success
                      ? 'bg-[#8FAF3D]/15 text-[#8FAF3D] border border-[#8FAF3D]/30'
                      : 'bg-[#D65C5C]/15 text-[#D65C5C] border border-[#D65C5C]/30'
                  }`}
                >
                  {tradeFeedback.message}
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg cursor-pointer ${
                  tradeType === 'BUY'
                    ? 'bg-[#7A8F35] hover:bg-[#9CAF45] text-white shadow-[#7A8F35]/30'
                    : 'bg-[#D65C5C] hover:opacity-90 text-white shadow-[#D65C5C]/30'
                }`}
              >
                Execute {tradeType} Order ({quantity} Units)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
