'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
  ExternalLink,
  FileText,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getCareers,
  createCareer,
  updateCareer,
  deleteCareer,
  getJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
} from '@/actions/careers';
import {
  ICareerJob,
  IJobApplication,
  EmploymentType,
  ApplicationStatus,
} from '@/interfaces/careerInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-Time',
  'Part-Time',
  'Contract',
  'Remote',
  'Hybrid',
];

const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  badgeClass: string;
}[] = [
  {
    value: 'pending',
    label: 'Pending Review',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    value: 'reviewed',
    label: 'Reviewed',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    value: 'shortlisted',
    label: 'Shortlisted',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    value: 'hired',
    label: 'Hired',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
  },
];

const EMPTY_JOB_FORM: Omit<ICareerJob, 'id'> = {
  title: '',
  department: 'Brokerage & Advisory',
  location: 'Abuja, Nigeria',
  type: 'Full-Time',
  experienceLevel: '',
  salaryRange: '',
  summary: '',
  description: '',
  responsibilities: [],
  requirements: [],
  benefits: [],
  isActive: true,
  closingDate: '',
};

export default function DashboardCareersPage() {
  const [activeTab, setActiveTab] = useState<'openings' | 'applications'>(
    'openings'
  );

  // Jobs State
  const [jobs, setJobs] = useState<ICareerJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState<
    'all' | 'active' | 'closed'
  >('all');

  // Job Form Modal State
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState<Omit<ICareerJob, 'id'>>(EMPTY_JOB_FORM);
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [savingJob, setSavingJob] = useState(false);

  // Applications State
  const [applications, setApplications] = useState<IJobApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');
  const [appRoleFilter, setAppRoleFilter] = useState<string>('all');
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const data = await getCareers(false);
      setJobs(data);
    } catch (error) {
      toast.error('Failed to load career postings.');
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplications = async () => {
    setLoadingApplications(true);
    try {
      const data = await getJobApplications();
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load job applications.');
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.department.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.location.toLowerCase().includes(jobSearch.toLowerCase());

      const matchesStatus =
        jobStatusFilter === 'all' ||
        (jobStatusFilter === 'active' && job.isActive) ||
        (jobStatusFilter === 'closed' && !job.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [jobs, jobSearch, jobStatusFilter]);

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.applicantName.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.email.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(appSearch.toLowerCase());

      const matchesStatus =
        appStatusFilter === 'all' || app.status === appStatusFilter;

      const matchesRole =
        appRoleFilter === 'all' || app.jobTitle === appRoleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [applications, appSearch, appStatusFilter, appRoleFilter]);

  // Unique roles in applications
  const applicationRoles = useMemo(() => {
    const roles = new Set(applications.map((a) => a.jobTitle).filter(Boolean));
    return Array.from(roles);
  }, [applications]);

  // Open Modal for New Job
  const handleOpenNewJobModal = () => {
    setEditingJobId(null);
    setJobForm(EMPTY_JOB_FORM);
    setResponsibilitiesText('');
    setRequirementsText('');
    setBenefitsText('');
    setShowJobModal(true);
  };

  // Open Modal for Editing Job
  const handleOpenEditJobModal = (job: ICareerJob) => {
    setEditingJobId(job.id || null);
    setJobForm({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      type: job.type || 'Full-Time',
      experienceLevel: job.experienceLevel || '',
      salaryRange: job.salaryRange || '',
      summary: job.summary || '',
      description: job.description || '',
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      isActive: job.isActive !== false,
      closingDate: job.closingDate || '',
    });
    setResponsibilitiesText((job.responsibilities || []).join('\n'));
    setRequirementsText((job.requirements || []).join('\n'));
    setBenefitsText((job.benefits || []).join('\n'));
    setShowJobModal(true);
  };

  // Save Job (Create or Update)
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !jobForm.title.trim() ||
      !jobForm.department.trim() ||
      !jobForm.location.trim()
    ) {
      toast.error('Please provide a title, department, and location.');
      return;
    }

    const payload: Omit<ICareerJob, 'id'> = {
      ...jobForm,
      responsibilities: responsibilitiesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      requirements: requirementsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      benefits: benefitsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    };

    setSavingJob(true);
    try {
      if (editingJobId) {
        const res = await updateCareer(editingJobId, payload);
        if (res.success) {
          toast.success('Job posting updated.');
          setShowJobModal(false);
          await loadJobs();
        } else {
          toast.error(res.error || 'Failed to update job posting.');
        }
      } else {
        const res = await createCareer(payload);
        if (res.success) {
          toast.success('New job posting created.');
          setShowJobModal(false);
          await loadJobs();
        } else {
          toast.error(res.error || 'Failed to create job posting.');
        }
      }
    } catch (error) {
      toast.error('An error occurred while saving the job posting.');
    } finally {
      setSavingJob(false);
    }
  };

  // Toggle Active / Closed
  const handleToggleJobActive = async (job: ICareerJob) => {
    if (!job.id) return;
    const nextStatus = !job.isActive;
    const res = await updateCareer(job.id, { isActive: nextStatus });
    if (res.success) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, isActive: nextStatus } : j
        )
      );
      toast.success(
        nextStatus
          ? `"${job.title}" is now published on the Careers page.`
          : `"${job.title}" is now hidden from the Careers page.`
      );
    } else {
      toast.error(res.error || 'Failed to update job visibility.');
    }
  };

  // Delete Job
  const handleDeleteJob = async (job: ICareerJob) => {
    if (!job.id) return;
    if (
      !confirm(
        `Are you sure you want to delete "${job.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    const res = await deleteCareer(job.id);
    if (res.success) {
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      toast.success('Job posting deleted.');
    } else {
      toast.error(res.error || 'Failed to delete job posting.');
    }
  };

  // Update Application Status
  const handleUpdateAppStatus = async (
    id: string,
    status: ApplicationStatus
  ) => {
    setUpdatingAppId(id);
    try {
      const res = await updateJobApplicationStatus(id, status);
      if (res.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status } : app))
        );
        toast.success('Application status updated.');
      } else {
        toast.error(res.error || 'Failed to update status.');
      }
    } finally {
      setUpdatingAppId(null);
    }
  };

  // Delete Application
  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    const res = await deleteJobApplication(id);
    if (res.success) {
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.success('Application deleted.');
    } else {
      toast.error(res.error || 'Failed to delete application.');
    }
  };

  const activeJobsCount = jobs.filter((j) => j.isActive).length;
  const pendingAppsCount = applications.filter(
    (a) => a.status === 'pending'
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Careers Management
          </h2>
          <p className="text-sm text-slate-500">
            Create and manage open roles displayed on the public Careers page
            and review incoming candidate applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              loadJobs();
              loadApplications();
            }}
            className="gap-2"
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <Button
            onClick={handleOpenNewJobModal}
            className="bg-[#cfb53b] hover:bg-[#b89e2f] text-white gap-2"
          >
            <Plus className="size-4" />
            Post New Role
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Roles
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {jobs.length}
              </p>
            </div>
            <div className="size-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Briefcase className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Published Openings
              </p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {activeJobsCount}
              </p>
            </div>
            <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Applications
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {applications.length}
              </p>
            </div>
            <div className="size-11 rounded-xl bg-[#fef9e8] text-[#cfb53b] flex items-center justify-center">
              <Users className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Pending Review
              </p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {pendingAppsCount}
              </p>
            </div>
            <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('openings')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'openings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Job Postings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Candidate Applications ({applications.length})</span>
          {pendingAppsCount > 0 && (
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-[#cfb53b] text-white font-bold">
              {pendingAppsCount} new
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: JOB POSTINGS */}
      {activeTab === 'openings' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 self-start">
              {(['all', 'active', 'closed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setJobStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    jobStatusFilter === status
                      ? 'bg-[#fef9e8] text-[#b89e2f] border border-[#cfb53b]/40'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status === 'all'
                    ? 'All Roles'
                    : status === 'active'
                      ? 'Published'
                      : 'Hidden / Closed'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Search title, department, location..."
                className="pl-9 bg-white"
              />
            </div>
          </div>

          {loadingJobs ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              Loading job postings...
            </div>
          ) : filteredJobs.length === 0 ? (
            <Card className="border-dashed border-slate-300">
              <CardContent className="py-14 text-center space-y-3">
                <Briefcase className="size-10 text-slate-400 mx-auto" />
                <h3 className="text-lg font-semibold text-slate-800">
                  No Job Postings Found
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Create a job opening to display it on the public{' '}
                  <span className="font-mono text-xs">/careers</span> page.
                </p>
                <Button
                  onClick={handleOpenNewJobModal}
                  className="bg-[#cfb53b] hover:bg-[#b89e2f] text-white mt-2"
                >
                  <Plus className="size-4 mr-2" />
                  Create First Job Posting
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job) => {
                const appCount = applications.filter(
                  (a) => a.jobId === job.id || a.jobTitle === job.title
                ).length;

                return (
                  <Card
                    key={job.id}
                    className="border-slate-200/90 hover:border-slate-300 transition-all"
                  >
                    <CardContent className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2.5 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              job.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }
                          >
                            {job.isActive ? 'Published' : 'Hidden / Closed'}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#fef9e8] text-[#b89e2f] border-[#cfb53b]/30"
                          >
                            {job.department}
                          </Badge>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="size-3.5" />
                            {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="size-3.5" />
                            {job.type}
                          </span>
                          {job.salaryRange && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <DollarSign className="size-3.5" />
                              {job.salaryRange}
                            </span>
                          )}
                          {job.closingDate && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="size-3.5" />
                              Closes: {job.closingDate}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900">
                          {job.title}
                        </h3>

                        <p className="text-sm text-slate-600 line-clamp-2">
                          {job.summary || job.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
                          <span>
                            <strong>{job.responsibilities?.length || 0}</strong>{' '}
                            Responsibilities
                          </span>
                          <span>
                            <strong>{job.requirements?.length || 0}</strong>{' '}
                            Requirements
                          </span>
                          <span>
                            <strong>{appCount}</strong> Applicant
                            {appCount === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleJobActive(job)}
                          className="gap-1.5"
                        >
                          {job.isActive ? (
                            <>
                              <EyeOff className="size-4 text-slate-500" />
                              <span>Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="size-4 text-emerald-600" />
                              <span>Publish</span>
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditJobModal(job)}
                          className="gap-1.5"
                        >
                          <Edit2 className="size-4" />
                          <span>Edit</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteJob(job)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
                        >
                          <Trash2 className="size-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CANDIDATE APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setAppStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  appStatusFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All ({applications.length})
              </button>
              {APPLICATION_STATUSES.map((st) => (
                <button
                  key={st.value}
                  onClick={() => setAppStatusFilter(st.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    appStatusFilter === st.value
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <select
                value={appRoleFilter}
                onChange={(e) => setAppRoleFilter(e.target.value)}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none"
              >
                <option value="all">All Roles</option>
                {applicationRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search applicant name, email, role..."
                  className="pl-9 bg-white"
                />
              </div>
            </div>
          </div>

          {loadingApplications ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              Loading candidate applications...
            </div>
          ) : filteredApplications.length === 0 ? (
            <Card className="border-dashed border-slate-300">
              <CardContent className="py-14 text-center space-y-2">
                <Users className="size-10 text-slate-400 mx-auto" />
                <h3 className="text-lg font-semibold text-slate-800">
                  No Applications Found
                </h3>
                <p className="text-sm text-slate-500">
                  Candidate applications submitted on the Careers page will
                  appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredApplications.map((app) => {
                const statusMeta =
                  APPLICATION_STATUSES.find((s) => s.value === app.status) ||
                  APPLICATION_STATUSES[0];

                return (
                  <Card key={app.id} className="border-slate-200/90">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {app.applicantName}
                            </h3>
                            <Badge
                              variant="outline"
                              className={statusMeta.badgeClass}
                            >
                              {statusMeta.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-700 border-slate-200"
                            >
                              {app.jobTitle}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                            <a
                              href={`mailto:${app.email}`}
                              className="inline-flex items-center gap-1 hover:text-slate-900 underline"
                            >
                              <Mail className="size-3.5" />
                              {app.email}
                            </a>
                            <a
                              href={`tel:${app.phone}`}
                              className="inline-flex items-center gap-1 hover:text-slate-900"
                            >
                              <Phone className="size-3.5" />
                              {app.phone}
                            </a>
                            {app.yearsOfExperience && (
                              <span>
                                Experience:{' '}
                                <strong>{app.yearsOfExperience}</strong>
                              </span>
                            )}
                            {app.createdAt && (
                              <span>
                                Applied:{' '}
                                {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Selector & Delete */}
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            disabled={updatingAppId === app.id}
                            value={app.status}
                            onChange={(e) =>
                              app.id &&
                              handleUpdateAppStatus(
                                app.id,
                                e.target.value as ApplicationStatus
                              )
                            }
                            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none"
                          >
                            {APPLICATION_STATUSES.map((st) => (
                              <option key={st.value} value={st.value}>
                                {st.label}
                              </option>
                            ))}
                          </select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              app.id && handleDeleteApplication(app.id)
                            }
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>

                      {app.coverLetter && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 whitespace-pre-line">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Cover Note / Pitch
                          </p>
                          {app.coverLetter}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b89e2f] bg-[#fef9e8] border border-[#cfb53b]/30 px-3.5 py-2 rounded-lg hover:bg-[#fcf3d1]"
                          >
                            <FileText className="size-3.5" />
                            <span>View Resume / CV</span>
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                        {app.linkedInUrl && (
                          <a
                            href={app.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-3.5 py-2 rounded-lg hover:bg-slate-200"
                          >
                            <span>LinkedIn Profile</span>
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                        {app.portfolioUrl && (
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-3.5 py-2 rounded-lg hover:bg-slate-200"
                          >
                            <span>Portfolio / Website</span>
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT JOB MODAL */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl my-8">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-xl font-bold">
                  {editingJobId ? 'Edit Job Posting' : 'Create New Job Posting'}
                </CardTitle>
                <CardDescription>
                  Configure role details to display on the public Wephco Careers
                  page.
                </CardDescription>
              </div>
              <button
                onClick={() => setShowJobModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSaveJob} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Job Title *</Label>
                    <Input
                      required
                      value={jobForm.title}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, title: e.target.value })
                      }
                      placeholder="e.g. Senior Luxury Property Advisor"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Department *</Label>
                    <Input
                      required
                      value={jobForm.department}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, department: e.target.value })
                      }
                      placeholder="e.g. Brokerage & Advisory"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Location *</Label>
                    <Input
                      required
                      value={jobForm.location}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, location: e.target.value })
                      }
                      placeholder="e.g. Abuja, Nigeria / Dubai, UAE"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Employment Type</Label>
                    <select
                      value={jobForm.type}
                      onChange={(e) =>
                        setJobForm({
                          ...jobForm,
                          type: e.target.value as EmploymentType,
                        })
                      }
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                    >
                      {EMPLOYMENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Experience Level</Label>
                    <Input
                      value={jobForm.experienceLevel}
                      onChange={(e) =>
                        setJobForm({
                          ...jobForm,
                          experienceLevel: e.target.value,
                        })
                      }
                      placeholder="e.g. Senior (5+ Years)"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Salary / Compensation Range</Label>
                    <Input
                      value={jobForm.salaryRange}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, salaryRange: e.target.value })
                      }
                      placeholder="e.g. Competitive Base + Commission"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Application Closing Date</Label>
                    <Input
                      type="date"
                      value={jobForm.closingDate}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, closingDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Short Summary (Displayed on Job Card) *</Label>
                  <Textarea
                    required
                    rows={2}
                    value={jobForm.summary}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, summary: e.target.value })
                    }
                    placeholder="Brief 1-2 sentence overview of the opportunity..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Full Role Description</Label>
                  <Textarea
                    rows={4}
                    value={jobForm.description}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, description: e.target.value })
                    }
                    placeholder="Detailed overview of the role, team, and mission..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Key Responsibilities (One per line)</Label>
                  <Textarea
                    rows={4}
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                    placeholder={
                      'Advise UHNW clients on cross-border property acquisitions\nManage end-to-end deal negotiations and closing'
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Requirements & Qualifications (One per line)</Label>
                  <Textarea
                    rows={4}
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                    placeholder={
                      'Minimum 5 years experience in luxury real estate or private wealth\nProven network of high-net-worth investors'
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Benefits & Perks (One per line)</Label>
                  <Textarea
                    rows={3}
                    value={benefitsText}
                    onChange={(e) => setBenefitsText(e.target.value)}
                    placeholder={
                      'Uncapped commission structure\nInternational roadshow travel opportunities'
                    }
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    id="isActiveJob"
                    type="checkbox"
                    checked={jobForm.isActive}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, isActive: e.target.checked })
                    }
                    className="size-4 accent-[#cfb53b] rounded"
                  />
                  <Label htmlFor="isActiveJob" className="cursor-pointer">
                    Publish immediately on the public Careers page
                  </Label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowJobModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={savingJob}
                    className="bg-[#cfb53b] hover:bg-[#b89e2f] text-white"
                  >
                    {savingJob
                      ? 'Saving...'
                      : editingJobId
                        ? 'Save Changes'
                        : 'Create Job Posting'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

