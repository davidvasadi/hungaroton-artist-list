'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchArtists, Artist, ApiResponse } from '../src/lib/api';
import {
  Box,
  Container,
  Grid,
  Pagination,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import ArtistCard from '../src/components/ArtistCard';

const ITEMS_PER_PAGE = 50;

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get('search') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [artists, setArtists] = useState<Artist[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>(initialSearch);
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const response: ApiResponse = await fetchArtists({
        search,
        page,
        per_page: ITEMS_PER_PAGE,
      });
      setArtists(response.data);
      // Ha a backend nem ad vissza total értéket, fallback érték legyen 300 (6 oldal 50 elemmel)
      const totalItems = response.total ?? 300;
      setTotal(totalItems);
      console.log('API response total:', response.total, '=> using total:', totalItems);
    } catch (error) {
      console.error('Hiba az API hívás során:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const params = new URLSearchParams();
    if (search) {
      params.set('search', search);
    }
    params.set('page', page.toString());
    router.replace(`/?${params.toString()}`);
  }, [search, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          borderRadius: 2,
          p: 4,
          mb: 4,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" color='#333333' gutterBottom>
          Fedezd fel az előadókat!
        </Typography>
        <Typography variant="body1" color='#333333'>
          Találd meg a kedvenc előadóidat és böngéssz a gyűjteményben.
        </Typography>
      </Box>

      <TextField
        label="Keresés"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
          }}
        >
          <CircularProgress sx={{ color: 'black' }} />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {artists.map((artist) => (
            <Grid item xs={12} sm={6} md={4} key={artist.id}>
              <ArtistCard
                id={artist.id}
                name={artist.name}
                portrait={artist.portrait}
                albumCount={artist.albumCount}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {total > 0 && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}
