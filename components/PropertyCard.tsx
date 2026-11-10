'use client';

import React from 'react';
import Image from 'next/image';
import { IProperty } from '@/interfaces/propertyInterface';
import { formatCurrency as format } from '@/lib/utils';
import Link from 'next/link';
import { CountryFlag } from './CountryFlag';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';

export interface PropertyCardProps extends IProperty {
  showModal?: () => void;
  openModal: boolean;
}

const PropertyCard = ({ showModal, openModal, ...props }: PropertyCardProps) => {
  const units = props.units && props.units.length > 0 ? props.units : [];

  const bedsDisplay =
    units.length > 0
      ? Array.from(new Set(units.map((u) => String(u.bedroom).trim()).filter(Boolean))).join(', ')
      : Array.isArray(props.bedroom)
        ? props.bedroom.join(', ')
        : String(props.bedroom || '');

  const bathsDisplay =
    units.length > 0
      ? Array.from(new Set(units.map((u) => String(u.bathroom).trim()).filter(Boolean))).join(', ')
      : Array.isArray(props.bathroom)
        ? props.bathroom.join(', ')
        : String(props.bathroom || '');

  const sqftDisplay =
    units.length > 0
      ? Array.from(new Set(units.map((u) => String(u.square_foot).trim()).filter(Boolean))).join(', ')
      : Array.isArray(props.square_foot)
        ? props.square_foot.join(', ')
        : String(props.square_foot || '');

  return (
    <div
      className='w-full max-w-xs sm:max-w-sm md:w-96 h-122 font-display z-10'
    >
      <div
        className='relative w-full h-full transition-transform duration-500 [transform-3d]'
      >
        {/* --- FRONT SIDE --- */}
        <div className='absolute inset-0 backface-hidden bg-secondary/20 rounded-xl border border-primary/10 hover:border-primary/40 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-xl shadow-black/20 group'>
          <div className='relative w-full h-52 cursor-pointer overflow-hidden'>
            {props.images && props.images[0] ? (
              <Image
                src={props.images[0]}
                alt='Property'
                fill
                style={{ objectFit: 'cover' }}
                className='group-hover:scale-110 transition-transform duration-700'
              />
            ) : (
              <div className="w-full h-full bg-secondary/40 flex items-center justify-center text-slate-500">No Image</div>
            )}
            <div className='absolute top-4 left-4 bg-background-dark/80 backdrop-blur-md px-4 py-1.5 rounded text-[10px] font-bold text-primary tracking-widest uppercase border border-primary/20 z-20'>
              {props.status}
            </div>
            <div className='absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent opacity-80 z-10'></div>
            <div className='absolute bottom-4 left-6 right-6 z-20'>
              <h4 className='text-white text-lg font-light tracking-tight'>{props.title}</h4>
            </div>
          </div>
          <div className='p-6 flex flex-col gap-3 flex-1 justify-between'>
            <p className='text-slate-300 text-sm font-light line-clamp-2 leading-relaxed'>{props.description}</p>

            {/* Unit Configurations Summary */}
            {(bedsDisplay || bathsDisplay || sqftDisplay) && (
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 border-y border-primary/10 py-2">
                {bedsDisplay && (
                  <span className="inline-flex items-center gap-1">
                    <BiBed className="text-primary text-sm" />
                    <span>{bedsDisplay} Bed(s)</span>
                  </span>
                )}
                {bathsDisplay && (
                  <span className="inline-flex items-center gap-1">
                    <BiBath className="text-primary text-sm" />
                    <span>{bathsDisplay} Bath(s)</span>
                  </span>
                )}
                {sqftDisplay && (
                  <span className="inline-flex items-center gap-1">
                    <BiArea className="text-primary text-sm" />
                    <span className="truncate max-w-28">{sqftDisplay} Sq Ft</span>
                  </span>
                )}
              </div>
            )}

            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span className='flex items-center gap-1.5 font-mono uppercase tracking-wider text-[10px]'>
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                {props.location} <CountryFlag countryName={props.location} />
              </span>
            </div>

            <p className='text-primary text-2xl font-black mb-0.5'>{format(props.price, props.currency)}</p>

            <Link
              href={`/properties/${props.id}`}
              className='w-full py-3 border border-primary/30 text-primary hover:bg-primary hover:text-background-dark font-bold text-xs tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center'
            >
              View Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PropertyCard };

