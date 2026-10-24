import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RpcHolder } from '../../types';
import {
  Award,
  Search,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Filter,
  UserCheck,
  Calendar,
  FileText,
  BadgeCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export const RpcHoldersTab: React.FC = () => {
  const { rpcHolders, openEnrollModal, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [copiedRpc, setCopiedRpc] = useState<string | null>(null);

  // Official DGCA DigiGov Verification Portal URL
  const DGCA_VERIFY_URL = 'https://www.dgca.gov.in/digigov-portal/';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRpc(text);
    showToast(`Copied ${label}: ${text}`, 'success');
    setTimeout(() => setCopiedRpc(null), 2500);
  };

  const handleVerifyOnDgca = (rpcNumber?: string) => {
    const targetRpc = (rpcNumber || '').trim();
    if (targetRpc) {
      navigator.clipboard.writeText(targetRpc);
      showToast(`Copied RPC "${targetRpc}"! Opening official eGCA Portal...`, 'success');
    } else {
      showToast('Opening official eGCA Portal...', 'info');
    }
    window.open(DGCA_VERIFY_URL, '_blank', 'noopener,noreferrer');
  };

  // Year counts
  const yearCounts = useMemo(() => {
    const counts: Record<string, number> = { all: rpcHolders.length, '2024': 0, '2025': 0, '2026': 0 };
    rpcHolders.forEach((h) => {
      const year = h.issueYear || (h.serialNo.startsWith('2024') ? '2024' : h.serialNo.startsWith('2025') ? '2025' : '2026');
      if (counts[year] !== undefined) {
        counts[year]++;
      } else {
        counts[year] = 1;
      }
    });
    return counts;
  }, [rpcHolders]);

  // Filtered holders
  const filteredHolders = useMemo(() => {
    return rpcHolders.filter((holder) => {
      const year = holder.issueYear || (holder.serialNo.startsWith('2024') ? '2024' : holder.serialNo.startsWith('2025') ? '2025' : '2026');
      const matchesYear = selectedYear === 'all' || year === selectedYear;

      if (!matchesYear) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        holder.name.toLowerCase().includes(q) ||
        holder.rpcNo.toLowerCase().includes(q) ||
        holder.certificateNo.toLowerCase().includes(q) ||
        holder.serialNo.toLowerCase().includes(q)
      );
    });
  }, [rpcHolders, selectedYear, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['S.No', 'Candidate Serial No', 'Certificate No', 'RPC No', 'Name of the RPC Holder', 'Issue Year', 'Status'];
    const rows = filteredHolders.map((h, i) => [
      i + 1,
      `"${h.serialNo}"`,
      `"${h.certificateNo}"`,
      `"${h.rpcNo}"`,
      `"${h.name}"`,
      `"${h.issueYear || '2024'}"`,
      `"${h.status || 'Verified'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sri_Eshwar_RPTO_RPC_Holders_${selectedYear === 'all' ? 'All' : selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported RPC Holders list to CSV', 'success');
  };

  return (
    <div className="h-full overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-6">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#08245F] via-[#0B3388] to-[#071D4A] p-5 sm:p-8 text-white shadow-xl border border-sky-400/20">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-amber-400/20 text-[#FFB800] border border-amber-400/30">
              <Award className="w-3.5 h-3.5" />
              OFFICIAL DGCA PILOT REGISTRY
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              RPTO AUTH: DGCA/RPTO-TN 21/2024
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase leading-tight font-heading">
                DGCA Remote Pilot <span className="text-[#FFB800]">Certificate (RPC)</span> Holders
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-sky-100/90 leading-relaxed">
                Official public verification roster of certified commercial drone pilots trained, examined, and licensed through Sri Eshwar Drone Tech RPTO. Each candidate holds a DGCA-authorized 10-year commercial pilot credential valid on the Digital Sky portal.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/15 text-center">
                <div className="text-xl sm:text-2xl font-black text-[#FFB800]">{rpcHolders.length}</div>
                <div className="text-[10px] sm:text-[11px] font-bold text-sky-200 uppercase tracking-wider mt-0.5">
                  Certified Pilots
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/15 text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
                <div className="text-[10px] sm:text-[11px] font-bold text-sky-200 uppercase tracking-wider mt-0.5">
                  DGCA Exam Pass
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/15 text-center">
                <div className="text-xl sm:text-2xl font-black text-sky-300">10 Yrs</div>
                <div className="text-[10px] sm:text-[11px] font-bold text-sky-200 uppercase tracking-wider mt-0.5">
                  License Validity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DGCA eGCA PORTAL VERIFICATION */}
      <div className="bg-white rounded-2xl border border-[#CFEAFF] p-4 sm:p-5 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#08245F] text-[#FFB800] flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-[#FFB800]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#08245F]">
                Verify RPC on official eGCA portal:
              </h2>
              <a
                href={DGCA_VERIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-[#087FE5] font-semibold hover:underline inline-flex items-center gap-1 font-mono break-all mt-0.5"
              >
                <span>https://www.dgca.gov.in/digigov-portal/</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>

          <a
            href={DGCA_VERIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#08245F] hover:bg-[#0B3388] text-white text-xs font-black transition-all cursor-pointer shadow-xs shrink-0"
          >
            <span>Open eGCA Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
          </a>
        </div>
      </div>

      {/* 3. CONTROLS: SEARCH, FILTER, EXPORT */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Year filter tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', '2024', '2025', '2026'] as const).map((year) => {
            const count = yearCounts[year] || 0;
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#087FE5] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-[#CFEAFF]'
                }`}
              >
                <span>{year === 'all' ? 'All Batches' : `${year} Batch`}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search box & Export button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate, RPC #, cert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#CFEAFF] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#087FE5]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={handleExportCSV}
            title="Export this filtered list as a CSV file"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-[#CFEAFF] bg-white hover:bg-slate-50 text-xs font-bold text-[#08245F] transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN DATA TABLE (Desktop & Tablet) */}
      <div className="bg-white rounded-2xl border border-[#CFEAFF] shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-[#08245F] tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Candidate Serial No</th>
                <th className="py-3 px-4">Certificate No</th>
                <th className="py-3 px-4">RPC No</th>
                <th className="py-3 px-4">Name of the RPC Holder</th>
                <th className="py-3 px-4 text-center">DGCA Status</th>
                <th className="py-3 px-4 text-center">DGCA eGCA Portal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredHolders.length > 0 ? (
                filteredHolders.map((holder, idx) => {
                  const isCopied = copiedRpc === holder.rpcNo;
                  return (
                    <tr
                      key={holder.id || `${holder.serialNo}-${idx}`}
                      className="hover:bg-sky-50/50 transition-colors group"
                    >
                      {/* Index */}
                      <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Candidate Serial No */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] border border-slate-200/80">
                          {holder.serialNo}
                        </span>
                      </td>

                      {/* Certificate No */}
                      <td className="py-3 px-4 font-mono text-slate-700 font-medium">
                        {holder.certificateNo}
                      </td>

                      {/* RPC No with Copy Button */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center space-x-1.5 bg-[#08245F]/5 hover:bg-[#08245F]/10 px-2.5 py-1 rounded-lg border border-[#08245F]/15 transition-colors">
                          <span className="font-mono font-bold text-[#08245F] tracking-wide">
                            {holder.rpcNo}
                          </span>
                          <button
                            onClick={() => handleCopy(holder.rpcNo, 'RPC Number')}
                            title="Copy RPC Number to clipboard"
                            className="p-1 rounded text-slate-400 hover:text-[#08245F] hover:bg-white transition-all cursor-pointer"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Name of the RPC Holder */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-amber-100 text-[#08245F] flex items-center justify-center font-bold text-[11px] border border-amber-300 shrink-0">
                            {holder.name.charAt(0)}
                          </div>
                          <span className="font-bold text-[#08245F] tracking-wide text-xs uppercase">
                            {holder.name}
                          </span>
                        </div>
                      </td>

                      {/* DGCA Status */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          VERIFIED
                        </span>
                      </td>

                      {/* DGCA DigiGov Portal Verify Link */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleVerifyOnDgca(holder.rpcNo)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-[#08245F] text-[#08245F] hover:text-[#FFB800] border border-sky-200 text-[11px] font-bold transition-all cursor-pointer shadow-2xs group-hover:border-[#08245F]"
                          title={`Copy ${holder.rpcNo} and verify on DGCA DigiGov Portal`}
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p className="font-bold text-sm text-slate-700">No matching certified pilot records found</p>
                      <p className="text-xs text-slate-400">
                        Try searching with a different candidate name, RPC number, or clear your filter.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedYear('all');
                        }}
                        className="mt-2 px-3 py-1 bg-[#087FE5] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Reset Search Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong>{filteredHolders.length}</strong> of <strong>{rpcHolders.length}</strong> certified DGCA remote pilot holders
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Official DGCA Digital Sky Records
            </span>
          </div>
        </div>
      </div>

      {/* 5. MOBILE CARD VIEW (Small Screens) */}
      <div className="md:hidden space-y-3">
        {filteredHolders.length > 0 ? (
          filteredHolders.map((holder, idx) => (
            <div
              key={holder.id || `${holder.serialNo}-${idx}`}
              className="bg-white rounded-2xl border border-[#CFEAFF] p-4 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-[#08245F] flex items-center justify-center font-bold text-xs border border-amber-300 shrink-0">
                    {holder.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#08245F] uppercase tracking-wide">
                      {holder.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  VERIFIED
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-2.5 space-y-1.5 text-[11px] border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">RPC Number:</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-mono font-bold text-[#08245F]">{holder.rpcNo}</span>
                    <button
                      onClick={() => handleCopy(holder.rpcNo, 'RPC Number')}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Certificate No:</span>
                  <span className="font-mono text-slate-700">{holder.certificateNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Serial No:</span>
                  <span className="font-mono text-slate-700">{holder.serialNo}</span>
                </div>
              </div>

              {/* One-click DGCA eGCA Verification for Mobile */}
              <button
                type="button"
                onClick={() => handleVerifyOnDgca(holder.rpcNo)}
                className="w-full py-1.5 px-3 rounded-xl bg-sky-50 hover:bg-[#08245F] text-[#08245F] hover:text-white border border-sky-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
              >
                <span>Verify on official eGCA Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#087FE5]" />
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No matching pilots found. Try clearing your search query.
          </div>
        )}
      </div>

      {/* 6. CALL TO ACTION / ENROLLMENT INVITATION */}
      <div className="bg-linear-to-r from-[#08245F] to-[#087FE5] rounded-3xl p-5 sm:p-7 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-md">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#FFB800] text-[11px] font-bold">
            <Sparkles className="w-3 h-3" />
            BECOME A CERTIFIED DRONE PILOT
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            Ready to Earn Your Official DGCA Remote Pilot Certificate?
          </h2>
          <p className="text-xs text-sky-100 max-w-xl">
            Join the next batch at our DGCA-authorized Kinathukadavu Airfield campus. Hands-on flight simulator sessions, multirotor flight training, and direct 10-year license certification.
          </p>
        </div>

        <button
          onClick={() => openEnrollModal('small-rpc')}
          className="px-6 py-2.5 rounded-xl bg-[#FFB800] hover:bg-[#e5a600] text-[#08245F] font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 shrink-0 cursor-pointer"
        >
          Enroll for Next Batch
        </button>
      </div>
    </div>
  );
};
