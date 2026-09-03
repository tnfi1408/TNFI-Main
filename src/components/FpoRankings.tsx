import React, { useState, useMemo } from 'react';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Search,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FpoRankings: React.FC = () => {
  const { fpoStocks, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'marketCap' | 'dividend'>('score');

  const sectorsList = ['ALL', 'Horticulture', 'Paddy & Cereals', 'Dairy & Livestock', 'Spices & Plantation', 'Coconut & Oilseeds', 'Millets & Pulses'];

  const rankedStocks = useMemo(() => {
    return [...fpoStocks]
      .filter(stock => {
        const matchesSearch =
          stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.primaryCrop.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.district.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = sectorFilter === 'ALL' || stock.sector === sectorFilter;
        return matchesSearch && matchesSector;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.tnfiScore - a.tnfiScore;
        if (sortBy === 'price') return b.currentPrice - a.currentPrice;
        if (sortBy === 'marketCap') return b.marketCapCr - a.marketCapCr;
        if (sortBy === 'dividend') return b.dividendYieldPercent - a.dividendYieldPercent;
        return 0;
      });
  }, [fpoStocks, searchTerm, sectorFilter, sortBy]);

  return (
    <div className="rounded-2xl bg-[#0B120B] border border-[#26351B] p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#D6B45C]" />
            <h2 className="text-lg font-bold text-[#F2F1E8] tracking-tight">
              TNFI Official FPO Performance Leaderboard
            </h2>
          </div>
          <p className="text-xs text-[#A7AE9B] mt-0.5">
            Ranked by AI composite score, governance audits, member profitability, and market capitalization
          </p>
        </div>

        {/* Sort Switcher */}
        <div className="flex items-center gap-1 bg-[#050905] border border-[#26351B] p-1 rounded-xl text-xs font-mono">
          <span className="text-[#68705F] px-2">Sort:</span>
          {(['score', 'price', 'marketCap', 'dividend'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                sortBy === s
                  ? 'bg-[#718C2C] text-[#050905]'
                  : 'text-[#A7AE9B] hover:text-[#F2F1E8]'
              }`}
            >
              {s === 'score' ? 'TNFI Score' : s === 'marketCap' ? 'Mkt Cap' : s === 'dividend' ? 'Yield' : 'Price'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scroll">
          {sectorsList.map(sec => (
            <button
              key={sec}
              onClick={() => setSectorFilter(sec)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                sectorFilter === sec
                  ? 'bg-[#718C2C] text-[#050905] shadow-md'
                  : 'bg-[#050905] text-[#A7AE9B] hover:text-[#F2F1E8] border border-[#26351B]'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#68705F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FPO or ticker..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050905] border border-[#26351B] text-xs text-[#F2F1E8] placeholder-[#68705F] focus:outline-none focus:border-[#718C2C]"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto custom-scroll rounded-xl border border-[#26351B]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#050905] border-b border-[#26351B] text-[#A7AE9B] font-mono uppercase text-[10px]">
            <tr>
              <th className="py-3 px-3 w-12 text-center">RANK</th>
              <th className="py-3 px-4">TICKER & FPO</th>
              <th className="py-3 px-3">SECTOR</th>
              <th className="py-3 px-3">STOCK PRICE</th>
              <th className="py-3 px-3">24H RETURN</th>
              <th className="py-3 px-3">MKT CAP</th>
              <th className="py-3 px-3">DIV YIELD</th>
              <th className="py-3 px-3">TNFI SCORE</th>
              <th className="py-3 px-3">CREDIT RATING</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26351B] font-sans">
            {rankedStocks.map((stock, index) => {
              const isPos = stock.changePercent >= 0;
              return (
                <tr
                  key={stock.id}
                  onClick={() => setCurrentView('fpo-stocks', stock.ticker)}
                  className="hover:bg-[#101A0D] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 text-center font-mono font-black">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        index === 0
                          ? 'bg-[#D6B45C]/20 text-[#D6B45C] border border-[#D6B45C]/40'
                          : index === 1
                          ? 'bg-[#A7AE9B]/20 text-[#F2F1E8] border border-[#A7AE9B]/40'
                          : index === 2
                          ? 'bg-[#8FA83A]/20 text-[#A8C94A] border border-[#8FA83A]/40'
                          : 'text-[#68705F]'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#F2F1E8] font-mono">{stock.ticker}</div>
                    <div className="text-[11px] text-[#A7AE9B] line-clamp-1">{stock.name}</div>
                  </td>
                  <td className="py-3 px-3 text-[#A7AE9B]">
                    <span className="px-2 py-0.5 rounded bg-[#18351F]/60 border border-[#26351B] text-[10px] text-[#A8C94A]">
                      {stock.sector}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold font-mono-nums text-[#F2F1E8]">
                    ₹{(stock.currentPrice || stock.price || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-bold font-mono-nums">
                    <span className={isPos ? 'text-[#36C77A]' : 'text-[#D96555]'}>
                      {isPos ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono-nums text-[#A7AE9B]">
                    ₹{stock.marketCapCr} Cr
                  </td>
                  <td className="py-3 px-3 font-mono-nums text-[#36C77A] font-bold">
                    {stock.dividendYieldPercent}%
                  </td>
                  <td className="py-3 px-3 font-mono-nums font-bold text-[#A8C94A]">
                    {stock.tnfiScore}/100
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#36C77A]/10 text-[#36C77A] border border-[#36C77A]/20">
                      {stock.creditRating}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentView('fpo-stocks', stock.ticker);
                      }}
                      className="px-2.5 py-1 rounded bg-[#718C2C]/20 hover:bg-[#718C2C]/40 text-[#A8C94A] border border-[#718C2C]/40 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
