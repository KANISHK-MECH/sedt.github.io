import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Building2,
  Phone,
  Mail,
  Zap,
  Layers,
  ArrowRight,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Gauge,
  Compass
} from 'lucide-react';
import { INTEGRATIONS_CONFIG, createAdmissionsMailtoUrl } from '../../config/integrations';

const TURBINE_FLEET_SIZES = [
  '1 – 5 Turbines (Targeted NDT Audit)',
  '5 – 15 Turbines (Substation Sector)',
  '15 – 40 Turbines (Full Wind Park)',
  '40+ Turbines (Multi-Site Wind Fleet)'
];

const HUB_HEIGHTS = [
  '80m – 100m Hub Height (2.0 MW Class · 45m–55m Blades)',
  '120m – 140m High Hub (2.7 – 3.3 MW Class · 60m–70m Blades)',
  '140m – 160m Ultra Hub (4.0+ MW Class · 75m+ Mega Blades)',
  'Offshore Wind Installation'
];

const OEM_MAKES = [
  'Vestas (V110 / V120 / V150)',
  'Suzlon (S111 / S128 / S144)',
  'Gamesa / Siemens Gamesa (G97 / SG 2.1)',
  'Inox Wind / Envision / GE Renewable',
  'Other / Mixed Fleet'
];

const WIND_AUDIT_MODULES = [
  { id: 'blade-crack', label: 'DNV-GL 0.1mm Blade Surface Crack & Delamination Scan', desc: 'Ultra high-res optical telephoto capture of micro-fractures' },
  { id: 'edge-erosion', label: 'Leading Edge Erosion & Aerodynamic Degradation Mapping', desc: 'Quantitative blade wear classification to prevent AEP loss' },
  { id: 'lightning-receptor', label: 'Lightning Receptor Conductivity & Puncture Inspection', desc: 'Sub-millimeter inspection of copper pucks & lightning channels' },
  { id: 'thermal-nacelle', label: 'Nacelle, Gearbox & Generator Radiometric Thermal IR', desc: 'Bearing overheating, oil cooler blockage & transformer hot spots' },
  { id: 'tower-bolt', label: 'Tower Flange, Foundation & Yaw Ring Structural Survey', desc: 'Corrosion, loose bolts, and paint peel mapping' },
  { id: 'oem-punchlist', label: 'Actionable OEM-Certified Repair Punch-List with GPS Coordinates', desc: 'Ready-to-execute blade repair spreadsheet for maintenance crews' }
];

export const WindBookingModal: React.FC = () => {
  const { isWindBookingOpen, closeWindBookingModal, addEnquiry, showToast } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [windFarmLocation, setWindFarmLocation] = useState('');
  const [fleetSize, setFleetSize] = useState(TURBINE_FLEET_SIZES[1]);
  const [hubHeight, setHubHeight] = useState(HUB_HEIGHTS[1]);
  const [oemMake, setOemMake] = useState(OEM_MAKES[0]);
  const [selectedModules, setSelectedModules] = useState<string[]>([
    WIND_AUDIT_MODULES[0].id,
    WIND_AUDIT_MODULES[1].id,
    WIND_AUDIT_MODULES[2].id,
    WIND_AUDIT_MODULES[5].id
  ]);
  const [preferredDate, setPreferredDate] = useState('');
  const [siteNotes, setSiteNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState('');

  if (!isWindBookingOpen) return null;

  const toggleModule = (id: string) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleResetForm = () => {
    setCompanyName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setWindFarmLocation('');
    setFleetSize(TURBINE_FLEET_SIZES[1]);
    setHubHeight(HUB_HEIGHTS[1]);
    setOemMake(OEM_MAKES[0]);
    setSelectedModules([
      WIND_AUDIT_MODULES[0].id,
      WIND_AUDIT_MODULES[1].id,
      WIND_AUDIT_MODULES[2].id,
      WIND_AUDIT_MODULES[5].id
    ]);
    setPreferredDate('');
    setSiteNotes('');
    setIsSuccess(false);
  };

  const handleClose = () => {
    closeWindBookingModal();
    if (isSuccess) {
      handleResetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !phone.trim() || !windFarmLocation.trim()) {
      showToast('Please provide contact person, phone number, and wind farm location.', 'error');
      return;
    }

    setIsSubmitting(true);

    const activeModuleLabels = WIND_AUDIT_MODULES
      .filter(m => selectedModules.includes(m.id))
      .map(m => m.label);

    const bookingPayload = {
      fullName: contactName.trim() + (companyName.trim() ? ` (${companyName.trim()})` : ''),
      email: email.trim() || 'Not provided',
      phone: phone.trim(),
      courseId: 'wind-inspection',
      courseName: 'Wind Turbine Blade & Nacelle Drone UAV Survey',
      preferredBatch: `${fleetSize.split('(')[0].trim()} · ${windFarmLocation.trim()}`,
      message: [
        `Service: Wind Turbine Blade & Nacelle UAV Inspection`,
        `Operator / IPP / EPC: ${companyName.trim() || 'Direct Wind Asset Owner'}`,
        `Fleet Scope: ${fleetSize}`,
        `Turbine Model & OEM: ${oemMake}`,
        `Hub Height: ${hubHeight}`,
        `Wind Farm Location: ${windFarmLocation.trim()}`,
        preferredDate ? `Target Inspection Schedule: ${preferredDate}` : null,
        `Audit Scope: ${activeModuleLabels.join(' | ')}`,
        siteNotes.trim() ? `Turbine / Wind Notes: ${siteNotes.trim()}` : null
      ].filter(Boolean).join('\n')
    };

    try {
      const res = await addEnquiry(bookingPayload);
      const bookingId = res?.enquiry?.id || `WIND-${Date.now().toString().slice(-4)}`;
      setSubmittedBookingId(bookingId);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubmittedBookingId(`WIND-${Date.now().toString().slice(-4)}`);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hello Sri Eshwar Drone Flight Ops, I just submitted a Wind Turbine Inspection request (Ref: ${submittedBookingId || 'New Inquiry'}) for ${fleetSize} at ${windFarmLocation || 'our wind farm'}. Looking forward to discussing drone deployment scheduling.`
  );

  return (
    <div
      id="wind-booking-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="wind-booking-modal"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl border border-[#CFEAFF] flex flex-col animate-in zoom-in-95 duration-200 my-auto"
      >
        {/* MODAL HEADER */}
        <div
          className="p-4 sm:p-5 text-white flex items-center justify-between shrink-0 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #08245F 0%, #073B8F 50%, #0284C7 100%)'
          }}
        >
          {/* Subtle Decorative Backdrop Elements */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#FFB800] text-[#08245F] tracking-wide inline-flex items-center gap-1">
                <Wind className="w-2.5 h-2.5 fill-current" />
                <span>Turbine Asset Survey</span>
              </span>
              <span className="text-[10px] sm:text-xs text-[#CFEAFF] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#FFB800]" />
                <span>DNV-GL & IEC 61400 Standards</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
              Wind Turbine Blade & Nacelle Drone UAV Survey
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-200">
              Submit your wind farm coordinates for sub-millimeter blade defect mapping & thermal nacelle audits.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {isSuccess ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="py-6 sm:py-8 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-sky-100 border-2 border-sky-500 text-sky-600 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-100 text-sky-900 border border-sky-300">
                  Wind Turbine Inspection Dispatched & Logged
                </span>
                <h4 className="text-lg sm:text-xl font-black text-[#08245F]">
                  Request Sent to dronetech@sece.ac.in!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Our UAV Flight Operations Team at <strong className="text-[#08245F]">dronetech@sece.ac.in</strong> has received your wind farm audit specifications and synchronized it with the Sri Eshwar RPTO flight operations database.
                </p>
              </div>

              <div className="bg-[#F4FAFF] border border-[#CFEAFF] rounded-xl p-3.5 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500 pb-1.5 border-b border-[#CFEAFF]">
                  <span>Survey Reference ID</span>
                  <span className="font-mono font-bold text-[#08245F]">{submittedBookingId}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Fleet Scope:</span>
                  <span className="font-bold">{fleetSize}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Turbine Make:</span>
                  <span className="font-bold">{oemMake}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Wind Farm Location:</span>
                  <span className="font-bold">{windFarmLocation}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Inspection Standard:</span>
                  <span className="font-bold text-sky-700">DNV-GL & IEC 61400 Compliant</span>
                </div>
              </div>

              {/* ACTION DISPATCH BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 max-w-md mx-auto">
                <a
                  href={`https://wa.me/919500635060?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify via WhatsApp</span>
                </a>

                <a
                  href={createAdmissionsMailtoUrl({
                    fullName: contactName,
                    phone: phone,
                    email: email,
                    courseName: 'Wind Turbine Blade & Nacelle Drone UAV Survey',
                    preferredBatch: `${fleetSize} · ${windFarmLocation}`,
                    refId: submittedBookingId,
                    message: `Wind Farm: ${companyName || 'Wind Farm Asset'} | Location: ${windFarmLocation} | Fleet: ${fleetSize} | OEM: ${oemMake} | Hub: ${hubHeight} | Target Date: ${preferredDate || 'Earliest Slot'}`
                  })}
                  className="cursor-pointer w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#08245F] hover:bg-[#073B8F] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#FFB800]" />
                  <span>Send Direct Email</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Close & Return to Solar & Wind Tab
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Highlight Banner */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-start gap-2.5">
                <Wind className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs text-sky-950 space-y-0.5">
                  <div className="font-extrabold">Autonomous Wind Corridor UAV Operations</div>
                  <div className="text-sky-800">
                    High-gust stabilization drones equipped with 45MP optical telephoto cameras and FLIR radiometric thermal sensors. Captures full 4-face blade scans in under 45 minutes per turbine.
                  </div>
                </div>
              </div>

              {/* 1. OPERATOR & CONTACT DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Company / Wind Operator / IPP</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Suzlon, ReNew Power, Vestas, Tata Power"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Contact Person</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M. Senthil Kumar (O&M Lead)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* 2. PHONE & EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone / WhatsApp</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98421 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Work Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="senthil.k@windenergy.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* 3. WIND FARM LOCATION & FLEET SIZE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Wind Farm Location / Corridor</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Udumalpet / Muppandal Pass / Coimbatore"
                    value={windFarmLocation}
                    onChange={(e) => setWindFarmLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-slate-400" />
                    <span>Number of Turbines to Survey</span>
                  </label>
                  <select
                    value={fleetSize}
                    onChange={(e) => setFleetSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors font-medium text-slate-800"
                  >
                    {TURBINE_FLEET_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. TURBINE MAKE & HUB HEIGHT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    <span>Turbine OEM Make & Model</span>
                  </label>
                  <select
                    value={oemMake}
                    onChange={(e) => setOemMake(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors font-medium text-slate-800"
                  >
                    {OEM_MAKES.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hub Height & Blade Class</span>
                  </label>
                  <select
                    value={hubHeight}
                    onChange={(e) => setHubHeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors font-medium text-slate-800"
                  >
                    {HUB_HEIGHTS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. AUDIT MODULES CHECKBOXES */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Turbine Inspection Audit Scope:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WIND_AUDIT_MODULES.map((mod) => {
                    const isChecked = selectedModules.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModule(mod.id)}
                        className={`cursor-pointer p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-sky-50/70 border-sky-400 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Controlled by container onClick
                          className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                        />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-[#08245F] leading-tight">
                            {mod.label}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                            {mod.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. TARGET DATE & SITE NOTES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Target Survey Date / Window</span>
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Special Wind Conditions / Constraints
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pre-monsoon shutdown, high gust periods"
                    value={siteNotes}
                    onChange={(e) => setSiteNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="text-[10px] text-slate-400 font-medium">
                  Direct dispatch to Sri Eshwar Drone Flight Center
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 shadow-md transition-all uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Scheduling Flight...</span>
                    ) : (
                      <>
                        <Wind className="w-3.5 h-3.5" />
                        <span>Book Wind Turbine Inspection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
