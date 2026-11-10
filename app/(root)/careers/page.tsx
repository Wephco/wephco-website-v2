import React from 'react';
import { getCareers } from '@/actions/careers';
import CareersClient from './CareersClient';

export const revalidate = 0;

export default async function CareersPage() {
  const jobs = await getCareers(true);

  return <CareersClient initialJobs={jobs} />;
}
