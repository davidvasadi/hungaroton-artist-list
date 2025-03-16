//'use client'; 

import React, { Suspense } from 'react';
import { CircularProgress } from '@mui/material';
import PageContent from '../src/components/PageContent';

export const dynamic = 'force-dynamic'; // Ez kényszeríti a dinamikus renderelést

export default function HomePage() {
  return (
    <Suspense fallback={<CircularProgress sx={{ color: 'black', display: 'block', m: 'auto', mt: 4 }} />}>
      <PageContent />
    </Suspense>
  );
}
