
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchArtists, Artist, ApiResponse } from '../lib/api';
import {
  Box,
  Container,
  Grid,
  Pagination,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import ArtistCard from '../components/ArtistCard';

const ITEMS_PER_PAGE = 50;

export default function PageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get('search') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [artists, setArtists] = useState<Artist[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>(initialSearch);
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse = await fetchArtists({
        search,
        page,
        per_page: ITEMS_PER_PAGE,
      });
      setArtists(response.data);
      const totalItems = response.total ?? 300;
      setTotal(totalItems);
      console.log('API response total:', response.total, '=> using total:', totalItems);
    } catch (error) {
      console.error('Hiba az API hívás során:', error);
      setError('-');
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
    console.log('New page (Pagination):', value);
    setPage(value);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  console.log('Total pages calculated:', totalPages);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
     <Typography variant="h4" component="h1" color='#333333'>
    Előadók
  </Typography>
  <Typography variant="body1" color='#333333' sx={{ mt: 2,  mb: 2}}>
    Találd meg a kedvenc előadóidat és böngéssz a gyűjteményben.
  </Typography>
      <TextField
        label="Keresés"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

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
