
// Using the Jikan API (MyAnimeList API) for anime data
const BASE_URL = 'https://api.jikan.moe/v4';
const ANIME_API_URL = 'https://api-amvstrm.nyt92.eu.org/api/v2';

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

export interface VideoSource {
  quality: string;
  url: string;
}

export interface StreamResponse {
  sources: VideoSource[];
  success: boolean;
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

// Get episode streams from the API
export const fetchEpisodeStreams = async (animeId: string, episodeNumber: number): Promise<StreamResponse | null> => {
  try {
    await delay(100);
    // Try to fetch from the amvstrm API - this is a best effort attempt
    const response = await fetch(`${ANIME_API_URL}/stream/${animeId}/${episodeNumber}`);
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching episode streams:", error);
    return null;
  }
};

// Function to convert MAL ID to a consumet/anify API compatible ID 
// This is a mock function as we'd need a mapping database in a real app
const getAnimeProviderId = (malId: number): string => {
  // In a real app, we'd look up this mapping in a database
  // For now, let's create some mock mappings for demo purposes
  const mockMappings: Record<number, string> = {
    5114: "hunter-x-hunter-2011", // Hunter x Hunter
    21: "one-piece",              // One Piece
    1535: "death-note",           // Death Note
    30276: "one-punch-man",       // One Punch Man
    38000: "demon-slayer",        // Demon Slayer
    9253: "steins-gate",          // Steins Gate
    31964: "my-hero-academia",    // My Hero Academia
  };
  
  return mockMappings[malId] || `anime-${malId}`;
};

// This is a fallback for video sources
export const getVideoSources = (animeId: number, episodeNumber: number): VideoSource[] => {
  // Try to create dynamic sample videos based on the animeId and episodeNumber
  // In a real app, this would come from a streaming API
  
  // List of sample videos from Google's sample videos collection
  const sampleVideos = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  ];
  
  // Use a deterministic but different video for each episode
  const videoIndex = (animeId + episodeNumber) % sampleVideos.length;
  const mainVideo = sampleVideos[videoIndex];
  const secondVideo = sampleVideos[(videoIndex + 2) % sampleVideos.length];
  const thirdVideo = sampleVideos[(videoIndex + 4) % sampleVideos.length];
  
  return [
    {
      quality: "1080p",
      url: mainVideo,
    },
    {
      quality: "720p",
      url: secondVideo,
    },
    {
      quality: "480p",
      url: thirdVideo,
    }
  ];
};
