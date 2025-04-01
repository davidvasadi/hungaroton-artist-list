// app/components/PageContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchArtists, Artist, ApiResponse } from '../../lib/api';
import { useDebounce } from '../../lib/hooks/useDebounce';
import { TEXTS } from '../../lib/constants';
import {
  Box,
  Container,
  Grid,
  Pagination,
  TextField,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import ArtistCard from './ArtistCard';

const ITEMS_PER_PAGE = 50;

export default function PageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get('search') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  // Felhasználó által gépelt keresési érték és debounced verziója
  const [tempSearch, setTempSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(tempSearch, 300);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Új állapot a type paraméter kezelésére
  const [type, setType] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse = await fetchArtists({
        search: debouncedSearch,
        page,
        per_page: ITEMS_PER_PAGE,
        type, // csak a type paraméter maradt
      });
      setArtists(response.data);
      setTotal(response.total ?? 300);
    } catch (err) {
      console.error('Szándékos Hiba az API hívás során,töltsd újra az oldalt:', err);
      // setError(TEXTS.errorMessage);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const params = new URLSearchParams();
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    }
    if (type) {
      params.set('type', type);
    }
    params.set('page', page.toString());
    router.replace(`/?${params.toString()}`);
  }, [debouncedSearch, type, page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" color="#333333">
        {TEXTS.pageTitle}
      </Typography>
      <Typography variant="body1" color="#333333" sx={{ mt: 2, mb: 2 }}>
        {TEXTS.pageDescription}
      </Typography>
      <TextField
        label={TEXTS.searchLabel}
        variant="outlined"
        fullWidth
        value={tempSearch}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      {/* Type szűrés - legördülő menü */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="type-select-label">{TEXTS.typeLabel}</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={type}
          label={TEXTS.typeLabel}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <MenuItem value=""><em>Minden</em></MenuItem>
          <MenuItem value="is_composer">Szerző</MenuItem>
          <MenuItem value="is_performer">Előadó</MenuItem>
          <MenuItem value="is_primary">Elsődleges</MenuItem>
        </Select>
      </FormControl>

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
        <>
          {artists.length === 0 && !loading ? (
            <Typography variant="body1" sx={{ mt: 2 }}>
              {TEXTS.noResults}
            </Typography>
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
        </>
      )}

      {artists.length > 0 && totalPages > 1 && (
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
