'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProperty, updateProperty } from '@/actions/property-management';
import { IProperty, IPropertyUnit } from '@/interfaces/propertyInterface';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  FileText,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { uploadFile } from '@/lib/helperFunctions';
import ReactSelect from 'react-select';

interface PropertyFormProps {
  property?: IProperty;
  mode: 'create' | 'edit';
}

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderColor: state.isFocused
      ? 'var(--primary, #e2b857)'
      : 'rgba(226, 184, 87, 0.2)',
    color: 'rgba(0,0,0,1)',
    padding: '2px',
    borderRadius: '0.5rem',
    boxShadow: 'none',
    borderWidth: '1px',
    '&:hover': {
      borderColor: 'rgba(226, 184, 87, 0.5)',
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    border: '1px solid rgba(226, 184, 87, 0.2)',
    zIndex: 9999,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'rgba(255, 255, 255, 1)'
      : state.isFocused
        ? 'rgba(255, 255, 255, 0.15)'
        : 'transparent',
    color: state.isSelected ? '#0f172a' : 'rgba(0,0,0,1)',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      color: '#0f172a',
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'rgba(0,0,0,1)',
  }),
  input: (base: any) => ({
    ...base,
    color: 'rgba(0,0,0,1)',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#94a3b8',
  }),
};

export default function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(
    property?.images || []
  );
  const [selectedFiles, setSelectedFiles] = useState<
    { file: File; preview: string }[]
  >([]);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(
    property?.pdfUrl ? 'Existing brochure' : null
  );

  const [countriesData, setCountriesData] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
  } | null>(() => {
    if (property?.location) {
      const parts = property.location.split(',');
      const country = parts[1]?.trim() || parts[0]?.trim() || '';
      return country ? { label: country, value: country } : null;
    }
    return null;
  });
  const [selectedCity, setSelectedCity] = useState<{
    label: string;
    value: string;
  } | null>(() => {
    if (property?.location) {
      const parts = property.location.split(',');
      const city = parts[0]?.trim() || '';
      return city ? { label: city, value: city } : null;
    }
    return null;
  });
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);

  const [units, setUnits] = useState<IPropertyUnit[]>(() => {
    if (property?.units && Array.isArray(property.units) && property.units.length > 0) {
      return property.units.map((u) => ({
        bedroom: u.bedroom?.toString() || '',
        bathroom: u.bathroom?.toString() || '',
        square_foot: u.square_foot?.toString() || '',
      }));
    }

    if (property?.bedroom || property?.bathroom || property?.square_foot) {
      const beds = String(property.bedroom ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const baths = String(property.bathroom ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const sqfts = String(property.square_foot ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const maxLen = Math.max(beds.length, baths.length, sqfts.length, 1);

      return Array.from({ length: maxLen }, (_, idx) => ({
        bedroom: beds[idx] || beds[0] || '1',
        bathroom: baths[idx] || baths[0] || '1',
        square_foot: sqfts[idx] || sqfts[0] || '',
      }));
    }

    return [{ bedroom: '1', bathroom: '1', square_foot: '' }];
  });

  const [formState, setFormState] = useState({
    title: property?.title || '',
    developer: property?.developer || '',
    location: property?.location || '',
    yieldValue: property?.yieldValue?.toString() || '0',
    price: property?.price?.toString() || '0',
    description: property?.description || '',
    currency: property?.currency || 'NGN',
    status: property?.status || 'Available',
    tag: property?.tag || 'local',
    category: property?.category || 'Sale',
    verified: property?.verified ?? false,
    interests: property?.interests?.join(', ') || '',
  });

  const handleChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleUnitChange = (
    index: number,
    field: keyof IPropertyUnit,
    value: string
  ) => {
    setUnits((prev) =>
      prev.map((unit, idx) =>
        idx === index ? { ...unit, [field]: value } : unit
      )
    );
  };

  const addUnit = () => {
    setUnits((prev) => [
      ...prev,
      { bedroom: '', bathroom: '', square_foot: '' },
    ]);
  };

  const removeUnit = (index: number) => {
    if (units.length <= 1) return;
    setUnits((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFiles((prev) => [
          ...prev,
          { file, preview: reader.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPdf(file);
      setPdfFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !formState.title ||
      !selectedCountry ||
      !selectedCity ||
      !formState.price
    ) {
      toast.warning('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (existingImages.length === 0 && selectedFiles.length === 0) {
      toast.warning('Please upload at least one image of your property');
      setIsSubmitting(false);
      return;
    }

    const validUnits = units
      .map((u) => ({
        bedroom: String(u.bedroom).trim(),
        bathroom: String(u.bathroom).trim(),
        square_foot: String(u.square_foot).trim(),
      }))
      .filter((u) => u.bedroom || u.bathroom || u.square_foot);

    if (validUnits.length === 0) {
      toast.warning(
        'Please add at least one unit configuration (bedrooms, bathrooms, and square footage)'
      );
      setIsSubmitting(false);
      return;
    }

    const bedroomSummary = Array.from(
      new Set(validUnits.map((u) => u.bedroom).filter(Boolean))
    ).join(', ');
    const bathroomSummary = Array.from(
      new Set(validUnits.map((u) => u.bathroom).filter(Boolean))
    ).join(', ');
    const sqftSummary = Array.from(
      new Set(validUnits.map((u) => u.square_foot).filter(Boolean))
    ).join(', ');

    const imageUrls = await Promise.all(
      selectedFiles.map((file) => uploadFile(file.file, 'properties'))
    );
    const pdfUrl = selectedPdf
      ? await uploadFile(selectedPdf, 'properties/pdfs')
      : '';

    const propertyLocation = `${selectedCity.value}, ${selectedCountry.value}`;

    try {
      const formData = new FormData();
      formData.append('title', formState.title);
      formData.append('developer', formState.developer);
      formData.append('location', propertyLocation);
      formData.append('yieldValue', formState.yieldValue);
      formData.append('price', formState.price);
      formData.append('description', formState.description);
      formData.append('currency', formState.currency);
      formData.append('status', formState.status);
      formData.append('tag', formState.tag);
      formData.append('category', formState.category);
      formData.append('bedroom', bedroomSummary);
      formData.append('bathroom', bathroomSummary);
      formData.append('square_foot', sqftSummary);
      formData.append('units', JSON.stringify(validUnits));
      formData.append('verified', formState.verified ? 'true' : 'false');

      const interestsArray = formState.interests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);
      formData.append('interests', JSON.stringify(interestsArray));
      formData.append('imageUrls', JSON.stringify(imageUrls));
      formData.append('pdfUrl', pdfUrl);

      if (mode === 'edit' && property?.id) {
        formData.append('existingImages', JSON.stringify(existingImages));
        formData.append('existingPdf', property.pdfUrl || '');
        await updateProperty(property.id, formData);
      } else {
        await createProperty(formData);
      }

      toast.success(
        `Property ${mode === 'create' ? 'created' : 'updated'} successfully`
      );
      router.push('/dashboard/properties');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(`Failed to ${mode === 'create' ? 'create' : 'update'} property`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const res = await fetch(
          'https://countriesnow.space/api/v0.1/countries'
        );
        const json = await res.json();
        if (!json.error) {
          setCountriesData(json.data);
        } else {
          toast.error('Failed to load countries list');
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
        toast.error('Error fetching countries list');
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const countryOptions = countriesData.map((c: any) => ({
    label: c.country,
    value: c.country,
  }));

  const selectedCountryData = countriesData.find(
    (c: any) => c.country === selectedCountry?.value
  );
  const cityOptions = selectedCountryData
    ? selectedCountryData.cities.map((city: string) => ({
        label: city,
        value: city,
      }))
    : [];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          {mode === 'create' ? 'Add New Property' : 'Edit Property'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Property Details */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-slate-800 font-bold text-lg">
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-slate-700 font-semibold">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formState.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Property title"
                  className="text-slate-800"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="developer"
                  className="text-slate-700 font-semibold">
                  Developer
                </Label>
                <Input
                  id="developer"
                  value={formState.developer}
                  onChange={(e) => handleChange('developer', e.target.value)}
                  placeholder="Developer name"
                  className="text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Country *
                  </label>
                  <ReactSelect
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={(val) => {
                      setSelectedCountry(val);
                      setSelectedCity(null);
                    }}
                    placeholder={
                      isLoadingCountries ? 'Loading...' : 'Select Country'
                    }
                    styles={customSelectStyles}
                    isLoading={isLoadingCountries}
                    isSearchable
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">City *</label>
                  <ReactSelect
                    options={cityOptions}
                    value={selectedCity}
                    onChange={(val) => setSelectedCity(val)}
                    placeholder="Select City"
                    styles={customSelectStyles}
                    isDisabled={!selectedCountry}
                    isSearchable
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="description"
                  className="text-slate-700 font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formState.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Property description..."
                  className="text-slate-800"
                  rows={4}
                />
              </div>
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-700 font-semibold">
                      Project Unit Configurations *
                    </Label>
                    <p className="text-xs text-slate-500">
                      Add each unit type available in this project (e.g. 1 Bed,
                      2 Beds, 3 Beds with their respective bathrooms & sq ft).
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addUnit}
                    className="gap-1.5 border-[#cfb53b]/40 text-[#b89e2f] hover:bg-[#fef9e8]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Unit Type
                  </Button>
                </div>

                <div className="space-y-3">
                  {units.map((unit, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-3 items-end bg-slate-50/80 border border-slate-200/80 rounded-lg p-3"
                    >
                      <div className="col-span-4 sm:col-span-3 grid gap-1.5">
                        <Label className="text-xs text-slate-600 font-medium">
                          Bedrooms
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={unit.bedroom}
                          onChange={(e) =>
                            handleUnitChange(idx, 'bedroom', e.target.value)
                          }
                          className="text-slate-800 bg-white h-9"
                          placeholder="e.g. 1"
                          required
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-4 grid gap-1.5">
                        <Label className="text-xs text-slate-600 font-medium">
                          Bathrooms
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={unit.bathroom}
                          onChange={(e) =>
                            handleUnitChange(idx, 'bathroom', e.target.value)
                          }
                          className="text-slate-800 bg-white h-9"
                          placeholder="e.g. 1.5"
                          required
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-4 grid gap-1.5">
                        <Label className="text-xs text-slate-600 font-medium">
                          Sq Ft
                        </Label>
                        <Input
                          type="text"
                          value={unit.square_foot}
                          onChange={(e) =>
                            handleUnitChange(idx, 'square_foot', e.target.value)
                          }
                          className="text-slate-800 bg-white h-9"
                          placeholder="e.g. 1200"
                          required
                        />
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={units.length <= 1}
                          onClick={() => removeUnit(idx)}
                          className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Settings */}
          <div className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-slate-800 font-bold text-lg">
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="price"
                      className="text-slate-700 font-semibold">
                      Price *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formState.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      className="text-slate-800"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="currency"
                      className="text-slate-700 font-semibold">
                      Currency
                    </Label>
                    <Select
                      value={formState.currency}
                      onValueChange={(v) => handleChange('currency', v)}>
                      <SelectTrigger className="text-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">NGN (₦)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="yieldValue"
                    className="text-slate-700 font-semibold">
                    Yield (%)
                  </Label>
                  <Input
                    id="yieldValue"
                    type="number"
                    step="0.1"
                    value={formState.yieldValue}
                    onChange={(e) => handleChange('yieldValue', e.target.value)}
                    className="text-slate-800"
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-slate-800 font-bold text-lg">
                  Settings & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-slate-700 font-semibold">Tag</Label>
                    <Select
                      value={formState.tag}
                      onValueChange={(v) => handleChange('tag', v)}>
                      <SelectTrigger className="text-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="international">
                          International
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-slate-700 font-semibold">
                      Category
                    </Label>
                    <Select
                      value={formState.category}
                      onValueChange={(v) => handleChange('category', v)}>
                      <SelectTrigger className="text-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Lease">Lease</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-slate-700 font-semibold">Status</Label>
                  <Select
                    value={formState.status}
                    onValueChange={(v) => handleChange('status', v)}>
                    <SelectTrigger className="text-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Under Offer">Under Offer</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={formState.verified}
                    onChange={(e) => handleChange('verified', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#cfb53b] focus:ring-[#cfb53b] cursor-pointer"
                  />
                  <Label
                    htmlFor="verified"
                    className="cursor-pointer text-slate-700 font-semibold">
                    Verified Property
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Upload */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-slate-800 font-bold text-lg">
                Property Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-[#cfb53b] transition-colors"
                onClick={() => fileInputRef.current?.click()}>
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-10 w-10" />
                  <p className="text-sm">Click to upload images</p>
                  <p className="text-xs">PNG, JPG up to 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {(existingImages.length > 0 || selectedFiles.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {existingImages.map((url, idx) => (
                    <div
                      key={`existing-${idx}`}
                      className="relative w-full h-32 group">
                      <Image
                        src={url}
                        alt="Existing Preview"
                        fill
                        className="object-cover rounded-md"
                        sizes="200px"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExistingImage(idx)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  {selectedFiles.map((sf, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="relative w-full h-32 group">
                      <Image
                        src={sf.preview}
                        alt="New Preview"
                        fill
                        className="object-cover rounded-md"
                        sizes="200px"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeNewImage(idx)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* PDF Upload & Submit */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-slate-800 font-bold text-lg">
                PDF Brochure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-[#cfb53b] transition-colors"
                onClick={() => pdfInputRef.current?.click()}>
                {pdfFileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-10 w-10 text-[#cfb53b]" />
                    <p className="text-sm font-medium">{pdfFileName}</p>
                    <p className="text-xs text-muted-foreground">
                      Click to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="h-10 w-10" />
                    <p className="text-sm">Click to upload a PDF brochure</p>
                    <p className="text-xs">PDF up to 20MB</p>
                  </div>
                )}
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handlePdfChange}
                />
              </div>
              {pdfFileName && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPdf(null);
                    setPdfFileName(null);
                  }}>
                  Remove PDF
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="mt-5">
          <Button
            type="submit"
            className="w-full bg-[#cfb53b] hover:bg-[#b89e2f] text-white mt-4"
            disabled={isSubmitting}>
            <Upload className="mr-2 h-4 w-4" />
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
                ? 'Create Property'
                : 'Update Property'}
          </Button>
        </div>
      </form>
    </div>
  );
}
