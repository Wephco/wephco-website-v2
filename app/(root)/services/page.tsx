'use client';

import React from 'react';
import { ServicesCarousel } from '@/components/ServicesCarousel';

export default function ServicesPage() {
  return (
    <main className="w-full h-dvh overflow-hidden bg-background-dark">
      <ServicesCarousel />
    </main>
  );
}
