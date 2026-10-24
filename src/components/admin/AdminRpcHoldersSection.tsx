import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RpcHolder } from '../../types';
import {
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Copy,
  Check,
  X,
  Save,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  Filter,
  FileSpreadsheet,
  ExternalLink
} from 'lucide-react';

export const AdminRpcHoldersSection: React.FC = () => {
  const { rpcHolders, addRpcHolder, updateRpcHolder, deleteRpcHolder, showToast } = useApp();

  const DGCA_VERIFY_URL = 'https://www.dgca.gov.in/digigov-portal/';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHolder, setEditingHolder] = useState<RpcHolder | null>(null);

  // Form for Add New RPC Holder
  const [newHolderForm, setNewHolderForm] = useState<{
    serialNo: string;
    certificateNo: string;
    rpcNo: string;
    name: string;
    issueYear: string;
    category: string;
    status: 'Verified' | 'Active';
  }>({
    serialNo: '',
    certificateNo: '',
    rpcNo: '',
    name: '',
    issueYear: '2026',
    category: 'Small Category (Multirotor)',
    status: 'Verified'
  });

  // Calculate next recommended serial number when opening Add Modal
  const handleOpenAddModal = () => {
    const currentYear = new Date().getFullYear().toString();
    const count = rpcHolders.length + 1;
    const padded = count.toString().padStart(3, '0');
    setNewHolderForm({
      serialNo: `${currentYear}-SEDT-S${padded}`,
      certificateNo: `SEDT${currentYear.slice(-2)}01${padded}`,
      rpcNo: '',
      name: '',
      issueYear: currentYear,
      category: 'Small Category (Multirotor)',
      status: 'Verified'
    });
    setShowAddModal(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast(`Copied: ${text}`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerifyOnDgca = (rpcNo?: string) => {
    if (rpcNo) {
      navigator.clipboard.writeText(rpcNo);
      showToast(`Copied RPC "${rpcNo}"! Opening official eGCA Portal...`, 'success');
    } else {
      showToast('Opening official eGCA Verification Portal...', 'info');
    }
    window.open(DGCA_VERIFY_URL, '_blank', 'noopener,noreferrer');
  };

  // Year metrics
  const yearStats = useMemo(() => {
    const stats: Record<string, number> = { total: rpcHolders.length, '2024': 0, '2025': 0, '2026': 0 };
    rpcHolders.forEach((h) => {
      const yr = h.issueYear || (h.serialNo.startsWith('2024') ? '2024' : h.serialNo.startsWith('2025') ? '2025' : '2026');
      if (stats[yr] !== undefined) stats[yr]++;
      else stats[yr] = 1;
    });
    return stats;
  }, [rpcHolders]);

  // Filtered list
  const filteredList = useMemo(() => {
    return rpcHolders.filter((holder) => {
      const yr = holder.issueYear || (holder.serialNo.startsWith('2024') ? '2024' : holder.serialNo.startsWith('2025') ? '2025' : '2026');
      const matchesYear = selectedYear === 'all' || yr === selectedYear;

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

  // Handle Add Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolderForm.name.trim() || !newHolderForm.rpcNo.trim() || !newHolderForm.certificateNo.trim() || !newHolderForm.serialNo.trim()) {
      showToast('All fields are required', 'error');
      return;
    }

    await addRpcHolder(newHolderForm);
    setShowAddModal(false);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHolder) return;

    if (!editingHolder.name.trim() || !editingHolder.rpcNo.trim() || !editingHolder.certificateNo.trim() || !editingHolder.serialNo.trim()) {
      showToast('All fields are required', 'error');
      return;
    }

    await updateRpcHolder(editingHolder);
    setEditingHolder(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['S.No', 'Candidate Serial No', 'Certificate No', 'RPC No', 'Name of the RPC Holder', 'Issue Year', 'Category', 'Status'];
    const rows = filteredList.map((h, i) => [
      i + 1,
      `"${h.serialNo}"`,
      `"${h.certificateNo}"`,
      `"${h.rpcNo}"`,
      `"${h.name}"`,
      `"${h.issueYear || '2024'}"`,
      `"${h.category || 'Small Category'}"`,
      `"${h.status || 'Verified'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DGCA_RPC_Holders_Admin_${selectedYear === 'all' ? 'All' : selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported RPC Holders list to CSV', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* 1. HEADER & METRICS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#08245F] text-[#FFB800] flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#08245F] uppercase tracking-wide">
                DGCA Remote Pilot Certificate (RPC) Registry
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Centralized record management of all certified pilots trained and issued licenses under DGCA RPTO Authorization <strong>DGCA/RPTO-TN 21/2024</strong>. Changes persist directly to <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">data/rpto-db.json</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleVerifyOnDgca()}
              className="cursor-pointer text-xs font-bold text-white bg-[#08245F] hover:bg-[#0c2e78] px-3 py-2 rounded-xl border border-sky-400/30 transition-all flex items-center gap-1.5 shadow-2xs"
              title="Open Official DGCA DigiGov Verification Portal (Option 3)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
              <span className="hidden sm:inline">DGCA DigiGov Portal</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="cursor-pointer text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="cursor-pointer text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 uppercase tracking-wide active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Add RPC Holder</span>
            </button>
          </div>
        </div>

        {/* Quick metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Licensed Pilots
            </span>
            <span className="text-xl font-black text-[#08245F] mt-0.5 block">
              {yearStats.total}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> 100% DGCA Passing Rate
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              2024 Cohort
            </span>
            <span className="text-xl font-black text-blue-600 mt-0.5 block">
              {yearStats['2024'] || 0}
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              Foundational Batches
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              2025 Cohort
            </span>
            <span className="text-xl font-black text-amber-600 mt-0.5 block">
              {yearStats['2025'] || 0}
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              Industrial & Multi-category
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              2026 Active Cohort
            </span>
            <span className="text-xl font-black text-emerald-600 mt-0.5 block">
              {yearStats['2026'] || 0}
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              Current Certified Roster
            </span>
          </div>
        </div>
      </div>

      {/* 2. TOOLBAR: SEARCH & YEAR FILTER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Year Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', '2024', '2025', '2026'] as const).map((year) => {
            const count = year === 'all' ? yearStats.total : yearStats[year] || 0;
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#08245F] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{year === 'all' ? 'All Cohorts' : `${year} Cohort`}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, RPC #, cert..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#087FE5]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. RPC HOLDERS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-[#08245F] tracking-wider">
                <th className="py-3 px-3.5 w-12 text-center">#</th>
                <th className="py-3 px-3.5">Candidate Serial No</th>
                <th className="py-3 px-3.5">Certificate No</th>
                <th className="py-3 px-3.5">RPC No</th>
                <th className="py-3 px-3.5">Name of the RPC Holder</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length > 0 ? (
                filteredList.map((holder, idx) => {
                  const isCopied = copiedId === holder.rpcNo;
                  return (
                    <tr
                      key={holder.id || `${holder.serialNo}-${idx}`}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-2.5 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-3.5 font-mono font-semibold text-slate-800">
                        <span className="inline-block bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                          {holder.serialNo}
                        </span>
                      </td>

                      <td className="py-2.5 px-3.5 font-mono text-slate-700">
                        {holder.certificateNo}
                      </td>

                      <td className="py-2.5 px-3.5">
                        <div className="inline-flex items-center space-x-1.5 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/80">
                          <span className="font-mono font-bold text-[#08245F] text-[11px]">
                            {holder.rpcNo}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(holder.rpcNo)}
                            title="Copy RPC Number"
                            className="p-0.5 rounded hover:bg-white text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {isCopied ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-[#08245F] flex items-center justify-center font-bold text-[10px] border border-amber-300 shrink-0">
                            {holder.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900 uppercase text-xs">
                            {holder.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3.5 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          {holder.status || 'Verified'}
                        </span>
                      </td>

                      <td className="py-2.5 px-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            type="button"
                            onClick={() => handleVerifyOnDgca(holder.rpcNo)}
                            title={`Verify ${holder.rpcNo} on DGCA DigiGov Portal`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#08245F] hover:bg-sky-50 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#087FE5]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingHolder({ ...holder })}
                            title="Edit this RPC Holder record"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              deleteRpcHolder(holder.id);
                            }}
                            title="Delete this RPC Holder record"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    <p className="font-bold text-xs">No matching candidate records found</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedYear('all');
                      }}
                      className="mt-2 text-[11px] text-blue-600 font-bold hover:underline"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div>
            Showing <strong>{filteredList.length}</strong> of <strong>{rpcHolders.length}</strong> candidates
          </div>
          <div>All updates are immediately persisted to central database file</div>
        </div>
      </div>

      {/* 4. MODAL: ADD NEW RPC HOLDER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#FFB800] text-[#08245F] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm uppercase text-[#08245F]">Add Certified RPC Holder</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Candidate Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MAHABOOB.M"
                  value={newHolderForm.name}
                  onChange={(e) => setNewHolderForm({ ...newHolderForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] uppercase font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Candidate Serial No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2026-SEDT-S049"
                    value={newHolderForm.serialNo}
                    onChange={(e) => setNewHolderForm({ ...newHolderForm, serialNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Certificate No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SEDT2601049"
                    value={newHolderForm.certificateNo}
                    onChange={(e) => setNewHolderForm({ ...newHolderForm, certificateNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  DGCA RPC No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 21240101P21MM or RP202600000305"
                  value={newHolderForm.rpcNo}
                  onChange={(e) => setNewHolderForm({ ...newHolderForm, rpcNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] font-mono font-bold text-[#08245F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Issue Year</label>
                  <select
                    value={newHolderForm.issueYear}
                    onChange={(e) => setNewHolderForm({ ...newHolderForm, issueYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] bg-white font-medium"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">DGCA Status</label>
                  <select
                    value={newHolderForm.status}
                    onChange={(e) => setNewHolderForm({ ...newHolderForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] bg-white font-medium"
                  >
                    <option value="Verified">Verified & Active</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#08245F] hover:bg-[#0c2e78] text-white font-bold cursor-pointer shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: EDIT RPC HOLDER */}
      {editingHolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm uppercase text-[#08245F]">Edit Candidate RPC Record</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingHolder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={editingHolder.name}
                  onChange={(e) => setEditingHolder({ ...editingHolder, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] uppercase font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Candidate Serial No</label>
                  <input
                    type="text"
                    required
                    value={editingHolder.serialNo}
                    onChange={(e) => setEditingHolder({ ...editingHolder, serialNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Certificate No</label>
                  <input
                    type="text"
                    required
                    value={editingHolder.certificateNo}
                    onChange={(e) => setEditingHolder({ ...editingHolder, certificateNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">DGCA RPC No</label>
                <input
                  type="text"
                  required
                  value={editingHolder.rpcNo}
                  onChange={(e) => setEditingHolder({ ...editingHolder, rpcNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] font-mono font-bold text-[#08245F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Issue Year</label>
                  <select
                    value={editingHolder.issueYear || '2024'}
                    onChange={(e) => setEditingHolder({ ...editingHolder, issueYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] bg-white font-medium"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">DGCA Status</label>
                  <select
                    value={editingHolder.status || 'Verified'}
                    onChange={(e) => setEditingHolder({ ...editingHolder, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087FE5] bg-white font-medium"
                  >
                    <option value="Verified">Verified & Active</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingHolder(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
