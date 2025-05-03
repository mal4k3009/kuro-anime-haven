
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import EpisodeList from "@/components/EpisodeList";
import { fetchAnimeDetails, fetchAnimeEpisodes, Anime, Episode } from "@/services/animeApi";

const AnimePage = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState({
    details: true,
    episodes: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Fetch anime details
        const animeData = await fetchAnimeDetails(parseInt(id));
        setAnime(animeData.data);
        setIsLoading(prev => ({ ...prev, details: false }));

        // Fetch episodes
        await fetchEpisodesPage(parseInt(id), 1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load anime data. Please try again later.",
          variant: "destructive",
        });
        setIsLoading({
          details: false,
          episodes: false,
        });
      }
    };

    fetchData();
  }, [id, toast]);

  const fetchEpisodesPage = async (animeId: number, page: number) => {
    setIsLoading(prev => ({ ...prev, episodes: true }));
    try {
      const episodesData = await fetchAnimeEpisodes(animeId, page);
      setEpisodes(episodesData.data);
      setTotalPages(episodesData.pagination.last_visible_page);
      setCurrentPage(page);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load episodes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, episodes: false }));
    }
  };

  const handlePageChange = (page: number) => {
    if (!id) return;
    fetchEpisodesPage(parseInt(id), page);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-16">
        {isLoading.details ? (
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-muted mb-4 w-1/3 rounded"></div>
              <div className="h-40 bg-muted mb-6 rounded"></div>
            </div>
          </div>
        ) : anime ? (
          <>
            {/* Anime Header */}
            <div className="relative w-full">
              <div className="h-[300px] w-full overflow-hidden relative">
                <img 
                  src={anime.images.jpg.large_image_url} 
                  alt={anime.title}
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background"></div>
              </div>
            </div>

            {/* Anime Content */}
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-24 relative z-10">
                {/* Left Side - Cover Image */}
                <div className="md:col-span-1">
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <img 
                      src={anime.images.jpg.large_image_url} 
                      alt={anime.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  </div>

                  <div className="mt-6 bg-card rounded-lg p-4 shadow-md">
                    <h3 className="font-semibold mb-3">Anime Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span>{anime.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Episodes:</span>
                        <span>{anime.episodes || 'Unknown'}</span>
                      </div>
                      {anime.aired && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Aired:</span>
                          <span>{new Date(anime.aired.from).getFullYear()}</span>
                        </div>
                      )}
                      {anime.score && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Score:</span>
                          <span className="text-kuro-400 font-semibold">{anime.score}</span>
                        </div>
                      )}
                      {anime.rating && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rating:</span>
                          <span>{anime.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {anime.genres && anime.genres.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {anime.genres.map(genre => (
                          <span 
                            key={genre.mal_id}
                            className="px-3 py-1 bg-secondary rounded-full text-xs"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side - Details & Episodes */}
                <div className="md:col-span-2">
                  <h1 className="text-3xl font-bold mb-2">{anime.title}</h1>
                  {anime.title_english && anime.title_english !== anime.title && (
                    <h2 className="text-xl text-muted-foreground mb-4">
                      {anime.title_english}
                    </h2>
                  )}

                  <div className="mb-8">
                    <h3 className="font-semibold mb-2">Synopsis</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {anime.synopsis}
                    </p>
                  </div>

                  {anime.trailer && anime.trailer.youtube_id && (
                    <div className="mb-8">
                      <h3 className="font-semibold mb-3">Trailer</h3>
                      <div className="aspect-video rounded-lg overflow-hidden bg-card">
                        <iframe 
                          src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                          allowFullScreen
                          className="w-full h-full"
                          title={`${anime.title} trailer`}
                        ></iframe>
                      </div>
                    </div>
                  )}

                  <EpisodeList 
                    animeId={parseInt(id!)}
                    episodes={episodes}
                    loading={isLoading.episodes}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-semibold">Anime not found</h1>
            <p className="text-muted-foreground mt-2">
              The anime you're looking for doesn't exist or was removed.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AnimePage;
