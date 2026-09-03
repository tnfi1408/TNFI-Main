import React from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsView: React.FC = () => {
  const { fpoStocks, indexData } = useApp();

  const reports = [
    {
      title: 'TNFI Index Semi-Annual Factsheet (Q2 FY26)',
      type: 'Market Factsheet',
      date: 'Aug 14, 2026',
      size: '2.4 MB',
      verified: true
    },
    {
      title: 'Kaveri Horticulture FPO Audited Annual Financials (FY25-26)',
      type: 'Statutory Audit',
      date: 'Aug 10, 2026',
      size: '4.1 MB',
      verified: true
    },
    {
      title: 'Cauvery Delta Paddy Farmers FPO - FMCG Offtake Master Agreement',
      type: 'Offtake Contract',
      date: 'Aug 05, 2026',
      size: '1.8 MB',
      verified: true
    },
    {
      title: 'Kongu Coconut ₹8 Cr Agri-Infrastructure Bond Prospectus',
      type: 'Bond Prospectus',
      date: 'Jul 28, 2026',
      size: '3.6 MB',
      verified: true
    },
    {
      title: 'Tamil Nadu 50 Listed FPO Composite Credit Rating Report (ICRA / CRISIL)',
      type: 'Rating Dossier',
      date: 'Jul 15, 2026',
      size: '5.2 MB',
      verified: true
    }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B120B] via-[#101A0D] to-[#0B120B] border border-[#26351B] shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#718C2C]/20 text-[#A8C94A] border border-[#718C2C]/30">
              DISCLOSURES & FILINGS
            </span>
            <span className="text-xs text-[#A7AE9B] font-mono">SEBI / NABARD COMPLIANT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F2F1E8] tracking-tight">
            Exchange Filings, Factsheets & Audit Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1 max-w-2xl">
            Official regulatory disclosures, statutory auditor certifications, and periodic financial statements submitted by listed FPOs.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0B120B] border border-[#26351B] overflow-hidden shadow-2xl">
        <div className="divide-y divide-[#26351B]">
          {reports.map((report, idx) => (
            <div
              key={idx}
              className="p-4 hover:bg-[#101A0D] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#718C2C]/20 border border-[#718C2C]/40 text-[#A8C94A] mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#F2F1E8]">{report.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#A7AE9B] mt-1 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-[#050905] text-[#A8C94A] border border-[#26351B]">
                      {report.type}
                    </span>
                    <span>{report.date}</span>
                    <span>{report.size}</span>
                    {report.verified && (
                      <span className="text-[#36C77A] flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Clean
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading verified copy of: ${report.title}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#050905] hover:bg-[#101A0D] text-[#A8C94A] border border-[#26351B] text-xs font-mono font-bold transition-colors self-start sm:self-center cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
