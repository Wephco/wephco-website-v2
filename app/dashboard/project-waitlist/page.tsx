'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Save,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  Search,
  Users,
  CheckCircle2,
  Clock,
  Building2,
  Sparkles,
  TrendingUp,
  Calendar,
  MapPin,
  Award,
  ShieldCheck,
  Eye,
  FileText,
  Lock,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getProjectWaitlistConfig,
  updateProjectWaitlistConfig,
  getWaitlistSubmissions,
  updateWaitlistSubmissionStatus,
  deleteWaitlistSubmission,
} from '@/actions/waitlist';
import { uploadFile } from '@/lib/helperFunctions';
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
import {
  IProjectWaitlistConfig,
  IWaitlistEntry,
  IProjectHighlight,
  DEFAULT_PROJECT_WAITLIST_CONFIG,
} from '@/interfaces/waitlist';

const AVAILABLE_ICONS = [
  'Award',
  'Building2',
  'ShieldCheck',
  'TrendingUp',
  'Sparkles',
  'MapPin',
  'Calendar',
  'Clock',
  'CheckCircle2',
  'Lock',
];

export default function DashboardProjectWaitlistPage() {
  const [activeTab, setActiveTab] = useState<'config' | 'submissions'>('config');

  // Config State
  const [config, setConfig] = useState<IProjectWaitlistConfig>(
    DEFAULT_PROJECT_WAITLIST_CONFIG
  );
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submissions State
  const [submissions, setSubmissions] = useState<IWaitlistEntry[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // New highlight form inputs
  const [newHighlight, setNewHighlight] = useState<IProjectHighlight>({
    id: '',
    icon: 'Award',
    title: '',
    description: '',
  });

  // New unit category input
  const [newUnitCategory, setNewUnitCategory] = useState('');

  // Fetch Config
  const loadConfigData = async () => {
    setLoadingConfig(true);
    try {
      const data = await getProjectWaitlistConfig();
      setConfig(data);
    } catch (err) {
      toast.error('Failed to load waitlist configuration.');
    } finally {
      setLoadingConfig(false);
    }
  };

  // Fetch Submissions
  const loadSubmissionsData = async () => {
    setLoadingSubmissions(true);
    try {
      const data = await getWaitlistSubmissions();
      setSubmissions(data);
    } catch (err) {
      toast.error('Failed to load waitlist entries.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    loadConfigData();
    loadSubmissionsData();
  }, []);

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadFile(file, 'waitlist');
      setConfig((prev) => ({ ...prev, image: url }));
      toast.success('Showcase image uploaded successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Config
  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      const result = await updateProjectWaitlistConfig(config);
      if (result.success) {
        toast.success('Project Waitlist configuration saved successfully!');
      } else {
        toast.error(result.error || 'Failed to save configuration.');
      }
    } catch (err) {
      toast.error('An error occurred while saving.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Highlight management
  const addHighlight = () => {
    if (!newHighlight.title || !newHighlight.description) {
      toast.warning('Please enter both title and description for the highlight.');
      return;
    }
    const item: IProjectHighlight = {
      ...newHighlight,
      id: `h_${Date.now()}`,
    };
    setConfig((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), item],
    }));
    setNewHighlight({ id: '', icon: 'Award', title: '', description: '' });
    toast.success('Highlight added');
  };

  const removeHighlight = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((h) => h.id !== id),
    }));
  };

  // Unit Category management
  const addUnitCategory = () => {
    if (!newUnitCategory.trim()) return;
    if (config.unitCategories?.includes(newUnitCategory.trim())) {
      toast.warning('Unit category already exists.');
      return;
    }
    setConfig((prev) => ({
      ...prev,
      unitCategories: [...(prev.unitCategories || []), newUnitCategory.trim()],
    }));
    setNewUnitCategory('');
  };

  const removeUnitCategory = (categoryToRemove: string) => {
    setConfig((prev) => ({
      ...prev,
      unitCategories: (prev.unitCategories || []).filter(
        (c) => c !== categoryToRemove
      ),
    }));
  };

  // Status Change for Submission
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await updateWaitlistSubmissionStatus(id, newStatus);
      if (res.success) {
        toast.success('Status updated');
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      } else {
        toast.error(res.error || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Submission
  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this waitlist entry?')) return;
    setUpdatingId(id);
    try {
      const res = await deleteWaitlistSubmission(id);
      if (res.success) {
        toast.success('Submission deleted');
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error(res.error || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Error deleting submission');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unitType?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const inputClassName =
    'mt-1 bg-white text-black placeholder:text-black/50 border-gray-300 focus-visible:ring-[#cfb53b]';

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto text-black">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight flex items-center gap-2">
            <Layers className="w-8 h-8 text-[#cfb53b]" />
            Project Waitlist Manager
          </h1>
          <p className="text-sm text-black mt-1">
            View, customize, and manage the website VIP Project Waitlist showcase and user registrations.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'config'
                ? 'bg-[#fef9e8] text-black shadow-xs border border-[#cfb53b]/40'
                : 'text-black hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4 text-[#cfb53b]" />
            Showcase Content &amp; Settings
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-[#fef9e8] text-black shadow-xs border border-[#cfb53b]/40'
                : 'text-black hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 text-[#cfb53b]" />
            Waitlist Submissions ({submissions.length})
          </button>
        </div>
      </div>

      {/* TAB 1: SHOWCASE CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Fields */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Titles & Descriptions */}
            <Card className="bg-white text-black border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-black flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#cfb53b]" />
                  Main Section Headlines
                </CardTitle>
                <CardDescription className="text-black">
                  Configure the primary title, highlighted phrase, and subtitle displayed at the top of the component.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase text-black">
                      Title Prefix
                    </Label>
                    <Input
                      value={config.title}
                      onChange={(e) =>
                        setConfig({ ...config, title: e.target.value })
                      }
                      placeholder="e.g. The Canopies at"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase text-black">
                      Title Highlight (Gold)
                    </Label>
                    <Input
                      value={config.titleHighlight}
                      onChange={(e) =>
                        setConfig({ ...config, titleHighlight: e.target.value })
                      }
                      placeholder="e.g. Yas Point"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase text-black">
                    Subtitle / Description
                  </Label>
                  <Textarea
                    value={config.subtitle}
                    onChange={(e) =>
                      setConfig({ ...config, subtitle: e.target.value })
                    }
                    rows={3}
                    placeholder="Enter subtitle description..."
                    className={inputClassName}
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase text-black">
                    Internal Project Name (Used in email &amp; submission records)
                  </Label>
                  <Input
                    value={config.projectName}
                    onChange={(e) =>
                      setConfig({ ...config, projectName: e.target.value })
                    }
                    placeholder="e.g. The Canopies at Yas Point"
                    className={inputClassName}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Showcase Image & Badges */}
            <Card className="bg-white text-black border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-black flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#cfb53b]" />
                  Showcase Image &amp; Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-bold uppercase text-black">
                    Project Image URL or Upload
                  </Label>
                  <div className="flex items-center gap-3 mt-1">
                    <Input
                      value={config.image}
                      onChange={(e) =>
                        setConfig({ ...config, image: e.target.value })
                      }
                      placeholder="e.g. /images/pdf-about/project_canopies_yas_point.png or https://..."
                      className="flex-1 bg-white text-black placeholder:text-black/50 border-gray-300"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-white text-black border-gray-300 hover:bg-gray-100"
                    >
                      {uploadingImage ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      ) : (
                        <Upload className="w-4 h-4 text-black" />
                      )}
                      Upload Image
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase text-black">
                      Phase Badge Text
                    </Label>
                    <Input
                      value={config.phaseBadge}
                      onChange={(e) =>
                        setConfig({ ...config, phaseBadge: e.target.value })
                      }
                      placeholder="e.g. Pre-Launch Phase 1"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase text-black">
                      Location Badge Text
                    </Label>
                    <Input
                      value={config.locationBadge}
                      onChange={(e) =>
                        setConfig({ ...config, locationBadge: e.target.value })
                      }
                      placeholder="e.g. Yas Island, Abu Dhabi"
                      className={inputClassName}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Specs */}
            <Card className="bg-white text-black border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-black flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#cfb53b]" />
                  Performance Specs (Stats Bar)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-bold uppercase text-black">
                    Target Yield
                  </Label>
                  <Input
                    value={config.targetYield}
                    onChange={(e) =>
                      setConfig({ ...config, targetYield: e.target.value })
                    }
                    placeholder="e.g. 9.8% p.a."
                    className={inputClassName}
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase text-black">
                    Handover Date
                  </Label>
                  <Input
                    value={config.handover}
                    onChange={(e) =>
                      setConfig({ ...config, handover: e.target.value })
                    }
                    placeholder="e.g. Q4 2027"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase text-black">
                    Allocation Percentage
                  </Label>
                  <Input
                    value={config.allocation}
                    onChange={(e) =>
                      setConfig({ ...config, allocation: e.target.value })
                    }
                    placeholder="e.g. 84% Reserved"
                    className={inputClassName}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Project Highlights Builder */}
            <Card className="bg-white text-black border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-black flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#cfb53b]" />
                  Key Project Highlights (3 Feature Cards)
                </CardTitle>
                <CardDescription className="text-black">
                  Feature cards displayed directly under the main project image showcase.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {config.highlights?.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="text-xs font-mono bg-white text-black border-gray-300"
                        >
                          {h.icon}
                        </Badge>
                        <div>
                          <p className="text-xs font-bold text-black">{h.title}</p>
                          <p className="text-[11px] text-black">{h.description}</p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeHighlight(h.id)}
                        className="text-black hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <p className="text-xs font-bold text-black">Add New Highlight</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-[10px] font-bold uppercase text-black">
                        Icon
                      </Label>
                      <select
                        value={newHighlight.icon}
                        onChange={(e) =>
                          setNewHighlight({ ...newHighlight, icon: e.target.value })
                        }
                        className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-xs bg-white text-black"
                      >
                        {AVAILABLE_ICONS.map((icon) => (
                          <option key={icon} value={icon} className="text-black bg-white">
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="text-[10px] font-bold uppercase text-black">
                        Title
                      </Label>
                      <Input
                        value={newHighlight.title}
                        onChange={(e) =>
                          setNewHighlight({ ...newHighlight, title: e.target.value })
                        }
                        placeholder="e.g. VIP Floor Choice"
                        className="mt-1 text-xs bg-white text-black placeholder:text-black/50 border-gray-300"
                      />
                    </div>

                    <div>
                      <Label className="text-[10px] font-bold uppercase text-black">
                        Description
                      </Label>
                      <Input
                        value={newHighlight.description}
                        onChange={(e) =>
                          setNewHighlight({
                            ...newHighlight,
                            description: e.target.value,
                          })
                        }
                        placeholder="Short description..."
                        className="mt-1 text-xs bg-white text-black placeholder:text-black/50 border-gray-300"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addHighlight}
                    className="w-full text-xs font-bold flex items-center justify-center gap-1 mt-2 bg-white text-black border-gray-300 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 text-black" /> Add Highlight
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preferred Unit Options */}
            <Card className="bg-white text-black border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-black flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#cfb53b]" />
                  Preferred Unit Category Options
                </CardTitle>
                <CardDescription className="text-black">
                  Options available in the signup form select dropdown.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {config.unitCategories?.map((cat) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className="px-3 py-1.5 text-xs font-semibold flex items-center gap-2 bg-white text-black border-gray-300"
                    >
                      {cat}
                      <button
                        onClick={() => removeUnitCategory(cat)}
                        className="text-black hover:text-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Input
                    value={newUnitCategory}
                    onChange={(e) => setNewUnitCategory(e.target.value)}
                    placeholder="e.g. 5 Bedroom Sky Mansion"
                    className="text-xs flex-1 bg-white text-black placeholder:text-black/50 border-gray-300"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addUnitCategory();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addUnitCategory}
                    className="text-xs font-bold bg-white text-black border-gray-300 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 mr-1 text-black" /> Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Bar */}
            <div className="sticky bottom-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-xl flex items-center justify-between">
              <p className="text-xs text-black">
                Click save to update the live ProjectWaitlist component on the home page.
              </p>
              <Button
                onClick={handleSaveConfig}
                disabled={savingConfig}
                className="bg-[#cfb53b] hover:bg-[#b89f30] text-black font-bold px-6 py-2.5 flex items-center gap-2"
              >
                {savingConfig ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Save className="w-4 h-4 text-black" />
                )}
                Save Changes
              </Button>
            </div>
          </div>

          {/* Right Column: Live Component Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-6">
              <Card className="border-2 border-[#cfb53b]/40 shadow-xl overflow-hidden bg-white text-black">
                <CardHeader className="border-b border-gray-200 bg-white py-3 px-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black flex items-center gap-1.5 uppercase tracking-wider">
                      <Eye className="w-4 h-4 text-[#cfb53b]" /> Live Preview
                    </span>
                    <Badge className="bg-[#fef9e8] text-black border border-[#cfb53b]/40 text-[10px]">
                      Homepage Component
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4 font-display text-xs text-black">
                  {/* Headline Preview */}
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-black">
                      {config.title || 'The Canopies at'}{' '}
                      <span className="font-black italic text-black underline decoration-[#cfb53b]">
                        {config.titleHighlight || 'Yas Point'}
                      </span>
                    </h3>
                    <p className="text-[11px] text-black font-normal line-clamp-2">
                      {config.subtitle}
                    </p>
                  </div>

                  {/* Image Card Preview */}
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-gray-200">
                    <Image
                      src={
                        config.image ||
                        '/images/pdf-about/project_canopies_yas_point.png'
                      }
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="bg-white text-black font-extrabold text-[9px] px-2 py-0.5 rounded shadow">
                        {config.phaseBadge}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-white/95 border border-gray-200 p-2 rounded-lg grid grid-cols-3 gap-1 text-center text-[9px] text-black">
                      <div>
                        <p className="text-black font-bold uppercase">Yield</p>
                        <p className="font-black text-black">{config.targetYield}</p>
                      </div>
                      <div className="border-x border-gray-200">
                        <p className="text-black font-bold uppercase">Handover</p>
                        <p className="font-black text-black">{config.handover}</p>
                      </div>
                      <div>
                        <p className="text-black font-bold uppercase">Reserved</p>
                        <p className="font-black text-black">{config.allocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Preview */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase text-black">
                      Highlights ({config.highlights?.length || 0})
                    </p>
                    <div className="space-y-1">
                      {config.highlights?.map((h) => (
                        <div
                          key={h.id}
                          className="bg-white border border-gray-200 p-2 rounded-lg flex items-center justify-between"
                        >
                          <span className="font-bold text-black text-[11px]">
                            {h.title}
                          </span>
                          <span className="text-[10px] text-black">
                            {h.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Units Preview */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-black">
                      Unit Categories ({config.unitCategories?.length || 0})
                    </p>
                    <div className="bg-white border border-gray-200 p-2 rounded-lg text-[11px] text-black">
                      {config.unitCategories?.[0]} +{' '}
                      {Math.max(0, (config.unitCategories?.length || 0) - 1)} more
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WAITLIST SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* Submissions Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-white text-black border-gray-200 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-black font-medium uppercase">
                    Total VIP Registrations
                  </p>
                  <h3 className="text-2xl font-black text-black mt-1">
                    {submissions.length}
                  </h3>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 text-[#cfb53b]">
                  <Users className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white text-black border-gray-200 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-black font-medium uppercase">
                    Pending Allocation Access
                  </p>
                  <h3 className="text-2xl font-black text-black mt-1">
                    {
                      submissions.filter(
                        (s) => !s.status || s.status === 'pending_vip_access'
                      ).length
                    }
                  </h3>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <Clock className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white text-black border-gray-200 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-black font-medium uppercase">
                    Contacted / Converted
                  </p>
                  <h3 className="text-2xl font-black text-black mt-1">
                    {
                      submissions.filter(
                        (s) => s.status === 'contacted' || s.status === 'converted'
                      ).length
                    }
                  </h3>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter & Refresh Controls */}
          <Card className="bg-white text-black border-gray-200 shadow-sm">
            <CardHeader className="py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search name, email, phone, or unit type..."
                      className="pl-9 text-xs bg-white text-black placeholder:text-black/50 border-gray-300"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 text-xs bg-white text-black"
                  >
                    <option value="all" className="text-black bg-white">
                      All Statuses
                    </option>
                    <option value="pending_vip_access" className="text-black bg-white">
                      Pending VIP Access
                    </option>
                    <option value="contacted" className="text-black bg-white">
                      Contacted
                    </option>
                    <option value="converted" className="text-black bg-white">
                      Converted
                    </option>
                  </select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSubmissionsData}
                  disabled={loadingSubmissions}
                  className="flex items-center gap-1.5 text-xs bg-white text-black border-gray-300 hover:bg-gray-100"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-black ${
                      loadingSubmissions ? 'animate-spin' : ''
                    }`}
                  />
                  Refresh List
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 border-t border-gray-200">
              {loadingSubmissions ? (
                <div className="p-12 text-center text-black text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#cfb53b]" />
                  Loading waitlist entries...
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="p-12 text-center text-black text-xs space-y-2">
                  <FileText className="w-8 h-8 text-black mx-auto" />
                  <p className="font-semibold text-black">No waitlist entries found.</p>
                  <p className="text-black text-[11px]">
                    User signups from the homepage waitlist form will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse text-black">
                    <thead>
                      <tr className="bg-gray-50 text-black font-bold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                        <th className="p-4">Customer</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Preferred Unit</th>
                        <th className="p-4">Project</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Submitted Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-black">
                      {filteredSubmissions.map((entry) => (
                        <tr
                          key={entry.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 font-bold text-black">
                            {entry.name}
                          </td>
                          <td className="p-4 space-y-0.5">
                            <p className="text-black font-medium">{entry.email}</p>
                            <p className="text-[11px] text-black font-mono">
                              {entry.phoneNumber}
                            </p>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className="text-[11px] bg-white text-black border-gray-300 font-normal"
                            >
                              {entry.unitType || 'Not specified'}
                            </Badge>
                          </td>
                          <td className="p-4 font-medium text-black">
                            {entry.projectName || 'The Canopies at Yas Point'}
                          </td>
                          <td className="p-4">
                            <select
                              value={entry.status || 'pending_vip_access'}
                              disabled={updatingId === entry.id}
                              onChange={(e) =>
                                handleStatusChange(entry.id!, e.target.value)
                              }
                              className="text-[11px] font-bold border border-gray-300 rounded-lg p-1.5 cursor-pointer bg-white text-black"
                            >
                              <option value="pending_vip_access" className="text-black bg-white">
                                Pending VIP Access
                              </option>
                              <option value="contacted" className="text-black bg-white">
                                Contacted
                              </option>
                              <option value="converted" className="text-black bg-white">
                                Converted
                              </option>
                            </select>
                          </td>
                          <td className="p-4 text-black text-[11px]">
                            {entry.createdAt
                              ? new Date(entry.createdAt).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )
                              : '—'}
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={updatingId === entry.id}
                              onClick={() => handleDeleteSubmission(entry.id!)}
                              className="text-black hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
