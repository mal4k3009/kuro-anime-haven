
// Using the Jikan API (MyAnimeList API) for anime data
const BASE_URL = 'https://api.jikan.moe/v4';

// Basic rate limiting helper to avoid API rejection
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    }
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    }
  };
  trailer?: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
  };
  synopsis: string;
  status: string;
  episodes?: number;
  score?: number;
  genres: Array<{ mal_id: number; name: string }>;
  aired: {
    from: string;
    to: string | null;
  };
  rating?: string;
}

export interface AnimeResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export interface Episode {
  mal_id: number;
  title: string;
  episode: number;
  url: string;
  filler: boolean;
  recap: boolean;
  forum_url: string;
  aired: string;
}

export interface EpisodeResponse {
  data: Episode[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export const fetchTopAnime = async (page = 1): Promise<AnimeResponse> => {
  await delay(100); // Rate limiting
  const response = await fetch(`${BASE_URL}/top/anime?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch top anime');
  }
  return await response.json();
};

export const fetchSeasonalAnime = async (page = 1): Promise<AnimeResponse> => {
  await delay(100); // Rate limiting
  const response = await fetch(`${BASE_URL}/seasons/now?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch seasonal anime');
  }
  return await response.json();
};

export const fetchAnimeDetails = async (id: number): Promise<{ data: Anime }> => {
  await delay(100); // Rate limiting
  const response = await fetch(`${BASE_URL}/anime/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch anime details');
  }
  return await response.json();
};

export const fetchAnimeEpisodes = async (id: number, page = 1): Promise<EpisodeResponse> => {
  await delay(100); // Rate limiting
  const response = await fetch(`${BASE_URL}/anime/${id}/episodes?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch anime episodes');
  }
  return await response.json();
};

export const searchAnime = async (query: string, page = 1): Promise<AnimeResponse> => {
  await delay(100); // Rate limiting
  const response = await fetch(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to search anime');
  }
  return await response.json();
};

// This is a mock function for video streaming URLs (since real streaming would require licensing)
export const getStreamingUrl = (animeId: number, episodeNumber: number): string => {
  return `https://example.com/stream/${animeId}/${episodeNumber}`;
};

// Mock video sources for demonstration
export const getVideoSources = (animeId: number, episodeNumber: number) => {
  return [
    {
      quality: "1080p",
      url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
    },
    {
      quality: "720p",
      url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4`,
    },
    {
      quality: "480p",
      url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4`,
    },
  ];
};
