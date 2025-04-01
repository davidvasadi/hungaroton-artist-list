// lib/api.ts
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
    type?: string;
  }): Promise<ApiResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('API base URL nincs beállítva!');
    }
    const url = new URL(`${baseUrl}/artists`);
  
    // Alapértelmezett paraméter: include_image true
    url.searchParams.append('include_image', 'true');
  
    if (params.search) {
      url.searchParams.append('search', params.search);
    }
    if (params.type) {
      url.searchParams.append('type', params.type);
    }
    url.searchParams.append('page', params.page ? params.page.toString() : '1');
    url.searchParams.append('per_page', params.per_page ? params.per_page.toString() : '50');
  
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
  