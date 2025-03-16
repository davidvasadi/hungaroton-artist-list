export interface Artist {
  id: number;
  name: string;
  portrait: string;
  albumCount: number;
}

export interface ApiResponse {
  data: Artist[];
  total: number;
  page: number;
  per_page: number;
}

export async function fetchArtists(params: {
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<ApiResponse> {
  const url = new URL('https://exam.api.fotex.net/api/artists');
  url.searchParams.append('include_image', 'true');

  if (params.search) {
    url.searchParams.append('search', params.search);
  }
  url.searchParams.append('page', params.page ? params.page.toString() : '1');
  url.searchParams.append('per_page', params.per_page ? params.per_page.toString() : '50');

  // Adjuk hozzá a szükséges header-t
  const res = await fetch(url.toString(), {
    headers: {
      lang: 'hu',
    },
  });

  if (!res.ok) {
    throw new Error('Hiba történt az API hívás során');
  }
  const json = await res.json();
  return json as ApiResponse;
}
