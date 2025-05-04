
// Using the Jikan API (MyAnimeList API) for anime data
const BASE_URL = 'https://api.jikan.moe/v4';
const ANIME_API_URL = 'https://api-amvstrm.nyt92.eu.org/api/v2';
const ANIME_STREAMING_API = 'https://api.amvstr.me/api/v2';

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

// Get real episode streams from the API
export const fetchEpisodeStreams = async (animeId: string, episodeNumber: number): Promise<StreamResponse | null> => {
  try {
    await delay(100);
    // First try using the main amvstr.me API
    let response = await fetch(`${ANIME_STREAMING_API}/stream/${animeId}/${episodeNumber}`);
    
    // If that fails, try the backup API
    if (!response.ok) {
      response = await fetch(`${ANIME_API_URL}/stream/${animeId}/${episodeNumber}`);
    }
    
    if (response.ok) {
      const data = await response.json();
      if (data.sources && data.sources.length > 0) {
        return data;
      }
    }
    
    // If both APIs fail or return no sources, try to get the anime ID in consumet format
    const consumetId = await getConsumableAnimeId(parseInt(animeId));
    if (consumetId) {
      response = await fetch(`${ANIME_STREAMING_API}/stream/${consumetId}/${episodeNumber}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.sources && data.sources.length > 0) {
          return data;
        }
      }
    }
    
    // If all API attempts fail, fall back to sample videos
    return null;
  } catch (error) {
    console.error("Error fetching episode streams:", error);
    return null;
  }
};

// Function to map MAL IDs to consumable API IDs
const getConsumableAnimeId = async (malId: number): Promise<string | null> => {
  try {
    // First try direct mapping
    const directMapping = getAnimeProviderId(malId);
    if (directMapping) return directMapping;
    
    // If that doesn't work, try to search for the anime by details
    const animeDetails = await fetchAnimeDetails(malId);
    if (!animeDetails || !animeDetails.data) return null;
    
    const title = animeDetails.data.title_english || animeDetails.data.title;
    // Convert title to slug format: lowercase, replace spaces with hyphens, remove special characters
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    return slug;
  } catch (error) {
    console.error("Error getting consumable anime ID:", error);
    return null;
  }
};

// Function to convert MAL ID to a consumet/anify API compatible ID 
const getAnimeProviderId = (malId: number): string | null => {
  // More extensive mapping of popular anime
  const mappings: Record<number, string> = {
    5114: "fullmetal-alchemist-brotherhood", // Fullmetal Alchemist: Brotherhood
    21: "one-piece",                        // One Piece
    1735: "naruto",                         // Naruto
    20: "naruto-shippuden",                 // Naruto Shippuuden
    1535: "death-note",                     // Death Note
    30276: "one-punch-man",                 // One Punch Man
    38000: "demon-slayer-kimetsu-no-yaiba", // Demon Slayer
    9253: "steins-gate",                    // Steins Gate
    31964: "my-hero-academia",              // My Hero Academia
    16498: "attack-on-titan",               // Attack on Titan
    40028: "jujutsu-kaisen",                // Jujutsu Kaisen
    11061: "hunter-x-hunter-2011",          // Hunter x Hunter (2011)
    11757: "sword-art-online",              // Sword Art Online
    269: "bleach",                          // Bleach
    47778: "chainsaw-man",                  // Chainsaw Man
    37991: "jojos-bizarre-adventure-golden-wind", // JoJo's Bizarre Adventure: Golden Wind
    34134: "one-punch-man-2",               // One Punch Man 2
    35760: "my-hero-academia-season-3",     // My Hero Academia 3
    43555: "dr-stone-stone-wars",           // Dr. Stone: Stone Wars
    48583: "shingeki-no-kyojin-the-final-season", // Attack on Titan: Final Season
    52991: "frieren-beyond-journeys-end",   // Frieren
    51805: "blue-lock",                     // Blue Lock
    51009: "spy-x-family",                  // Spy x Family
  };
  
  return mappings[malId] || null;
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
