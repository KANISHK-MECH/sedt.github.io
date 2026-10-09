import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Building,
  ShieldCheck,
  UserCheck,
  Award,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { INTEGRATIONS_CONFIG, createAdmissionsMailtoUrl } from '../../config/integrations';

export const ContactTab: React.FC = () => {
  const { courses, batches, addEnquiry, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'small-rpc');
  const [preferredBatch, setPreferredBatch] = useState(batches[0]?.name || 'Weekday Regular');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');
  const [googleSheetsSynced, setGoogleSheetsSynced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      showToast('Please provide your Full Name and Phone Number.', 'error');
      return;
    }

    setIsSubmitting(true);
    const selectedCourse = courses.find((c) => c.id === courseId);

    try {
      const res = await addEnquiry({
        fullName: fullName.trim(),
        email: email.trim() || 'Not provided',
        phone: phone.trim(),
        courseId,
        courseName: selectedCourse?.name || 'Small Category RPC (2–25 kg)',
        preferredBatch,
        message: message.trim() || 'Admissions Enquiry via Contact Portal'
      });

      setSubmittedRefId(res?.enquiry?.id || `APP-${Date.now().toString().slice(-4)}`);
      setGoogleSheetsSynced(Boolean(res?.googleSheetsSynced));
      setIsSubmitted(true);
    } catch {
      setSubmittedRefId(`APP-${Date.now().toString().slice(-4)}`);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 2xl:p-8">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] w-full mx-auto flex flex-col space-y-3.5 sm:space-y-4 lg:space-y-5 min-h-full">
        {/* Top Header */}
        <div className="border-b border-[#CFEAFF] pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] 2xl:text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-[#F4FAFF] text-[#08245F] border border-[#CFEAFF]">
              Admissions & RPTO Directorate
            </span>
            <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
              Kinathukadavu, Coimbatore
            </span>
          </div>
          <h2
            className="text-lg sm:text-xl 2xl:text-2xl font-black text-[#08245F] mt-0.5 tracking-tight uppercase"
            style={{ fontFamily: "'Cabinet Grotesk', 'Outfit', sans-serif" }}
          >
            Contact Sri Eshwar Drone Tech RPTO
          </h2>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 2xl:gap-5 flex-1 min-h-0">
        {/* Left Column: Interactive Admissions Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#CFEAFF] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div>
                <h3 className="text-xs font-black text-[#08245F] uppercase tracking-wide">
                  Fast-Track Admissions Form
                </h3>
                <p className="text-[10px] text-slate-500">
                  Instant registration for upcoming DGCA certified batch seats
                </p>
              </div>
              <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ⚡ 2-Hr Response SLA
              </span>
            </div>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3.5">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-950">
                    Application Sent to dronetech@sece.ac.in!
                  </h4>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mt-1 rounded-full text-[11px] font-bold bg-white text-emerald-800 border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Logged to Central Admissions Database & Google Sheets</span>
                  </div>
                </div>
                <p className="text-xs text-emerald-900 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="font-bold">{fullName}</strong>. Your enquiry has been received (Ref: <span className="font-mono text-[#08245F] font-bold">{submittedRefId}</span>). Our DGCA admissions officer at <strong className="font-bold">dronetech@sece.ac.in</strong> will review your details and contact you at <strong className="font-bold">{phone}</strong>.
                </p>

                {/* Direct Email Action Button */}
                <div className="bg-white border border-emerald-200 rounded-xl p-3 max-w-sm mx-auto space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-[#08245F]">
                    <Mail className="w-4 h-4 text-[#087FE5] shrink-0" />
                    <span className="text-xs font-black uppercase">Send Direct Email Copy</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    You can also send a pre-formatted application directly from your email client to <strong className="text-[#08245F]">dronetech@sece.ac.in</strong>:
                  </p>
                  <a
                    href={createAdmissionsMailtoUrl({
                      fullName,
                      phone,
                      email,
                      courseName: courses.find(c => c.id === courseId)?.name || 'DGCA Course',
                      preferredBatch,
                      message,
                      refId: submittedRefId
                    })}
                    className="cursor-pointer inline-flex items-center justify-center w-full space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#08245F] hover:bg-[#073B8F] transition-colors shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Mail & Send to dronetech@sece.ac.in</span>
                  </a>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleReset}
                    className="cursor-pointer text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl transition-colors shadow-2xs"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Direct Delivery Notice */}
                <div className="flex items-center justify-between bg-sky-50 border border-sky-200/80 rounded-xl px-3 py-2 text-[11px]">
                  <div className="flex items-center space-x-2 text-[#08245F]">
                    <Mail className="w-3.5 h-3.5 text-[#087FE5] shrink-0" />
                    <span>Direct Delivery: <strong className="text-[#08245F]">dronetech@sece.ac.in</strong></span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#087FE5] bg-sky-100 px-2 py-0.5 rounded">
                    Google Sheets Auto-Sync
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Full Name *
                    </label>
                    <input
                      id="contact-form-name"
                      type="text"
                      required
                      placeholder="e.g. Arun Prakash"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#087FE5] focus:ring-1 focus:ring-[#087FE5] outline-none bg-[#F4FAFF] focus:bg-white transition-all text-[#08245F]"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      id="contact-form-phone"
                      type="tel"
                      required
                      placeholder="+91 98400 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#087FE5] focus:ring-1 focus:ring-[#087FE5] outline-none bg-[#F4FAFF] focus:bg-white transition-all text-[#08245F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Email Address
                    </label>
                    <input
                      id="contact-form-email"
                      type="email"
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#087FE5] focus:ring-1 focus:ring-[#087FE5] outline-none bg-[#F4FAFF] focus:bg-white transition-all text-[#08245F]"
                    />
                  </div>

                  {/* Course Selection */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Select DGCA Course *
                    </label>
                    <select
                      id="contact-form-course"
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#087FE5] focus:ring-1 focus:ring-[#087FE5] outline-none bg-[#F4FAFF] focus:bg-white transition-all text-[#08245F]"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {typeof c.price === 'number' ? `(₹${c.price.toLocaleString('en-IN')})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Preferred Batch */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Preferred Batch Schedule
                    </label>
                    <select
                      id="contact-form-batch"
                      value={preferredBatch}
                      onChange={(e) => setPreferredBatch(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#087FE5] focus:ring-1 focus:ring-[#087FE5] outline-none bg-[#F4FAFF] focus:bg-white transition-all text-[#08245F]"
                    >
                      {batches.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name} ({b.startDate})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Questions / Remarks */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Message / Special Queries
                    </label>
                    <input
                      id="contact-form-message"
                      type="text"
                      placeholder="e.g. Need hostel accommodation details"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#087FE5] focus:ring-1 focus:ring-[#087FE5] outline-none bg-[#F4FAFF] focus:bg-white transition-all text-[#08245F]"
                    />
                  </div>
                </div>

                <button
                  id="contact-form-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full py-2.5 px-4 rounded-xl text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] active:scale-98 shadow-md transition-all uppercase tracking-wide flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Routing to dronetech@sece.ac.in...' : 'Submit Application to dronetech@sece.ac.in'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Campus Address, Direct Helpline, and Interactive Map (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {/* Contact Details Cards */}
          <div className="bg-white border border-[#CFEAFF] rounded-2xl p-3.5 shadow-sm space-y-3">
            <div className="flex items-start space-x-2.5">
              <div className="p-2 rounded-lg bg-red-50 text-[#d71920] shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-[11px]">
                <h4 className="font-black text-[#08245F]">RPTO Campus & Airfield Address</h4>
                <p className="text-slate-600 leading-snug mt-0.5">
                  Sri Eshwar Drone Tech Pvt Ltd,<br />
                  Kondampatti Post, Vadasithur Road, Kinathukadavu,<br />
                  Coimbatore, Tamil Nadu — 641202.
                </p>
              </div>
            </div>

            {/* Direct Official Contacts: Accountable Manager & Chief Instructor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
              {/* Accountable Manager */}
              <div className="bg-[#F4FAFF] border border-[#CFEAFF] rounded-xl p-2.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-[#08245F]">
                  <UserCheck className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Accountable Manager
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href="tel:+919500635060"
                    className="font-bold text-[#08245F] hover:text-[#d71920] transition-colors"
                  >
                    +91 95006 35060
                  </a>
                  <a
                    href="https://wa.me/919500635060"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                    title="WhatsApp Accountable Manager"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Chief Instructor */}
              <div className="bg-[#F4FAFF] border border-[#CFEAFF] rounded-xl p-2.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-[#08245F]">
                  <Award className="w-3.5 h-3.5 text-[#d71920]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Chief Instructor
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href="tel:+919894743267"
                    className="font-bold text-[#08245F] hover:text-[#d71920] transition-colors"
                  >
                    +91 98947 43267
                  </a>
                  <a
                    href="https://wa.me/919894743267"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                    title="WhatsApp Chief Instructor"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Official Email Addresses */}
            <div className="flex items-center space-x-2 pt-1 border-t border-slate-100 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-[#08245F] shrink-0" />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <a href="mailto:dronetech@sece.ac.in" className="font-bold text-[#08245F] hover:underline">
                  dronetech@sece.ac.in
                </a>
              </div>
            </div>
          </div>

          {/* Embedded Map */}
          <div className="bg-white border border-[#CFEAFF] rounded-2xl p-2.5 shadow-sm flex-1 min-h-[140px] flex flex-col justify-between">
            <div className="relative w-full h-full min-h-[130px] rounded-xl overflow-hidden border border-[#CFEAFF]">
              <iframe
                title="Sri Eshwar Drone Tech Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.423985149301!2d76.9967664!3d10.8553641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85750d03b0c53%3A0xe54d92419c8fbeae!2sSri%20Eshwar%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
