import { useEffect, useState } from 'react';
import { fetchArtists, Artist, ApiResponse } from '../api';

export function useArtists(search: string, page: number) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchArtists({ search, page, per_page: 50 })
      .then((response: ApiResponse) => {
        setArtists(response.data);
        setTotal(response.total ?? 300);
      })
      .catch(() => {
        setError('Hiba történt az API hívás során');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, page]);

  return { artists, total, loading, error };
}
