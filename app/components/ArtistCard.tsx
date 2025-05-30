// app/components/ArtistCard.tsx
'use client';

import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

interface ArtistCardProps {
  name: string;
  portrait?: string;
  albumCount: number;
}

export default function ArtistCard({ name, portrait, albumCount }: ArtistCardProps) {
  return (
    <Card>
      {portrait && (
        <CardMedia component="img" height="200" image={portrait} alt={name} />
      )}
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Albumok: {albumCount}
        </Typography>
      </CardContent>
    </Card>
  );
}
