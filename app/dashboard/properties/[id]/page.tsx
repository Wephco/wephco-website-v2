import { notFound } from 'next/navigation';
import { getPropertyById } from '@/actions/property-management';
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PropertyControls from './PropertyControls';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 0;

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) return notFound();

  const tagColors: Record<string, string> = {
    verified: 'bg-green-500 hover:bg-green-600 text-white',
    pending: 'bg-amber-500 hover:bg-amber-600 text-white',
  };

  const statusColors: Record<string, string> = {
    available: 'bg-green-500 hover:bg-green-600 text-white',
    'under offer': 'bg-blue-500 hover:bg-blue-600 text-white',
    sold: 'bg-slate-600 hover:bg-slate-700 text-white',
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties">
          <button className="flex items-center justify-center h-10 w-10 rounded-md bg-transparent hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{property.title}</h2>
        <span
          className={`capitalize inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border-transparent ${tagColors[property.tag] || ''}`}>
          {property.tag || 'pending'}
        </span>
        <span
          className={`capitalize inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border-transparent ${statusColors[property.status] || ''}`}>
          {property.status || 'available'}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Image & Details */}
        <div className="rounded-xl border bg-white text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="leading-none tracking-tight flex items-center gap-2 text-slate-800 font-bold">
              <Building2 className="h-5 w-5 text-slate-500" />
              Property Information
            </h3>
          </div>
          <div className="p-6 pt-0 space-y-4">
            {property.images && property.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-40 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`${property.title} - ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-slate-500 flex items-center gap-1">
                <MapPin className="h-4 w-4" /> Location
              </span>
              <span className="font-semibold text-slate-800">
                {property.location}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-slate-500">Developer</span>
              <span className="font-semibold text-slate-800">
                {property.developer}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-slate-500 flex items-center gap-1">
                <DollarSign className="h-4 w-4" /> Price
              </span>
              <span className="font-bold text-lg text-[#cfb53b]">
                {formatCurrency(property.price, property.currency)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-slate-500 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> Yield
              </span>
              <span className="font-semibold text-slate-800">
                {property.yieldValue}%
              </span>
            </div>

            {/* Project Unit Configurations */}
            <div className="border-b pb-3 pt-1 space-y-2">
              <span className="text-slate-500 text-sm block font-medium">
                Available Unit Configurations
              </span>
              {property.units && property.units.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.units.map((u, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2 text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800">
                        {u.bedroom} {Number(u.bedroom) === 1 ? 'Bed' : 'Beds'}
                      </span>
                      <span className="text-slate-600">
                        {u.bathroom}{' '}
                        {Number(u.bathroom) === 1 ? 'Bath' : 'Baths'}
                      </span>
                      <span className="font-mono text-slate-700">
                        {u.square_foot} sq ft
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-xs text-center">
                  <div>
                    <span className="text-slate-400 block">Bedrooms</span>
                    <span className="font-semibold text-slate-800">
                      {Array.isArray(property.bedroom)
                        ? property.bedroom.join(', ')
                        : property.bedroom || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Bathrooms</span>
                    <span className="font-semibold text-slate-800">
                      {Array.isArray(property.bathroom)
                        ? property.bathroom.join(', ')
                        : property.bathroom || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Sq Ft</span>
                    <span className="font-semibold text-slate-800">
                      {Array.isArray(property.square_foot)
                        ? property.square_foot.join(', ')
                        : property.square_foot || 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {property.pdfUrl && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">PDF Brochure</span>
                <a
                  href={property.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-2 items-center text-[#cfb53b] hover:underline text-sm font-medium">
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border bg-white text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="leading-none tracking-tight text-slate-800 font-bold">
              Description
            </h3>
          </div>
          <div className="p-6 pt-0">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
              {property.description || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-xl border bg-white text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold leading-none tracking-tight text-lg text-muted-foreground">
            Actions
          </h3>
        </div>
        <div className="p-6 pt-0">
          <PropertyControls
            propertyId={property.id!}
            currentTag={property.tag || 'pending'}
            currentStatus={property.status || 'available'}
          />
        </div>
      </div>
    </div>
  );
}
