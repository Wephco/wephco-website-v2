'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Receipt,
  FileText,
  ShieldAlert,
  Calendar,
  Camera,
  PieChart,
  Building2,
  FolderLock,
  BellRing,
  MessageSquare,
  TrendingUp,
  UserCheck,
  CalendarDays,
  CreditCard,
  Wrench,
  ClipboardCheck,
  Bell,
  ShieldCheck,
  Lock,
  History,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Layers,
  Sliders,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Loader } from '@/components/Loader';
import { createContactRequest } from '@/actions/contact';

export default function PropertyManagementPage() {
  const [activeTab, setActiveTab] = useState<'owners' | 'tenants' | 'security'>('owners');
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Form State for Demo / Service Inquiry Request
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    userRole: 'Property Owner',
    portfolioSize: '1-3 Properties',
    packageTier: 'Signature (12% Rent)',
    location: 'Abuja FCT',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleDemoSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.email || !demoForm.phone) {
      toast.warning('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await createContactRequest({
        name: demoForm.name,
        email: demoForm.email,
        phoneNumber: demoForm.phone,
        status: false,
        message: `Asset & Property Management Request (${demoForm.userRole}, ${demoForm.portfolioSize}, Tier: ${demoForm.packageTier}, City: ${demoForm.location}): ${demoForm.message}`,
      });
      toast.success('Your management inquiry has been submitted! Our advisory team will reach out shortly.');
      setDemoForm({
        name: '',
        email: '',
        phone: '',
        userRole: 'Property Owner',
        portfolioSize: '1-3 Properties',
        packageTier: 'Signature (12% Rent)',
        location: 'Abuja FCT',
        message: '',
      });
      setDemoModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display pt-20 overflow-x-hidden">
      {/* ------------------------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------------- */}
      <section className="relative pt-12 pb-24 px-6 md:px-12 lg:px-20 overflow-hidden border-b border-primary/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight">
              Asset &amp; Property Management<br />
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm font-bold uppercase tracking-wider text-slate-300">
              <span className="bg-slate-900 border border-primary/20 px-3 py-1 rounded-md text-primary">Protect The Asset</span>
              <span>•</span>
              <span className="bg-slate-900 border border-primary/20 px-3 py-1 rounded-md text-emerald-400">Protect The Income</span>
              <span>•</span>
              <span className="bg-slate-900 border border-primary/20 px-3 py-1 rounded-md text-amber-400">Grow The Value</span>
            </div>

            <p className="text-slate-300 text-base md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
              Transitioning real estate ownership from transactional risk to institutional fiduciary governance. A technology-enabled Property Asset Protection &amp; Yield Management service engineered for high-value residential and commercial portfolios.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-background-dark font-extrabold px-8 py-4 rounded-xl text-sm uppercase tracking-wider transition-all transform hover:scale-105 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Asset Audit &amp; Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#service-packages"
                className="w-full sm:w-auto border border-primary/40 hover:border-primary text-slate-100 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider hover:bg-white/5 transition-all backdrop-blur-xs text-center"
              >
                Explore Management Packages
              </a>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* STATISTICS CARDS */}
          {/* ------------------------------------------------------------------- */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Total Property Managed */}
              <div className="bg-slate-950/85 hover:bg-slate-900/90 p-8 rounded-2xl border border-primary/25 hover:border-primary/50 shadow-2xl backdrop-blur-xl transition-all duration-300 flex flex-col items-center text-center group">
                <div className="size-14 rounded-2xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-background-dark transition-all duration-300">
                  <Building2 className="w-7 h-7" />
                </div>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                  100<span className="text-primary">+</span>
                </p>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-2">
                  Total Property Managed
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  High-value residential estates, serviced apartments, and commercial portfolios under active governance.
                </p>
              </div>

              {/* 2. Years of Excellence */}
              <div className="bg-slate-950/85 hover:bg-slate-900/90 p-8 rounded-2xl border border-primary/25 hover:border-primary/50 shadow-2xl backdrop-blur-xl transition-all duration-300 flex flex-col items-center text-center group">
                <div className="size-14 rounded-2xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-background-dark transition-all duration-300">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                  7<span className="text-primary">+</span>
                </p>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-2">
                  Years of Excellence
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Proven track record in institutional fiduciary management, asset preservation, and yield optimization.
                </p>
              </div>

              {/* 3. Rent Collection */}
              <div className="bg-slate-950/85 hover:bg-slate-900/90 p-8 rounded-2xl border border-primary/25 hover:border-primary/50 shadow-2xl backdrop-blur-xl transition-all duration-300 flex flex-col items-center text-center group">
                <div className="size-14 rounded-2xl bg-primary/15 border border-primary/30 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-background-dark transition-all duration-300">
                  <Receipt className="w-7 h-7" />
                </div>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                  98<span className="text-primary">%</span>
                </p>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-2">
                  Rent Collection
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Consistent on-time rental remittance backed by our proprietary tenant underwriting and Rent Control SOP.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* THE WEPHCO MODEL (5 PROMISES, 4 DIVISIONS, 7-STAGE CYCLE) */}
      {/* ------------------------------------------------------------------- */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-background-dark border-b border-primary/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
              The WEPHCO Operational Model
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
              Built Upon <span className="font-black text-primary">Five Core Promises</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base font-light">
              Guarding your asset from physical deterioration while locking in yield discipline.
            </p>
          </div>

          {/* 5 Core Promises Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: 'Asset Protection', desc: 'We protect physical, structural, and mechanical integrity.', icon: ShieldCheck, color: 'text-primary' },
              { title: 'Income Protection', desc: 'We protect and guarantee rental cash flow discipline.', icon: Receipt, color: 'text-emerald-400' },
              { title: 'Tenant Protection', desc: 'We enhance tenant onboarding, experience, and retention.', icon: UserCheck, color: 'text-blue-400' },
              { title: 'Value Protection', desc: 'We prevent physical deterioration and avoidable overhead.', icon: Lock, color: 'text-amber-400' },
              { title: 'Yield Growth', desc: 'We continuously identify asset enhancements to grow net yield.', icon: TrendingUp, color: 'text-purple-400' },
            ].map((promise, idx) => (
              <div key={idx} className="bg-slate-900/50 p-5 rounded-xl border border-primary/20 hover:border-primary/50 transition-all space-y-3">
                <promise.icon className={`w-7 h-7 ${promise.color}`} />
                <h4 className="text-base font-bold text-white">{promise.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{promise.desc}</p>
              </div>
            ))}
          </div>

          {/* 4 Operating Divisions */}
          <div className="pt-8">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Four Specialized Operating Divisions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-primary/20 space-y-3">
                <h4 className="text-lg font-bold text-white">Property Management</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Routine tenancy administration, legal compliance, and daily property operations.
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-primary/20 space-y-3">
                <h4 className="text-lg font-bold text-white">Facility &amp; Maintenance</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Physical asset preservation, preventative maintenance schedules, and technical upkeep.
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-primary/20 space-y-3">
                <h4 className="text-lg font-bold text-white">Leasing &amp; Revenue</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Occupancy optimization, tenant placement underwriting, and short-let revenue management.
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-primary/20 space-y-3">
                <h4 className="text-lg font-bold text-white">Asset &amp; Investment</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Yield optimization, quarterly valuation reviews, and long-term portfolio growth strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* SERVICE PACKAGES & MANAGEMENT FEES */}
      {/* ------------------------------------------------------------------- */}
      <section id="service-packages" className="py-24 px-6 md:px-12 lg:px-20 bg-slate-950 border-b border-primary/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
              Service Packages &amp; Validated Fee Scale
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
              Benchmarked Against <span className="font-black text-primary">NIESV &amp; Market Baselines</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base font-light">
              Fees are benchmarked against the NIESV Scale of Professional Charges (10% national baseline). 100% of the Onboarding Audit Fee is creditable against your first month management fee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Essential Tier */}
            <div className="bg-slate-900/40 p-6 rounded-3xl border border-primary/20 flex flex-col justify-between hover:border-primary/40 transition-all">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Essential Tier</span>
                  <h3 className="text-xl font-bold text-white mt-1">Single Asset Unit</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Single residential or compact commercial unit.</p>
                </div>
                <div className="py-3 border-y border-slate-800">
                  <span className="text-2xl font-black text-primary">10%</span>
                  <span className="text-xs text-slate-300 ml-1">of gross monthly rent</span>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">Audit Fee: ₦500,000 flat (100% creditable)</p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Rent collection &amp; basic maintenance coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Consolidated quarterly performance report</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Graduate Surveyor onboarding audit (3-4 hrs)</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setDemoForm({ ...demoForm, packageTier: 'Essential (10% Rent)' });
                  setDemoModalOpen(true);
                }}
                className="mt-6 w-full border border-primary/40 text-primary hover:bg-primary hover:text-background-dark font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Inquire Essential
              </button>
            </div>

            {/* Signature Tier */}
            <div className="bg-slate-900/40 p-6 rounded-3xl border border-primary/20 flex flex-col justify-between hover:border-primary/40 transition-all">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Signature Tier</span>
                  <h3 className="text-xl font-bold text-white mt-1">Multi-Unit &amp; Estates</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Multi-unit complexes &amp; executive homes.</p>
                </div>
                <div className="py-3 border-y border-slate-800">
                  <span className="text-2xl font-black text-primary">12%</span>
                  <span className="text-xs text-slate-300 ml-1">of gross monthly rent</span>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">Audit Fee: ₦1,000,000 flat (100% creditable)</p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Full Rent Control System &amp; tenant screening rubric</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Monthly owner report &amp; preventive maintenance calendar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Surveyor onboarding audit (4 hrs + docs)</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setDemoForm({ ...demoForm, packageTier: 'Signature (12% Rent)' });
                  setDemoModalOpen(true);
                }}
                className="mt-6 w-full border border-primary/40 text-primary hover:bg-primary hover:text-background-dark font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Inquire Signature
              </button>
            </div>

            {/* Serviced Tier */}
            <div className="bg-slate-900/40 p-6 rounded-3xl border border-primary/20 flex flex-col justify-between hover:border-primary/40 transition-all">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Serviced Tier</span>
                  <h3 className="text-xl font-bold text-white mt-1">Short-Let &amp; Serviced</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Short/mid-let serviced apartments &amp; prime units.</p>
                </div>
                <div className="py-3 border-y border-slate-800">
                  <span className="text-2xl font-black text-primary">18%</span>
                  <span className="text-xs text-slate-300 ml-1">of gross booking rev.</span>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">Audit Fee: ₦1,200,000 flat (100% creditable)</p>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Guest vetting &amp; housekeeping coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Dynamic pricing &amp; multi-platform distribution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Surveyor audit (4-5 hrs, inventory &amp; photo set)</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setDemoForm({ ...demoForm, packageTier: 'Serviced (18% Booking Rev)' });
                  setDemoModalOpen(true);
                }}
                className="mt-6 w-full border border-primary/40 text-primary hover:bg-primary hover:text-background-dark font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Inquire Serviced
              </button>
            </div>

            {/* Elite Tier */}
            <div className="bg-linear-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border-2 border-primary shadow-2xl shadow-primary/10 flex flex-col justify-between relative">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Elite Tier</span>
                  <h3 className="text-xl font-black text-white mt-1">Plazas &amp; Portfolios</h3>
                  <p className="text-[11px] text-slate-300 mt-1">Luxury residences, commercial plazas, portfolios.</p>
                </div>
                <div className="py-3 border-y border-slate-800">
                  <span className="text-2xl font-black text-primary">15%</span>
                  <span className="text-xs text-slate-300 ml-1">+ Yield Bonus</span>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">Audit Fee: ₦2,000,000 flat (100% creditable)</p>
                </div>
                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Dedicated asset &amp; investment manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Quarterly technical condition report &amp; yield strategy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Partner audit (4-5 hrs, full condition report)</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setDemoForm({ ...demoForm, packageTier: 'Elite (15% Rent + Bonus)' });
                  setDemoModalOpen(true);
                }}
                className="mt-6 w-full bg-primary hover:bg-primary/95 text-background-dark font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all cursor-pointer"
              >
                Request Elite Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* ANCILLARY FEE SCHEDULE & MARKET COMPARISON TABLE */}
      {/* ------------------------------------------------------------------- */}
      <section className="py-20 px-6 md:px-12 bg-background-dark border-b border-primary/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
              Commission Structure &amp; Ancillary Schedules
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
              Validated Ancillary Rates &amp; <span className="font-black text-primary">Market Benchmarks</span>
            </h2>
          </div>

          <div className="overflow-x-auto bg-slate-950 rounded-2xl border border-primary/20 p-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 border-b border-primary/20 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Item / Transaction Type</th>
                  <th className="p-3 text-primary font-bold">WEPHCO Rate</th>
                  <th className="p-3">Market Benchmark</th>
                  <th className="p-3">Operational Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="p-3 font-semibold text-white">New Tenant Placement — Essential</td>
                  <td className="p-3 font-bold text-primary">0.85 month's rent</td>
                  <td className="p-3">0.75–0.8 month's rent</td>
                  <td className="p-3 text-slate-400">Priced competitively at entry tier</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">New Tenant Placement — Signature/Elite</td>
                  <td className="p-3 font-bold text-primary">1.0 month's rent</td>
                  <td className="p-3">0.75–0.8 month's rent</td>
                  <td className="p-3 text-slate-400">Reflects proprietary Grade A–D screening</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Furnished / Serviced Unit Placement</td>
                  <td className="p-3 font-bold text-primary">10% agency + 10% legal</td>
                  <td className="p-3">10% + 10%</td>
                  <td className="p-3 text-slate-400">Matched to the furnished norm</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Lease Renewal Coordination</td>
                  <td className="p-3 font-bold text-primary">0.4 month's rent</td>
                  <td className="p-3">0.35–0.4 month's rent</td>
                  <td className="p-3 text-slate-400">Matched to market baseline</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Maintenance Coordination Markup</td>
                  <td className="p-3 font-bold text-primary">Actual cost + 10%</td>
                  <td className="p-3">Actual cost + 10%</td>
                  <td className="p-3 text-slate-400">Industry standard transparent markup</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Check-Out Inspection</td>
                  <td className="p-3 font-bold text-primary">₦5,000 – ₦10,000</td>
                  <td className="p-3">₦2,000 – ₦10,000</td>
                  <td className="p-3 text-slate-400">Reflects documented condition report</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Rent Recovery / Escalation (14+ Days)</td>
                  <td className="p-3 font-bold text-primary">15% of gross recovered</td>
                  <td className="p-3">15% of gross recovered</td>
                  <td className="p-3 text-slate-400">Direct alignment with NIESV national scale</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* TENANT SCREENING RUBRIC & RENT COLLECTION SOP */}
      {/* ------------------------------------------------------------------- */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-slate-950 border-b border-primary/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Tenant Screening Rubric */}
            <div className="space-y-6">
              <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
                Institutional Tenant Screening
              </span>
              <h3 className="text-2xl md:text-3xl font-light text-white">
                Proprietary <span className="font-black text-primary">WEPHCO Underwriting Rubric</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Every prospective tenant undergoes strict identity validation, corporate registration verification, income sustainability check, and bank statement analysis.
              </p>
              <div className="space-y-6 text-xs">
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
                  <div className="flex justify-between font-bold text-emerald-400">
                    <span>GRADE A — Premium Tenant</span>
                    <span>Fast-Track Approval</span>
                  </div>
                  <p className="text-slate-300 mt-1">Exceptional liquid debt-service coverage, vetted institutional employer or tier-1 corporate covenant.</p>
                </div>

                <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-xl">
                  <div className="flex justify-between font-bold text-blue-400">
                    <span>GRADE B — Acceptable</span>
                    <span>Standard Deposit</span>
                  </div>
                  <p className="text-slate-300 mt-1">Stable employment or verified cash flows, debt-to-income ≤ 35%, solid landlord references.</p>
                </div>

                <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl">
                  <div className="flex justify-between font-bold text-amber-400">
                    <span>GRADE C — High Monitoring</span>
                    <span>Corporate Co-Sign / Prepayments</span>
                  </div>
                  <p className="text-slate-300 mt-1">Volatile earnings or newer enterprise. Requires double deposit or quarterly prepayments.</p>
                </div>

                <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl">
                  <div className="flex justify-between font-bold text-red-400">
                    <span>GRADE D — Reject</span>
                    <span>Non-Negotiable Decline</span>
                  </div>
                  <p className="text-slate-300 mt-1">Unverifiable identity, adverse litigation history, or inability to meet financial thresholds.</p>
                </div>
              </div>
            </div>

            {/* Rent Collection SOP */}
            <div className="space-y-6">
              <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
                Rent Collection SOP
              </span>
              <h3 className="text-2xl md:text-3xl font-light text-white">
                Automated <span className="font-black text-primary">Rent Control Timeline</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Operational Benchmark: <strong>95%+ rent collected within the agreed payment period.</strong>
              </p>

              <div className="space-y-3 text-xs">
                {[
                  { time: '30 Days Before Due', action: 'Courtesy Reminder', details: 'Automated renewal notice & early invoice delivery via email and SMS.' },
                  { time: '14 Days Before Due', action: 'Formal Commercial Invoice', details: 'Dispatch of itemized invoice with designated settlement instructions.' },
                  { time: '7 Days Before Due', action: 'Payment Confirmation', details: 'Proactive outreach by leasing officer to verify payment scheduling.' },
                  { time: 'Due Date (Day 0)', action: 'Payment Notification', details: 'Same-day receipt issuance upon clearing, or immediate reminder.' },
                  { time: '1–3 Days Overdue', action: 'First Arrears Notice', details: 'Formal letter of default noting statutory late penalties.' },
                  { time: '7 Days Overdue', action: 'Escalation Notice', details: 'In-person operational visit, guarantor notification & demand warning.' },
                  { time: '14+ Days Overdue', action: 'Formal Legal Recovery', details: 'Handover to legal counsel for enforcement (15% recovery commission).' },
                ].map((sop, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                    <span className="font-bold text-primary w-28 shrink-0">{sop.time}</span>
                    <div>
                      <span className="font-bold text-white block">{sop.action}</span>
                      <span className="text-[11px] text-slate-400">{sop.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* SERVICE CHARGE BUDGET ALLOCATION */}
      {/* ------------------------------------------------------------------- */}
      <section className="py-20 px-6 md:px-12 bg-background-dark border-b border-primary/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
              Service Charge Governance
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-white leading-tight">
              Target Service Charge <span className="font-black text-primary">Budget Share</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base font-light">
              Published monthly on the 5th business day as a transparent Budget vs. Actual comparison to owners and tenants.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { category: 'Security Operations', share: '25%', coverage: 'Vetted physical personnel, access control gates, perimeter fence upkeep.' },
              { category: 'Power & Common Area Energy', share: '20%', coverage: 'Generator diesel supply, routine servicing, solar/inverter maintenance.' },
              { category: 'Facility Maintenance', share: '15%', coverage: 'Plumbing servicing, electrical repairs, common area touchups, structural checks.' },
              { category: 'Janitorial & Cleaning', share: '15%', coverage: 'Daily common cleaning, compound waste bins, periodic chemical fumigation.' },
              { category: 'Professional Management', share: '10%', coverage: 'WEPHCO facility manager coordination, tenant liaison, account audits.' },
              { category: 'Capital Sinking / Contingency', share: '10%', coverage: 'Dedicated sinking fund for pump failures, line ruptures, gate motors.' },
              { category: 'Waste Management', share: '5%', coverage: 'Municipal environmental compliance, scheduled waste collection & disposal.' },
            ].map((budget, i) => (
              <div key={i} className="bg-slate-900/60 p-5 rounded-2xl border border-primary/20 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">{budget.category}</span>
                  <span className="text-base font-black text-primary">{budget.share}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{budget.coverage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* SEGMENTED FEATURE SHOWCASE (FOR OWNERS, TENANTS, SECURITY) */}
      {/* ------------------------------------------------------------------- */}
      <section id="software-features" className="py-24 px-6 md:px-12 lg:px-20 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
              A Complete Platform for <br />
              <span className="font-black text-primary">Owners, Tenants &amp; Managers</span>
            </h2>
            <p className="text-slate-300 text-sm md:text-base font-light">
              Select your persona below to explore the dedicated software capabilities built into WEPHCO Property Management.
            </p>
          </div>

          {/* Persona Tab Switcher */}
          <div className="flex justify-center">
            <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-primary/20 inline-flex flex-col sm:flex-row gap-2 max-w-full">
              <button
                onClick={() => setActiveTab('owners')}
                className={`px-6 py-3.5 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${activeTab === 'owners'
                    ? 'bg-primary text-background-dark shadow-xl shadow-primary/20 scale-102'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Building2 className="w-4 h-4" />
                <span>For Property Owners (16 Features)</span>
              </button>

              <button
                onClick={() => setActiveTab('tenants')}
                className={`px-6 py-3.5 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${activeTab === 'tenants'
                    ? 'bg-primary text-background-dark shadow-xl shadow-primary/20 scale-102'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>For Tenants (6 Features)</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-3.5 rounded-xl text-xs md:text-sm font-extrabold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${activeTab === 'security'
                    ? 'bg-primary text-background-dark shadow-xl shadow-primary/20 scale-102'
                    : 'text-slate-400 hover:text-white'
                  }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Security &amp; Infrastructure</span>
              </button>
            </div>
          </div>

          {/* TAB 1: FOR PROPERTY OWNERS */}
          {activeTab === 'owners' && (
            <div className="space-y-12 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Real-Time Dashboard', desc: 'Occupancy rate, gross & net income, arrears, net yield, and property condition grade.', icon: LayoutDashboard },
                  { title: 'Monthly Owner Report', desc: 'Auto-generated financial summaries, archived securely, and instantly downloadable in PDF format on the 5th business day.', icon: FileSpreadsheet },
                  { title: 'Rent & Income Tracking', desc: 'Live status of every rent collection against the scheduled lease terms with instant status indicators.', icon: Receipt },
                  { title: 'Digital Lease Register', desc: 'Tenant contact details, rent amounts, security deposits, lease renewal dates, and service charge terms.', icon: FileText },
                  { title: 'Maintenance Approval Center', desc: 'Push notification sent directly to your phone for any spend above pre-agreed threshold.', icon: ShieldAlert },
                  { title: 'Preventive Maintenance Calendar', desc: 'See every upcoming inspection, HVAC service, generator check, or elevator safety audit.', icon: Calendar },
                  { title: 'Asset Condition Reports', desc: 'Quarterly comprehensive property condition reports with high-resolution photo/video audit history.', icon: Camera },
                  { title: 'Service Charge Budget vs. Actual', desc: 'Transparent, line-by-line accounting comparing service charge budgets against operational expenses.', icon: PieChart },
                  { title: 'Multi-Property Portfolio View', desc: 'Aggregate portfolio totals plus per-property breakdown views for owners managing multi-asset holdings.', icon: Layers },
                  { title: 'Encrypted Document Vault', desc: 'Lease agreements, insurance policies, title deeds, audit reports, and tax statements stored securely.', icon: FolderLock },
                  { title: 'Smart Push Notifications', desc: 'Instant alerts for rent received, arrears flagged, maintenance scheduled or completed.', icon: BellRing },
                  { title: 'Direct Messaging & Concierge', desc: 'Direct in-app messaging line with your dedicated Relationship Manager (Elite Tier) or technical support.', icon: MessageSquare },
                  { title: 'Yield & Valuation Analytics', desc: 'Property value trends over time, net yield metrics, and proactive data-backed yield growth recommendations.', icon: TrendingUp },
                  { title: 'Tenant Screening Visibility', desc: 'Complete visibility into tenant background checks, including the A–D tenant grade and screening summary.', icon: UserCheck },
                  { title: 'Serviced & Short-Let Calendar', desc: 'Occupancy calendar, booking revenue sync across platforms, and breakdown analytics for serviced apartment packages.', icon: CalendarDays },
                  { title: 'In-App Service Upgrades', desc: 'Upgrade packages, request specialized facility management, or commission asset repositioning directly in-app.', icon: Sliders },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-900/40 p-6 rounded-2xl border border-primary/10 hover:border-primary/40 transition-all flex flex-col justify-between group">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FOR TENANTS */}
          {activeTab === 'tenants' && (
            <div className="space-y-12 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'In-App Rent Payment', desc: 'Pay rent securely via card, bank transfer, or direct debit. Instantly access digital invoices and receipts.', icon: CreditCard },
                  { title: 'Maintenance Submission', desc: 'Report maintenance issues in seconds with photos or video clips. Track real-time progress to resolution.', icon: Wrench },
                  { title: 'Lease Document Access', desc: 'View lease terms, renewal dates, house rules, and service charge breakdowns anytime.', icon: FileText },
                  { title: 'Automated Payment Reminders', desc: 'Friendly automated notifications sent ahead of payment due dates so you never incur late fees.', icon: Bell },
                  { title: 'Digital Move-In/Move-Out Checklist', desc: 'Interactive move-in inspection checklist and photo condition report access for total transparency.', icon: ClipboardCheck },
                  { title: 'Direct Manager Messaging', desc: 'Communicate directly with your designated WEPHCO property manager for quick answers.', icon: MessageSquare },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-900/40 p-6 rounded-2xl border border-primary/10 hover:border-primary/40 transition-all flex flex-col justify-between group">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & ACCESS */}
          {activeTab === 'security' && (
            <div className="space-y-12 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-900/60 p-8 rounded-2xl border border-primary/20 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Role-Based Access Control (RBAC)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Strict segregation of user permissions. Property owners, tenants, facility technicians, and WEPHCO staff each access only the data relevant to their specific role.
                  </p>
                </div>

                <div className="bg-slate-900/60 p-8 rounded-2xl border border-primary/20 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Encrypted Document Vault</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Bank-grade AES-256 encryption applied to all lease agreements, banking statements, identity verification records, and financial ledger data.
                  </p>
                </div>

                <div className="bg-slate-900/60 p-8 rounded-2xl border border-primary/20 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                    <History className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Immutable Audit Trail</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Full, unalterable timestamped event log for every maintenance approval, fund disbursement, lease update, and tenant screening decision.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* FINAL CTA SECTION */}
      {/* ------------------------------------------------------------------- */}
      <section className="py-24 px-6 md:px-12 text-center relative overflow-hidden bg-slate-950">
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
            Protect The Asset • Protect The Income <br />
            <span className="font-extrabold text-primary">Grow The Value</span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Schedule an initial property audit and software walkthrough with WEPHCO's Asset Management fiduciary advisors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setDemoModalOpen(true)}
              className="bg-primary text-background-dark px-10 py-4.5 rounded-xl font-extrabold text-sm uppercase tracking-wider hover:bg-primary/95 transition-all hover:scale-105 shadow-2xl shadow-primary/30 cursor-pointer"
            >
              Request Onboarding Audit
            </button>
            <Link
              href="/consultations"
              className="border border-primary/40 text-white px-10 py-4.5 rounded-xl font-extrabold text-sm uppercase tracking-wider hover:bg-white/5 transition-all"
            >
              Book Private Advisory
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* DEMO / ASSET AUDIT REQUEST MODAL */}
      {/* ------------------------------------------------------------------- */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-primary/30 rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold p-2 cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Asset Management Onboarding</span>
              <h3 className="text-2xl font-bold text-white">Inquire / Schedule Asset Audit</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your details below to connect with our Property Asset Protection &amp; Yield Management advisors.
              </p>
            </div>

            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase font-bold text-slate-300 tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={demoForm.name}
                  onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                  placeholder="e.g. Chief Alexander Sterling"
                  className="w-full bg-slate-950 border border-primary/20 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 tracking-wider block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={demoForm.email}
                    onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-950 border border-primary/20 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 tracking-wider block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                    placeholder="+234 ..."
                    className="w-full bg-slate-950 border border-primary/20 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 tracking-wider block mb-1">
                    Management Package Tier
                  </label>
                  <select
                    value={demoForm.packageTier}
                    onChange={(e) => setDemoForm({ ...demoForm, packageTier: e.target.value })}
                    className="w-full bg-slate-950 border border-primary/20 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Essential (10% Rent)">Essential (10% Rent)</option>
                    <option value="Signature (12% Rent)">Signature (12% Rent)</option>
                    <option value="Serviced (18% Booking Rev)">Serviced (18% Booking Rev)</option>
                    <option value="Elite (15% Rent + Bonus)">Elite (15% Rent + Bonus)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 tracking-wider block mb-1">
                    Primary City Location
                  </label>
                  <select
                    value={demoForm.location}
                    onChange={(e) => setDemoForm({ ...demoForm, location: e.target.value })}
                    className="w-full bg-slate-950 border border-primary/20 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Abuja FCT">Abuja FCT</option>
                    <option value="Kano Commercial">Kano Commercial</option>
                    <option value="Lagos / Other">Lagos / Other Regional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 tracking-wider block mb-1">
                    I Am A...
                  </label>
                  <select
                    value={demoForm.userRole}
                    onChange={(e) => setDemoForm({ ...demoForm, userRole: e.target.value })}
                    className="w-full bg-slate-950 border border-primary/20 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Property Owner">Property Owner</option>
                    <option value="Asset Manager / Family Office">Asset Manager / Family Office</option>
                    <option value="Institutional Investor">Institutional Investor</option>
                    <option value="Prospective Tenant">Prospective Tenant</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] uppercase font-bold text-slate-300 tracking-wider block mb-1">
                    Portfolio Size
                  </label>
                  <select
                    value={demoForm.portfolioSize}
                    onChange={(e) => setDemoForm({ ...demoForm, portfolioSize: e.target.value })}
                    className="w-full bg-slate-950 border border-primary/20 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="1-3 Properties">1-3 Properties</option>
                    <option value="4-10 Properties">4-10 Properties</option>
                    <option value="10+ Luxury Holdings">10+ Luxury Holdings</option>
                    <option value="Serviced Portfolio">Serviced Portfolio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-slate-300 tracking-wider block mb-1">
                  Property Details / Questions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={demoForm.message}
                  onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                  placeholder="Tell us about your properties or specific requirements..."
                  className="w-full bg-slate-950 border border-primary/20 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-background-dark font-extrabold py-3.5 rounded-lg text-xs uppercase tracking-wider hover:bg-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
              >
                {loading ? <Loader /> : 'Submit Audit & Onboarding Inquiry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
