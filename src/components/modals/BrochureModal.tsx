import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
  Plane,
  ShieldCheck
} from 'lucide-react';

export const BrochureModal: React.FC = () => {
  const { isBrochureOpen, closeBrochureModal, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasDownloaded, setHasDownloaded] = useState(false);

  if (!isBrochureOpen) return null;

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setHasDownloaded(true);
    showToast('Official RPTO Brochure & Fee Structure generated successfully!', 'success');

    // Simulate instant brochure PDF generation and download
    const element = document.createElement('a');
    const file = new Blob([
      `=======================================================\n` +
      `SRI ESHWAR DRONE TECH PVT LTD - DGCA RPTO\n` +
      `Kinathukadavu, Coimbatore, Tamil Nadu - 641202\n` +
      `RPTO Authorization No: DGCA/RPTO-TN 21/2024\n` +
      `=======================================================\n\n` +
      `OFFICIAL 2026 COURSE FEE & SYLLABUS SCHEDULE:\n\n` +
      `1. Small Category RPC (2-25 kg) — 5 Days: ₹23,000 (inc. GST)\n` +
      `2. Medium Category RPC (25-150 kg) — 5 Days: ₹27,500 (inc. GST)\n` +
      `3. Small Category Upgrade — 3 Days: ₹20,500\n` +
      `4. Medium Category Upgrade — 3 Days: ₹24,000\n` +
      `5. Dual Combo Master Program (Small + Medium) — 7 Days: ₹42,500\n\n` +
      `CAMPUS FACILITIES:\n` +
      `- 15+ Acre Kinathukadavu Dedicated Airfield\n` +
      `- 12 Dual-Cockpit PX4/RealFlight Simulators\n` +
      `- Hardware Repair & Avionics Assembly Rig\n` +
      `- 10-Year Valid Digital Sky Remote Pilot License\n\n` +
      `ADMISSIONS HELPLINE & DIRECT CONTACTS:\n` +
      `Accountable Manager: +91 95006 35060\n` +
      `Chief Instructor: +91 98947 43267\n` +
      `Email: dronetech@sece.ac.in\n` +
      `Website: Sri Eshwar Campus, Coimbatore\n`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'Sri_Eshwar_Drone_Tech_RPTO_Brochure_2026.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#08245F] to-[#073B8F] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-[#FFB800]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide">
                Download Official RPTO Prospectus
              </h3>
              <p className="text-[10px] text-slate-300">
                2026 Course Catalog, DGCA Exam Syllabus & Fee Structure
              </p>
            </div>
          </div>
          <button
            onClick={closeBrochureModal}
            className="cursor-pointer text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {hasDownloaded ? (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-900">
                Brochure Downloaded Successfully!
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The comprehensive course syllabus, fee schedule, and hostel information has been saved to your device.
              </p>
              <button
                onClick={closeBrochureModal}
                className="cursor-pointer text-xs font-bold text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] px-4 py-2 rounded-xl shadow-xs transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleDownload} className="space-y-3">
              <div className="bg-[#F4FAFF] border border-[#CFEAFF] rounded-xl p-3 space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-[#08245F] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  What is included in the Prospectus?
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                  <li>Full 5-Day DGCA Remote Pilot syllabus breakdown</li>
                  <li>Fee invoices with installment & subsidy schemes</li>
                  <li>Agri, Solar & Wind industrial inspection modules</li>
                  <li>Kinathukadavu campus map & hostel guidelines</li>
                </ul>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98400 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#087FE5] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#087FE5] outline-none"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full py-2.5 px-4 rounded-xl text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 shadow-md transition-all uppercase tracking-wide flex items-center justify-center gap-2 mt-2"
              >
                <Download className="w-4 h-4" />
                <span>Instant Download Syllabus & Fees</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
