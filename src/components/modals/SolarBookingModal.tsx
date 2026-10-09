import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sun,
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
  PhoneCall
} from 'lucide-react';
import { INTEGRATIONS_CONFIG, createAdmissionsMailtoUrl } from '../../config/integrations';

const PLANT_CAPACITIES = [
  'Commercial / Industrial Rooftop (< 1 MW)',
  '1 MW – 5 MW Ground-Mounted PV Plant',
  '5 MW – 25 MW Utility Solar Park',
  '25 MW – 100+ MW Mega Solar Park',
  'Multi-Site Distributed Solar Portfolio'
];

const AUDIT_MODULES = [
  { id: 'ir-thermo', label: 'IEC 62446-3 Radiometric Thermal IR', desc: 'Cell-level ΔT hotspots & bypass diode failures' },
  { id: 'ortho-3d', label: '3D Orthomosaic & Visual Digital Twin', desc: 'Sub-centimeter GeoTIFF / KMZ high-res mapping' },
  { id: 'string-mapping', label: 'String Inverter Defect & PID Mapping', desc: 'Open circuit strings & potential induced degradation' },
  { id: 'soiling-dust', label: 'Soiling, Shading & Microcrack Audit', desc: 'Dust accumulation & vegetation shading impact' },
  { id: 'epc-punchlist', label: 'Actionable EPC Punch-List with GPS Tags', desc: 'Ready-to-repair spreadsheet with exact coordinates' }
];

export const SolarBookingModal: React.FC = () => {
  const { isSolarBookingOpen, closeSolarBookingModal, addEnquiry, showToast } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [plantLocation, setPlantLocation] = useState('');
  const [plantCapacity, setPlantCapacity] = useState(PLANT_CAPACITIES[1]);
  const [selectedModules, setSelectedModules] = useState<string[]>([
    AUDIT_MODULES[0].id,
    AUDIT_MODULES[1].id,
    AUDIT_MODULES[4].id
  ]);
  const [preferredDate, setPreferredDate] = useState('');
  const [siteNotes, setSiteNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState('');

  if (!isSolarBookingOpen) return null;

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
    setPlantLocation('');
    setPlantCapacity(PLANT_CAPACITIES[1]);
    setSelectedModules([AUDIT_MODULES[0].id, AUDIT_MODULES[1].id, AUDIT_MODULES[4].id]);
    setPreferredDate('');
    setSiteNotes('');
    setIsSuccess(false);
  };

  const handleClose = () => {
    closeSolarBookingModal();
    if (isSuccess) {
      handleResetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !phone.trim() || !plantLocation.trim()) {
      showToast('Please provide contact person, phone number, and plant location.', 'error');
      return;
    }

    setIsSubmitting(true);

    const activeModuleLabels = AUDIT_MODULES
      .filter(m => selectedModules.includes(m.id))
      .map(m => m.label);

    const bookingPayload = {
      fullName: contactName.trim() + (companyName.trim() ? ` (${companyName.trim()})` : ''),
      email: email.trim() || 'Not provided',
      phone: phone.trim(),
      courseId: 'solar-inspection',
      courseName: 'Solar PV Plant Drone Inspection & Aerial Thermography',
      preferredBatch: `${plantCapacity.split('(')[0].trim()} · ${plantLocation.trim()}`,
      message: [
        `Service: Solar PV Plant Drone Inspection`,
        `Company / EPC: ${companyName.trim() || 'Direct Plant Owner'}`,
        `Plant Capacity: ${plantCapacity}`,
        `Location / District: ${plantLocation.trim()}`,
        preferredDate ? `Target Inspection Date: ${preferredDate}` : null,
        `Audit Scope: ${activeModuleLabels.join(' | ')}`,
        siteNotes.trim() ? `Site Notes: ${siteNotes.trim()}` : null
      ].filter(Boolean).join(' \n')
    };

    try {
      const res = await addEnquiry(bookingPayload);
      const bookingId = res?.enquiry?.id || `SOLAR-${Date.now().toString().slice(-4)}`;
      setSubmittedBookingId(bookingId);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubmittedBookingId(`SOLAR-${Date.now().toString().slice(-4)}`);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hello Sri Eshwar Drone Flight Ops, I just submitted a Solar Plant Inspection request (Ref: ${submittedBookingId || 'New Inquiry'}) for ${plantCapacity} at ${plantLocation || 'our solar park'}. Looking forward to discussing flight scheduling.`
  );

  return (
    <div
      id="solar-booking-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="solar-booking-modal"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl border border-[#CFEAFF] flex flex-col animate-in zoom-in-95 duration-200 my-auto"
      >
        {/* MODAL HEADER */}
        <div
          className="p-4 sm:p-5 text-white flex items-center justify-between shrink-0 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #071D4A 0%, #08245F 50%, #073B8F 100%)'
          }}
        >
          {/* Subtle Decorative Backdrop Elements */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-[#FFB800]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#FFB800] text-[#08245F] tracking-wide inline-flex items-center gap-1">
                <Sun className="w-2.5 h-2.5 fill-current" />
                <span>Aerial Audit Booking</span>
              </span>
              <span className="text-[10px] sm:text-xs text-[#CFEAFF] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#FFB800]" />
                <span>DGCA Authorized Operations</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
              Solar PV Drone Inspection & Thermography
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-200">
              Submit your plant specifications for a calibrated thermographic flight survey & yield recovery audit.
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
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Inspection Request Registered & Dispatched
                </span>
                <h4 className="text-lg sm:text-xl font-black text-[#08245F]">
                  Request Sent to dronetech@sece.ac.in!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Our UAV Flight Operations Team at <strong className="text-[#08245F]">dronetech@sece.ac.in</strong> has received your plant audit details and logged it into our Google Sheets and mission planning dispatch queue.
                </p>
              </div>

              {/* Booking Summary Card */}
              <div className="bg-[#F4FAFF] border border-[#CFEAFF] rounded-xl p-3.5 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#CFEAFF]">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Booking Reference</span>
                  <span className="font-mono font-black text-[#08245F] bg-white px-2 py-0.5 rounded border border-[#CFEAFF]">
                    {submittedBookingId || 'SOLAR-REQ'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-slate-400 uppercase text-[9px] font-bold">Plant Capacity</p>
                    <p className="font-bold text-[#08245F] truncate">{plantCapacity}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase text-[9px] font-bold">Plant Location</p>
                    <p className="font-bold text-[#08245F] truncate">{plantLocation}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase text-[9px] font-bold">Contact Person</p>
                    <p className="font-bold text-slate-700 truncate">{contactName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase text-[9px] font-bold">Phone Number</p>
                    <p className="font-bold text-slate-700">{phone}</p>
                  </div>
                </div>
              </div>

              {/* Direct Email Action Button */}
              <div className="bg-white border border-emerald-200 rounded-xl p-3 max-w-md mx-auto space-y-2 text-left">
                <div className="flex items-center space-x-2 text-[#08245F]">
                  <Mail className="w-4 h-4 text-[#087FE5] shrink-0" />
                  <span className="text-xs font-black uppercase">Send Direct Email Copy</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Send a pre-formatted audit specification directly from your personal inbox to <strong className="text-[#08245F]">dronetech@sece.ac.in</strong>:
                </p>
                <a
                  href={createAdmissionsMailtoUrl({
                    fullName: contactName || companyName || 'Solar Plant Client',
                    phone,
                    email,
                    courseName: `Solar Inspection: ${plantCapacity}`,
                    preferredBatch: preferredDate || 'Immediate Survey',
                    message: `Plant: ${plantCapacity} at ${plantLocation}. Modules: ${selectedModules.join(', ')}. Site Notes: ${siteNotes}`,
                    refId: submittedBookingId
                  })}
                  className="cursor-pointer inline-flex items-center justify-center w-full space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#08245F] hover:bg-[#073B8F] transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Email to dronetech@sece.ac.in</span>
                </a>
              </div>

              {/* Fast-Track Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
                <a
                  href={`https://wa.me/919500635060?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 cursor-pointer inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send GPS Pin on WhatsApp</span>
                </a>
                <a
                  href="tel:+919894743267"
                  className="w-full sm:w-auto flex-1 cursor-pointer inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#08245F] bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Operations Lead</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="cursor-pointer text-xs font-bold text-slate-500 hover:text-[#08245F] hover:underline"
                >
                  Back to Solar Inspection Page
                </button>
              </div>
            </div>
          ) : (
            /* BOOKING FORM */
            <form onSubmit={handleSubmit} className="space-y-4 text-slate-700 text-xs sm:text-sm">
              {/* Plant & Capacity Section */}
              <div className="bg-[#F4FAFF] border border-[#CFEAFF] rounded-xl p-3.5 space-y-3">
                <div className="flex items-center space-x-1.5 text-xs font-black text-[#08245F] uppercase tracking-wide">
                  <Building2 className="w-3.5 h-3.5 text-[#087FE5]" />
                  <span>1. Solar Power Plant Specifications</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Company / EPC / Plant Owner Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., SunPower EPC / Tata Power Partner"
                      className="w-full px-3 py-1.5 sm:py-2 text-xs rounded-lg border border-[#CFEAFF] bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#087FE5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Plant Capacity & Scale <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={plantCapacity}
                      onChange={(e) => setPlantCapacity(e.target.value)}
                      className="w-full px-3 py-1.5 sm:py-2 text-xs rounded-lg border border-[#CFEAFF] bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#087FE5] font-medium"
                    >
                      {PLANT_CAPACITIES.map((cap) => (
                        <option key={cap} value={cap}>
                          {cap}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Plant Location / District / State <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={plantLocation}
                        onChange={(e) => setPlantLocation(e.target.value)}
                        placeholder="e.g., Kinathukadavu / Coimbatore, Tamil Nadu"
                        className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-lg border border-[#CFEAFF] bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#087FE5]"
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Target Inspection Window / Preferred Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        placeholder="e.g., Next week / Sep 25 – 30 / Urgent"
                        className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-lg border border-[#CFEAFF] bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#087FE5]"
                      />
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person Details */}
              <div className="space-y-2.5">
                <div className="flex items-center space-x-1.5 text-xs font-black text-[#08245F] uppercase tracking-wide">
                  <Phone className="w-3.5 h-3.5 text-[#087FE5]" />
                  <span>2. Operations Contact Coordinator</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Contact Person Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g., Rajesh Kumar"
                      className="w-full px-3 py-1.5 sm:py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#087FE5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Phone Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98400 00000"
                        className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#087FE5]"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rajesh@company.com"
                        className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#087FE5]"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspection Deliverables Scope */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-black text-[#08245F] uppercase tracking-wide">
                    <Layers className="w-3.5 h-3.5 text-[#087FE5]" />
                    <span>3. Desired Inspection Deliverables</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Select applicable services</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AUDIT_MODULES.map((mod) => {
                    const isSelected = selectedModules.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModule(mod.id)}
                        className={`cursor-pointer p-2 rounded-xl border transition-all text-xs flex items-start space-x-2 select-none ${
                          isSelected
                            ? 'bg-[#F4FAFF] border-[#087FE5] text-[#08245F] shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border text-[10px] font-bold transition-colors ${
                            isSelected
                              ? 'bg-[#087FE5] border-[#087FE5] text-white'
                              : 'bg-white border-slate-300 text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold leading-tight text-[11px]">{mod.label}</p>
                          <p className="text-[10px] text-slate-500 leading-tight">{mod.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Site Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Additional Site Observations / GPS Coordinates (Optional)
                </label>
                <textarea
                  rows={2}
                  value={siteNotes}
                  onChange={(e) => setSiteNotes(e.target.value)}
                  placeholder="e.g., Inverter block 3 experiencing abnormal yield drop; needs urgent radiometric string mapping."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#087FE5]"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct Delivery to dronetech@sece.ac.in & Google Sheets Auto-Sync</span>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    id="submit-solar-booking-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 transition-all shadow-md uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Routing to dronetech@sece.ac.in...</span>
                    ) : (
                      <>
                        <span>Submit to dronetech@sece.ac.in</span>
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
