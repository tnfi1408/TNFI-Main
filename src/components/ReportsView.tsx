import React, { useState } from 'react';
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
  const { indexData } = useApp();
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownload = (title: string) => {
    setDownloadToast(`Preparing verified dossier for: ${title}`);
    setTimeout(() => {
      setDownloadToast(`Downloaded verified compliance copy of: ${title}`);
      setTimeout(() => setDownloadToast(null), 3500);
    }, 800);
  };

  const reports = [
    {
      title: 'FI 50 Index Semi-Annual Factsheet (Q2 FY26)',
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
    <div className="space-y-6 max-w-[1600px] mx-auto relative">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#10140D] border border-[#7A8F35]/60 text-[#A8C94A] text-xs shadow-2xl flex items-center gap-3 animate-fade-in font-mono">
          <CheckCircle2 className="w-5 h-5 text-[#36C77A] shrink-0" />
          <div>
            <div className="font-bold text-white">Repository Vault Retrieval</div>
            <div className="text-neutral-300 text-[11px] mt-0.5">{downloadToast}</div>
          </div>
        </div>
      )}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B120B] via-[#101A0D] to-[#0B120B] border border-[#26351B] shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#718C2C]/20 text-[#A8C94A] border border-[#718C2C]/30">
              DISCLOSURES & FILINGS
            </span>
            <span className="text-xs text-[#A7AE9B] font-mono">NABARD / ROC COMPLIANT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F2F1E8] tracking-tight">
            FPO Filings, Factsheets & Compliance Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#A7AE9B] mt-1 max-w-2xl">
            Official compliance disclosures, statutory auditor filings, and periodic financial statements submitted by verified FPOs.
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
                onClick={() => handleDownload(report.title)}
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
