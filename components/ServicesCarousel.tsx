'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { wephcoServices } from '@/lib/constants';
import { ArrowRight, Pause, Play } from 'lucide-react';

// Service Images (Full & Small)
import InternationalFull from '@/images/services/international_property_brokerage/InternationalPropertyBrokerageFull.jpg';
import InternationalSmall from '@/images/services/international_property_brokerage/InternationalPropertyBrokerageSmall.jpg';

import DealPrepFull from '@/images/services/deal_preparation/DealPreparationCoachingFull.jpg';
import DealPrepSmall from '@/images/services/deal_preparation/DealPreparationCoachingSmall.jpg';

import ResidentialFull from '@/images/services/international_property_brokerage/InternationalPropertyBrokerage1Full.jpg';
import ResidentialSmall from '@/images/services/international_property_brokerage/InternationalPropertyBrokerage1Small.jpg';

import CommercialFull from '@/images/services/commercial_property/CommercialPropertyBrokerageFull.jpg';
import CommercialSmall from '@/images/services/commercial_property/CommercialPropertyBrokerageSmall.jpg';

import LandAcquisitionFull from '@/images/services/land_acquisition_development_advisory/LandAcquisitionDevelopmentAdvisoryFull.jpg';
import LandAcquisitionSmall from '@/images/services/land_acquisition_development_advisory/LandAcquisitionDevelopmentAdvisorySmall.jpg';

import PropertyManagementFull from '@/images/services/property_management_leasing/PropertyManagementLeasingFull.jpg';
import PropertyManagementSmall from '@/images/services/property_management_leasing/PropertyManagementLeasingSmall.jpg';

import RenovationFull from '@/images/services/renovation_interior_exterior_design/RenovationInterior_ExteriorDesignFull.jpg';
import RenovationSmall from '@/images/services/renovation_interior_exterior_design/RenovationInterior_ExteriorDesignSmall.jpg';

import EscrowFull from '@/images/services/escrow_verification/EscrowVerificationFull.jpg';
import EscrowSmall from '@/images/services/escrow_verification/EscrowVerificationSmall.jpg';

import AcquisitionConsultationFull from '@/images/services/acquisition_consultation/AcquisitionConsultationFull.jpg';
import AcquisitionConsultationSmall from '@/images/services/acquisition_consultation/AcquisitionConsultationSmall.jpg';

import PrivateAdvisoryFull from '@/images/services/private_real_estate_advisory/PrivateRealEstateAdvisoryFull.jpg';
import PrivateAdvisorySmall from '@/images/services/private_real_estate_advisory/PrivateRealEstateAdvisorySmall.jpg';

import InvestorCircleFull from '@/images/services/investor_circle_access/InvestorCircleAccessFull.jpg';
import InvestorCircleSmall from '@/images/services/investor_circle_access/InvestorCircleAccessSmall.jpg';

import LegacyWealthFull from '@/images/services/legacy_wealth_structuring/LegacyWealthStructuringFull.jpg';
import LegacyWealthSmall from '@/images/services/legacy_wealth_structuring/LegacyWealthStructuringSmall.jpg';

import InvestmentAdvisoryFull from '@/images/services/investment_advisory/InvestmentAdvisoryFull.jpg';
import InvestmentAdvisorySmall from '@/images/services/investment_advisory/InvestmentAdvisorySmall.jpg';

export interface ServiceSlideItem {
  id: string;
  title: string;
  description: string;
  category: string;
  fullImage: StaticImageData;
  smallImage: StaticImageData;
}

const imageMap: Record<
  string,
  { full: StaticImageData; small: StaticImageData }
> = {
  'International Property Brokerage': {
    full: InternationalFull,
    small: InternationalSmall,
  },
  'Deal Preparation & Coaching': {
    full: DealPrepFull,
    small: DealPrepSmall,
  },
  'Residential & Luxury Homes': {
    full: ResidentialFull,
    small: ResidentialSmall,
  },
  'Commercial Property Brokerage': {
    full: CommercialFull,
    small: CommercialSmall,
  },
  'Land Acquisition & Development Advisory': {
    full: LandAcquisitionFull,
    small: LandAcquisitionSmall,
  },
  'Property Management & Leasing': {
    full: PropertyManagementFull,
    small: PropertyManagementSmall,
  },
  'Renovation & Interior/Exterior Design': {
    full: RenovationFull,
    small: RenovationSmall,
  },
  'Escrow Verification': {
    full: EscrowFull,
    small: EscrowSmall,
  },
  'Acquisition Consultation': {
    full: AcquisitionConsultationFull,
    small: AcquisitionConsultationSmall,
  },
  'Private Real Estate Advisory': {
    full: PrivateAdvisoryFull,
    small: PrivateAdvisorySmall,
  },
  'Investor Circle Access': {
    full: InvestorCircleFull,
    small: InvestorCircleSmall,
  },
  'Legacy & Wealth Structuring': {
    full: LegacyWealthFull,
    small: LegacyWealthSmall,
  },
  'Investment Advisory': {
    full: InvestmentAdvisoryFull,
    small: InvestmentAdvisorySmall,
  },
};

const SERVICE_SLIDES: ServiceSlideItem[] = [
  ...(wephcoServices.international || []).map((item, idx) => ({
    id: `intl-${idx}`,
    title: item.title,
    description: item.description,
    category: 'International Services',
    fullImage: imageMap[item.title]?.full || InternationalFull,
    smallImage: imageMap[item.title]?.small || InternationalSmall,
  })),
  ...(wephcoServices.local || []).map((item, idx) => ({
    id: `local-${idx}`,
    title: item.title,
    description: item.description,
    category: 'Local Services',
    fullImage: imageMap[item.title]?.full || CommercialFull,
    smallImage: imageMap[item.title]?.small || CommercialSmall,
  })),
  ...(wephcoServices.consultation || []).map((item, idx) => ({
    id: `consult-${idx}`,
    title: item.title,
    description: item.description,
    category: 'Consultation & Advisory',
    fullImage: imageMap[item.title]?.full || AcquisitionConsultationFull,
    smallImage: imageMap[item.title]?.small || AcquisitionConsultationSmall,
  })),
];

interface BoundingRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Component 1: The list of images in line to be shown (bottom-left of screen)
 */
interface ServiceImageQueueProps {
  queueItems: ServiceSlideItem[];
  isTransitioning: boolean;
  topItemRef: React.RefObject<HTMLDivElement | null>;
  onSelectTopItem: () => void;
}

function ServiceImageQueue({
  queueItems,
  isTransitioning,
  topItemRef,
  onSelectTopItem,
}: ServiceImageQueueProps) {
  // Show the first 4 upcoming items in the vertical line (the 4th enters smoothly from bottom during transition)
  const visibleQueue = queueItems.slice(0, 4);

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 lg:bottom-10 lg:left-10 z-30 flex flex-col pointer-events-auto">
      {/* Vertical queue container */}
      <div className="relative h-[188px] sm:h-[228px] lg:h-114 overflow-hidden">
        <div
          className={`flex flex-col gap-3 ${
            isTransitioning
              ? 'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] -translate-y-[100px] sm:-translate-y-[120px] lg:-translate-y-39'
              : ''
          }`}
        >
          {visibleQueue.map((item, idx) => {
            const isTopOfList = idx === 0;
            return (
              <div
                key={item.id}
                ref={isTopOfList ? topItemRef : undefined}
                onClick={isTopOfList ? onSelectTopItem : undefined}
                className={`w-full sm:w-96 max-w-full sm:max-w-[calc(100vw-3rem)] h-22 sm:h-27 lg:h-36 relative rounded-xl sm:rounded-2xl overflow-hidden border shrink-0 select-none group cursor-pointer transition-all duration-300 ${
                  isTopOfList
                    ? 'border-primary/80 shadow-2xl shadow-black/70 ring-1 ring-primary/40'
                    : 'border-white/15 opacity-80 hover:opacity-100 shadow-lg shadow-black/50'
                } ${isTopOfList && isTransitioning ? 'opacity-0' : ''}`}
              >
                <Image
                  src={item.smallImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 384px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={idx < 2}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent" />

                <div className="absolute bottom-2.5 left-3.5 right-3.5 sm:bottom-3 sm:left-4 sm:right-4 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-primary/90 uppercase tracking-widest font-semibold mb-0.5">
                      {item.category}
                    </p>
                    <h4 className="text-white text-xs sm:text-base font-bold leading-snug line-clamp-1">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Component 2: The main image of the carousel
 */
interface ServiceMainCarouselProps {
  activeSlide: ServiceSlideItem;
  incomingSlide: ServiceSlideItem;
  isTransitioning: boolean;
  expandingStyle: React.CSSProperties | null;
  activeIndex: number;
  totalSlides: number;
  isPaused: boolean;
  onTogglePause: () => void;
  intervalMs: number;
}

function ServiceMainCarousel({
  activeSlide,
  incomingSlide,
  isTransitioning,
  expandingStyle,
  activeIndex,
  totalSlides,
  isPaused,
  onTogglePause,
  intervalMs,
}: ServiceMainCarouselProps) {
  const displayedSlide = isTransitioning ? incomingSlide : activeSlide;

  return (
    <div className="relative w-full h-full overflow-hidden bg-background-dark">
      {/* Base Active Main Image */}
      <div className="absolute inset-0 z-10">
        <Image
          src={activeSlide.fullImage}
          alt={activeSlide.title}
          fill
          sizes="100vw"
          priority
          className="object-cover transition-transform duration-2800 ease-out scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/75" />
        <div className="absolute inset-0 bg-linear-to-t from-background-dark/95 via-transparent to-black/50" />
      </div>

      {/* Transitioning Image Layer (animating from the top of the bottom-left list into the main carousel) */}
      {isTransitioning && expandingStyle && (
        <div
          style={expandingStyle}
          className="z-20 overflow-hidden shadow-2xl pointer-events-none"
        >
          <Image
            src={incomingSlide.fullImage}
            alt={incomingSlide.title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/75" />
          <div className="absolute inset-0 bg-linear-to-t from-background-dark/95 via-transparent to-black/50" />
        </div>
      )}

      {/* Main Slide Content Overlay (Positioned at top on mobile/tablet and right-aligned on desktop so bottom-left queue is completely clear) */}
      <div className="relative z-30 h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-22 sm:pt-24 lg:pt-28 pb-6 lg:pb-10 flex flex-col justify-start lg:justify-between pointer-events-none">
        {/* Right-aligned Service Details on desktop, top-aligned on mobile */}
        <div className="mt-0 lg:my-auto lg:ml-auto lg:max-w-xl xl:max-w-2xl bg-black/55 lg:bg-black/45 backdrop-blur-md border border-white/10 p-5 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl pointer-events-auto transition-all duration-500">
          <span className="inline-block text-primary text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-1.5 sm:mb-3">
            {displayedSlide.category}
          </span>
          <h1
            key={displayedSlide.id}
            className="text-white text-xl sm:text-3xl md:text-5xl font-light leading-tight mb-2.5 sm:mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-500"
          >
            {displayedSlide.title}
          </h1>
          <p
            key={`${displayedSlide.id}-desc`}
            className="text-slate-200 text-xs sm:text-sm md:text-base font-light leading-relaxed mb-4 sm:mb-8 line-clamp-3 sm:line-clamp-4 lg:line-clamp-none animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {displayedSlide.description}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
            <Link
              href="/consultations"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-background-dark px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary/25"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <Link
              href={`/services/${displayedSlide.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center gap-2 border border-white/25 hover:border-primary text-white px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider hover:bg-white/5 transition-all"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes serviceProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export function ServicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [expandingStyle, setExpandingStyle] =
    useState<React.CSSProperties | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const topQueueItemRef = useRef<HTMLDivElement | null>(null);

  const DISPLAY_DURATION_MS = 3000; // 2-3 seconds per slide
  const TRANSITION_DURATION_MS = 700;

  const totalSlides = SERVICE_SLIDES.length;
  const activeSlide = SERVICE_SLIDES[activeIndex];
  const nextIndex = (activeIndex + 1) % totalSlides;
  const incomingSlide = SERVICE_SLIDES[nextIndex];

  // Build the ordered queue starting with the next slide at index 0 (top of the list)
  const queueItems = React.useMemo(() => {
    const items: ServiceSlideItem[] = [];
    for (let i = 1; i < totalSlides; i++) {
      items.push(SERVICE_SLIDES[(activeIndex + i) % totalSlides]);
    }
    return items;
  }, [activeIndex, totalSlides]);

  const triggerNextTransition = useCallback(() => {
    if (isTransitioning) return;

    const containerEl = containerRef.current;
    const topItemEl = topQueueItemRef.current;

    let startRect: BoundingRect = {
      top: 400,
      left: 40,
      width: 384,
      height: 144,
    };

    if (containerEl && topItemEl) {
      const cRect = containerEl.getBoundingClientRect();
      const tRect = topItemEl.getBoundingClientRect();
      startRect = {
        top: tRect.top - cRect.top,
        left: tRect.left - cRect.left,
        width: tRect.width,
        height: tRect.height,
      };
    }

    // 1. Position transition clone right over the top item of the bottom-left list
    setExpandingStyle({
      position: 'absolute',
      top: `${startRect.top}px`,
      left: `${startRect.left}px`,
      width: `${startRect.width}px`,
      height: `${startRect.height}px`,
      borderRadius: '16px',
      transition: 'none',
    });
    setIsTransitioning(true);

    // 2. Expand smoothly into the full main carousel on the next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setExpandingStyle({
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          height: '100%',
          borderRadius: '0px',
          transition: `all ${TRANSITION_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        });
      });
    });

    // 3. Complete transition and advance activeIndex
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
      setIsTransitioning(false);
      setExpandingStyle(null);
    }, TRANSITION_DURATION_MS);
  }, [isTransitioning, totalSlides]);

  // Auto-advance every 2-3 seconds
  useEffect(() => {
    if (isPaused || isTransitioning) return;

    const timer = setTimeout(() => {
      triggerNextTransition();
    }, DISPLAY_DURATION_MS);

    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, isTransitioning, triggerNextTransition]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-dvh overflow-hidden bg-background-dark font-display select-none"
    >
      {/* Component 2: Main Image of the Carousel */}
      <ServiceMainCarousel
        activeSlide={activeSlide}
        incomingSlide={incomingSlide}
        isTransitioning={isTransitioning}
        expandingStyle={expandingStyle}
        activeIndex={activeIndex}
        totalSlides={totalSlides}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((p) => !p)}
        intervalMs={DISPLAY_DURATION_MS}
      />

      {/* Component 1: List of Images in Line to be Shown (Bottom-Left) */}
      <ServiceImageQueue
        queueItems={queueItems}
        isTransitioning={isTransitioning}
        topItemRef={topQueueItemRef}
        onSelectTopItem={triggerNextTransition}
      />
    </section>
  );
}
