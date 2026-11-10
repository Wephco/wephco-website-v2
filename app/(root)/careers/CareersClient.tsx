'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  Search,
  ArrowRight,
  CheckCircle2,
  Building2,
  Globe,
  Award,
  TrendingUp,
  X,
  Upload,
  Send,
  DollarSign,
  Calendar,
  FileText,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { ICareerJob } from '@/interfaces/careerInterface';
import { submitJobApplication, uploadCareerCV } from '@/actions/careers';
import { uploadFile } from '@/lib/helperFunctions';
import { toast } from 'react-toastify';

interface CareersClientProps {
  initialJobs: ICareerJob[];
}

const CULTURE_PILLARS = [
  {
    icon: Globe,
    title: 'Global Market Exposure',
    description:
      'Work across prime real estate markets spanning Nigeria, the UAE, the UK, Monaco, and emerging global corridors.',
  },
  {
    icon: TrendingUp,
    title: 'Meritocratic Growth',
    description:
      'Uncapped performance rewards, structured career progression, and direct participation in high-value advisory deals.',
  },
  {
    icon: Award,
    title: 'Culture of Excellence',
    description:
      'Collaborate with seasoned investment strategists, luxury brokers, and private wealth advisors at the top of their craft.',
  },
  {
    icon: Building2,
    title: 'Bespoke Client Impact',
    description:
      'Shape generational wealth portfolios and represent landmark architectural assets for discerning global clientele.',
  },
];

export default function CareersClient({ initialJobs }: CareersClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Modal state for viewing role details & applying
  const [activeJob, setActiveJob] = useState<ICareerJob | null>(null);
  const [isGeneralApplication, setIsGeneralApplication] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Application Form State
  const cvInputRef = useRef<HTMLInputElement>(null);
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Extract unique departments from active jobs
  const departments = useMemo(() => {
    const set = new Set<string>(
      initialJobs.map((j) => j.department).filter(Boolean)
    );
    return ['All', ...Array.from(set)];
  }, [initialJobs]);

  const employmentTypes = [
    'All',
    'Full-Time',
    'Part-Time',
    'Contract',
    'Remote',
    'Hybrid',
  ];

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        selectedDepartment === 'All' || job.department === selectedDepartment;

      const matchesType =
        selectedType === 'All' || job.type === selectedType;

      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [initialJobs, searchQuery, selectedDepartment, selectedType]);

  const openJobModal = (job: ICareerJob) => {
    setActiveJob(job);
    setIsGeneralApplication(false);
    setShowModal(true);
  };

  const openGeneralApplicationModal = () => {
    setActiveJob(null);
    setIsGeneralApplication(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveJob(null);
    setIsGeneralApplication(false);
  };

  const resetForm = () => {
    setApplicantName('');
    setEmail('');
    setPhone('');
    setYearsOfExperience('');
    setLinkedInUrl('');
    setPortfolioUrl('');
    setResumeUrl('');
    setResumeFileName('');
    setCoverLetter('');
    if (cvInputRef.current) {
      cvInputRef.current.value = '';
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('CV / Resume file must be under 10MB.');
      e.target.value = '';
      return;
    }

    setUploadingResume(true);
    try {
      let downloadUrl = '';

      // 1. Upload via Server Action (Firebase Admin Storage SDK) to bypass client CORS / Auth restrictions
      const formData = new FormData();
      formData.append('file', file);
      const serverUpload = await uploadCareerCV(formData);

      if (serverUpload.success && serverUpload.url) {
        downloadUrl = serverUpload.url;
      } else {
        // 2. Fallback to Client Firebase Storage SDK uploadFile
        downloadUrl = await uploadFile(file, 'resumes');
      }

      if (!downloadUrl) {
        throw new Error('Could not retrieve download URL for uploaded CV.');
      }

      setResumeUrl(downloadUrl);
      setResumeFileName(file.name);
      toast.success('CV uploaded successfully.');
    } catch (error: any) {
      console.error('Resume upload error:', error);
      toast.error(error?.message || 'Failed to upload CV. Please try again.');
    } finally {
      setUploadingResume(false);
      if (cvInputRef.current) {
        cvInputRef.current.value = '';
      }
    }
  };

  const handleRemoveResume = () => {
    setResumeUrl('');
    setResumeFileName('');
    if (cvInputRef.current) {
      cvInputRef.current.value = '';
    }
  };

  const handleApplicationSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!applicantName.trim() || !email.trim() || !phone.trim()) {
      toast.error('Please fill in your name, email, and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitJobApplication({
        jobId: activeJob?.id || 'general',
        jobTitle: activeJob?.title || 'General Talent Network Application',
        department: activeJob?.department || 'General',
        applicantName,
        email,
        phone,
        yearsOfExperience,
        linkedInUrl,
        portfolioUrl,
        resumeUrl,
        coverLetter,
      });

      if (res.success) {
        toast.success(
          'Your application has been submitted! Our talent team will review it shortly.'
        );
        resetForm();
        closeModal();
      } else {
        toast.error(res.error || 'Failed to submit application.');
      }
    } catch (error) {
      toast.error('An error occurred while submitting your application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background-dark text-slate-100 font-display pt-20 overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-20 left-10 w-100 h-100 bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-light text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Join Our Team of Talented Individuals
        </h1>

        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Join an elite collective of global property advisors, investment
          strategists, and private wealth specialists connecting discerning
          investors with extraordinary real estate assets.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#open-positions"
            className="bg-primary hover:bg-primary/90 text-background-dark px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20 inline-flex items-center gap-2"
          >
            <span>Explore Open Roles</span>
            <ArrowRight className="size-4" />
          </a>
          <button
            onClick={openGeneralApplicationModal}
            className="border border-primary/35 hover:border-primary text-slate-100 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer"
          >
            Join Talent Network
          </button>
        </div>
      </section>

      {/* Why Wephco / Culture Pillars */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-primary/10">
        <div className="text-center mb-12">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-2">
            Why Wephco
          </p>
          <h2 className="text-2xl sm:text-4xl font-light text-white">
            A Standard of{' '}
            <span className="font-extrabold text-primary">Distinction</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CULTURE_PILLARS.map((pillar, index) => (
            <div
              key={index}
              className="bg-neutral-dark/25 border border-primary/15 hover:border-primary/40 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="size-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-5">
                  <pillar.icon className="size-6" />
                </div>
                <h3 className="text-white text-lg font-bold mb-2">
                  {pillar.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions Section */}
      <section
        id="open-positions"
        className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-primary/10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-2">
              Opportunities
            </p>
            <h2 className="text-3xl sm:text-4xl font-light text-white">
              Open <span className="font-extrabold text-primary">Positions</span>
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role, location, or team..."
              className="w-full bg-neutral-dark/30 border border-primary/20 focus:border-primary rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        {initialJobs.length > 0 && (
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-primary/10">
            <div className="flex flex-wrap items-center gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                    selectedDepartment === dept
                      ? 'bg-primary text-background-dark border-primary shadow-md shadow-primary/20'
                      : 'bg-neutral-dark/20 text-slate-400 border-primary/10 hover:border-primary/30 hover:text-white'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {employmentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                    selectedType === type
                      ? 'bg-white/15 text-primary border-primary/40'
                      : 'bg-transparent text-slate-400 border-white/10 hover:border-white/25 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Job Listings or Empty State */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => openJobModal(job)}
                className="group bg-neutral-dark/25 hover:bg-neutral-dark/40 border border-primary/15 hover:border-primary/45 rounded-2xl p-6 sm:p-8 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl"
              >
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/15 text-primary border border-primary/30 px-3 py-1 rounded-full">
                      {job.department}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      <MapPin className="size-3.5 text-primary" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      <Clock className="size-3.5 text-primary" />
                      {job.type}
                    </span>
                    {job.salaryRange && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        <DollarSign className="size-3.5 text-primary" />
                        {job.salaryRange}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed line-clamp-2">
                    {job.summary || job.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openJobModal(job);
                    }}
                    className="inline-flex items-center gap-2 bg-primary group-hover:bg-primary/90 text-background-dark px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/20 cursor-pointer"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-dark/20 border border-primary/15 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto">
            <div className="size-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mx-auto mb-6">
              <Briefcase className="size-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {initialJobs.length === 0
                ? 'No Open Positions at the Moment'
                : 'No Matching Roles Found'}
            </h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed mb-8">
              {initialJobs.length === 0
                ? 'We are always looking to connect with exceptional real estate advisors, analysts, and operations professionals. Submit your profile to our Talent Network to be considered for upcoming openings.'
                : 'Try adjusting your search or filter criteria, or submit a general application to join our Talent Network.'}
            </p>
            <button
              onClick={openGeneralApplicationModal}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-background-dark px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              <span>Submit Spontaneous Application</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </section>

      {/* Role Details & Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#141414] border border-primary/25 rounded-3xl p-6 sm:p-10 text-slate-100 shadow-2xl my-8">
            <button
              onClick={closeModal}
              aria-label="Close modal"
              className="sticky top-0 float-right size-10 rounded-full bg-white/10 hover:bg-primary hover:text-background-dark text-slate-300 flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              <X className="size-5" />
            </button>

            {/* Role Information Header (when applying to a specific job) */}
            {activeJob && !isGeneralApplication ? (
              <div className="mb-10 pb-8 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/15 text-primary border border-primary/30 px-3 py-1 rounded-full">
                    {activeJob.department}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    <MapPin className="size-3.5 text-primary" />
                    {activeJob.location}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    <Clock className="size-3.5 text-primary" />
                    {activeJob.type}
                  </span>
                  {activeJob.experienceLevel && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      <Briefcase className="size-3.5 text-primary" />
                      {activeJob.experienceLevel}
                    </span>
                  )}
                  {activeJob.salaryRange && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      <DollarSign className="size-3.5 text-primary" />
                      {activeJob.salaryRange}
                    </span>
                  )}
                  {activeJob.closingDate && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                      <Calendar className="size-3.5 text-primary" />
                      Apply by {activeJob.closingDate}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                  {activeJob.title}
                </h2>

                {activeJob.description && (
                  <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed whitespace-pre-line mb-6">
                    {activeJob.description}
                  </p>
                )}

                {activeJob.responsibilities &&
                  activeJob.responsibilities.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
                        Key Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {activeJob.responsibilities.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-slate-300 text-sm font-light"
                          >
                            <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {activeJob.requirements && activeJob.requirements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
                      Requirements & Qualifications
                    </h4>
                    <ul className="space-y-2">
                      {activeJob.requirements.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-slate-300 text-sm font-light"
                        >
                          <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeJob.benefits && activeJob.benefits.length > 0 && (
                  <div>
                    <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
                      What We Offer
                    </h4>
                    <ul className="space-y-2">
                      {activeJob.benefits.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-slate-300 text-sm font-light"
                        >
                          <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-8 pb-6 border-b border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/15 text-primary border border-primary/30 px-3 py-1 rounded-full">
                  Talent Network
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 mb-2">
                  Join the Wephco Talent Network
                </h2>
                <p className="text-slate-400 text-sm font-light">
                  Submit your credentials and area of expertise to be considered
                  for upcoming advisory, brokerage, and leadership roles.
                </p>
              </div>
            )}

            {/* Application Form */}
            <form onSubmit={handleApplicationSubmit} className="space-y-5">
              <h3 className="text-lg font-bold text-white">
                {activeJob
                  ? `Apply for ${activeJob.title}`
                  : 'Candidate Information'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Amara Nwosu"
                    className="w-full bg-white/5 border border-white/15 focus:border-primary rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amara@example.com"
                    className="w-full bg-white/5 border border-white/15 focus:border-primary rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-white/5 border border-white/15 focus:border-primary rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    placeholder="e.g. 5+ Years in Luxury Real Estate"
                    className="w-full bg-white/5 border border-white/15 focus:border-primary rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-white/5 border border-white/15 focus:border-primary rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                    Portfolio / Website URL
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/15 focus:border-primary rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                </div>
              </div>

              {/* Resume / CV Upload to Firebase Storage */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Resume / CV Document (PDF, DOC, DOCX)
                </label>

                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  className="hidden"
                />

                {resumeUrl ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-primary/10 border border-primary/35 rounded-xl p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                        <FileText className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {resumeFileName || 'Uploaded CV Document'}
                        </p>
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
                        >
                          <span>View Uploaded Document</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => cvInputRef.current?.click()}
                        disabled={uploadingResume}
                        className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold uppercase tracking-wider text-white cursor-pointer transition-all"
                      >
                        Replace CV
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveResume}
                        aria-label="Remove uploaded CV"
                        className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 cursor-pointer transition-all"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      !uploadingResume && cvInputRef.current?.click()
                    }
                    className={`border-2 border-dashed border-white/20 hover:border-primary/60 bg-white/5 hover:bg-white/8 rounded-2xl p-6 text-center transition-all ${
                      uploadingResume
                        ? 'opacity-70 cursor-wait'
                        : 'cursor-pointer'
                    }`}
                  >
                    {uploadingResume ? (
                      <div className="flex flex-col items-center gap-2 py-1">
                        <Loader2 className="size-8 text-primary animate-spin" />
                        <p className="text-sm font-semibold text-white">
                          Uploading CV...
                        </p>
                        <p className="text-xs text-slate-400">
                          Please wait while we generate your document URL
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-1">
                          <Upload className="size-5" />
                        </div>
                        <p className="text-sm font-semibold text-white">
                          Click to upload your CV / Resume
                        </p>
                        <p className="text-xs text-slate-400">
                          Supports PDF, DOC, DOCX (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Cover Note / Executive Pitch
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us about yourself and why you want to join Wephco"
                  className="w-full bg-white/5 border border-white/15 focus:border-primary rounded-xl p-4 text-sm text-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3.5 rounded-xl border border-white/15 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingResume}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-background-dark px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/25 cursor-pointer"
                >
                  <Send className="size-4" />
                  <span>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

