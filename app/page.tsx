'use client';

import React, { Suspense } from 'react';
import { CircularProgress } from '@mui/material';
import PageContent from './components/PageContent';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <Suspense fallback={<CircularProgress sx={{ color: 'black', display: 'block', m: 'auto', mt: 4 }} />}>
      <PageContent />
    </Suspense>
  );
}
