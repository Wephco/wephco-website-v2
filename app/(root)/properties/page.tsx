'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseClient';
import { PropertyCard, PropertyCardProps } from '@/components/PropertyCard';
import { formatCurrency } from '@/lib/utils';
import { BiFilterAlt, BiGridAlt, BiMap, BiX } from 'react-icons/bi';

export default function PropertyListingsPage() {
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<
    PropertyCardProps[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [priceRange, setPriceRange] = useState<number>(50000000); // Max price default to 50M
  const [selectedBedroomFilter, setSelectedBedroomFilter] =
    useState<string>('Any');
  const [sortBy, setSortBy] = useState('Newest Listings');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch properties from Firestore
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'properties'));
        const propertiesData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            openModal: false,
            title: data.title || data.name || '',
            price: data.price || 0,
            description: data.description || '',
            location:
              data.location ||
              (data.city && data.country
                ? `${data.city}, ${data.country}`
                : ''),
            category: data.category || data.type || '',
            images: data.images || [],
            pdfUrl: data.pdfUrl || '',
            status: data.status || 'Available',
            currency: data.currency || 'USD',
            tag: data.tag || '',
            verified: data.verified || false,
            developer: data.developer || '',
            interests: data.interests || [],
            bedroom: data.bedroom ?? data.beds ?? data.bedrooms ?? '',
            bathroom: data.bathroom ?? data.baths ?? data.bathrooms ?? '',
            square_foot: data.square_foot ?? data.sqft ?? '',
            units: Array.isArray(data.units) ? data.units : [],
            amenities: data.amenities || [],
            createdAt: data.createdAt || null,
          };
        }) as any[];

        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching properties: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Apply price, bedroom filter, and sorting
  useEffect(() => {
    let result = [...properties];

    // Price range filter
    result = result.filter((p) => Number(p.price) <= priceRange);

    // Bedroom configuration filter (matches if project contains a unit with the selected bedroom count)
    if (selectedBedroomFilter !== 'Any') {
      result = result.filter((p) => {
        const unitBeds =
          p.units && p.units.length > 0
            ? p.units.map((u) => Number(u.bedroom))
            : String(p.bedroom || '')
                .split(',')
                .map((s) => Number(s.trim()))
                .filter((n) => !isNaN(n));

        if (selectedBedroomFilter === '4+') {
          return unitBeds.some((b) => b >= 4);
        }
        return unitBeds.includes(Number(selectedBedroomFilter));
      });
    }

    // Sorting logic
    if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'Most Iconic') {
      result.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    } else {
      // Newest Listings (default/fallback)
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    setFilteredProperties(result);
  }, [properties, priceRange, selectedBedroomFilter, sortBy]);

  const clearFilters = () => {
    setPriceRange(50000000);
    setSelectedBedroomFilter('Any');
    setSortBy('Newest Listings');
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-display pt-20">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Filters - Desktop & Mobile overlay */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-background-dark/95 border-r border-primary/10 flex flex-col transition-transform duration-300 transform
          md:static md:translate-x-0 md:bg-neutral-dark/40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 border-b border-primary/10 flex justify-between items-center mt-16 md:mt-0">
            <h2 className="font-bold text-lg uppercase tracking-wider text-slate-100">
              Refine Search
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={clearFilters}
                className="text-xs text-primary hover:underline uppercase font-bold cursor-pointer">
                Reset
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-white">
                <BiX className="text-2xl" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">
            {/* Price Range Slider */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-primary flex justify-between">
                Max Price (USD)
                <span className="font-mono text-white">
                  {formatCurrency(priceRange, 'USD')}
                </span>
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="500000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-primary bg-primary/20 h-1 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                  <span>$500K</span>
                  <span>$25M</span>
                  <span>$50M+</span>
                </div>
              </div>
            </div>

            {/* Unit Bedroom Filter */}
            <div className="space-y-3 pt-4 border-t border-primary/10">
              <label className="text-xs font-bold uppercase tracking-widest text-primary block">
                Unit Bedrooms
              </label>
              <div className="grid grid-cols-5 gap-2">
                {['Any', '1', '2', '3', '4+'].map((bed) => (
                  <button
                    key={bed}
                    type="button"
                    onClick={() => setSelectedBedroomFilter(bed)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selectedBedroomFilter === bed
                        ? 'bg-primary text-background-dark border-primary'
                        : 'bg-white/5 text-slate-300 border-primary/15 hover:border-primary/40'
                    }`}
                  >
                    {bed}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Listings Grid Area */}
        <section className="flex-1 flex flex-col bg-background-dark overflow-y-auto custom-scrollbar">
          {/* Controls Bar */}
          <div className="p-6 flex flex-col md:flex-row justify-between items-center border-b border-primary/10 gap-4 sticky top-0 bg-background-dark/95 backdrop-blur z-40">
            <div className="w-full md:w-auto flex justify-between items-center md:block">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {loading ? '...' : `${filteredProperties.length} Listing(s)`}
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  Wephco Premier Global Portfolio
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary rounded-lg text-sm font-bold active:scale-95 transition-transform">
                <BiFilterAlt /> Filter
              </button>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
              {/* View Toggle */}
              <div className="flex bg-primary/10 rounded-lg p-1 border border-primary/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-bold text-sm transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-primary text-background-dark'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}>
                  <BiGridAlt className="text-lg" /> Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-bold text-sm transition-all cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-primary text-background-dark'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}>
                  <BiMap className="text-lg" /> Map
                </button>
              </div>

              {/* Sort Selection */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-primary/5 border border-primary/20 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer">
                  <option className="bg-background-dark">
                    Newest Listings
                  </option>
                  <option className="bg-background-dark">
                    Price: High to Low
                  </option>
                  <option className="bg-background-dark">
                    Price: Low to High
                  </option>
                  <option className="bg-background-dark">Most Iconic</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold">
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Properties Content Grid */}
          <div className="p-6 flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
              </div>
            ) : viewMode === 'map' ? (
              <div className="w-full h-[60vh] rounded-xl border border-primary/10 bg-neutral-dark/30 flex flex-col items-center justify-center p-6 text-center">
                <BiMap className="text-6xl text-primary mb-4 animate-bounce" />
                <h4 className="text-xl font-bold mb-2">
                  Interactive Location Map
                </h4>
                <p className="text-slate-400 text-sm max-w-md">
                  Browse Wephco properties using our immersive geographic
                  mapping layer. Map views are available for premium verified
                  estates.
                </p>
              </div>
            ) : (
              // Grid View
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
                  {filteredProperties.map((property) => (
                    <div
                      key={property.id}
                      className="w-full flex justify-center">
                      <PropertyCard {...property} />
                    </div>
                  ))}
                </div>
                {filteredProperties.length === 0 && (
                  <div className="text-center py-24 border border-dashed border-primary/10 rounded-xl bg-neutral-dark/10">
                    <p className="text-slate-400 text-base">
                      No luxury properties match your active search filters.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-6 py-2 border border-primary/30 text-primary hover:bg-primary hover:text-background-dark text-xs uppercase tracking-wider font-bold rounded-md transition-all duration-300">
                      Reset Filter
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
