
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/NavBar";
import VideoPlayer from "@/components/VideoPlayer";
import { fetchAnimeDetails, fetchAnimeEpisodes, Anime, Episode } from "@/services/animeApi";
import { Button } from "@/components/ui/button";

const WatchPage = () => {
  const { id, episode } = useParams<{ id: string; episode: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedEpisodes, setRelatedEpisodes] = useState<Episode[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const animeId = id ? parseInt(id) : 0;
  const episodeNumber = episode ? parseInt(episode) : 1;

  useEffect(() => {
    const fetchData = async () => {
      if (!animeId) return;
      
      setIsLoading(true);
      
      try {
        // Fetch anime details
        const animeData = await fetchAnimeDetails(animeId);
        setAnime(animeData.data);
        
        // Fetch episodes
        const episodesData = await fetchAnimeEpisodes(animeId, 1);
        setEpisodes(episodesData.data);
        
        // Find current episode
        const currentEp = episodesData.data.find(ep => ep.episode === episodeNumber) || null;
        setCurrentEpisode(currentEp);
        
        // Set related episodes (5 episodes around current)
        const relatedEps = episodesData.data
          .filter(ep => Math.abs(ep.episode - episodeNumber) <= 2)
          .sort((a, b) => a.episode - b.episode);
        
        setRelatedEpisodes(relatedEps);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load anime data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [animeId, episodeNumber, toast]);

  const navigateToEpisode = (ep: number) => {
    navigate(`/watch/${animeId}/${ep}`);
  };

  const hasPrevious = episodeNumber > 1;
  const hasNext = episodes.some(ep => ep.episode === episodeNumber + 1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-6">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="w-full aspect-video bg-muted rounded-lg mb-4"></div>
              <div className="h-8 bg-muted mb-4 w-1/3 rounded"></div>
              <div className="h-4 bg-muted mb-2 w-full rounded"></div>
              <div className="h-4 bg-muted w-2/3 rounded"></div>
            </div>
          ) : (
            <>
              {/* Breadcrumbs */}
              <div className="mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Link to="/" className="hover:text-kuro-400 transition">Home</Link>
                  <span className="mx-2">/</span>
                  <Link to={`/anime/${animeId}`} className="hover:text-kuro-400 transition">
                    {anime?.title || 'Anime'}
                  </Link>
                  <span className="mx-2">/</span>
                  <span>Episode {episodeNumber}</span>
                </div>
              </div>

              {/* Video Player */}
              <VideoPlayer 
                animeId={animeId} 
                episodeNumber={episodeNumber} 
                title={anime?.title || ''}
              />
              
              {/* Episode Info */}
              <div className="mt-6">
                <h1 className="text-2xl font-bold">{anime?.title} - Episode {episodeNumber}</h1>
                
                {currentEpisode && (
                  <h2 className="text-lg text-muted-foreground mt-1">
                    {currentEpisode.title}
                  </h2>
                )}

                {/* Episode Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    disabled={!hasPrevious}
                    onClick={() => hasPrevious && navigateToEpisode(episodeNumber - 1)}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <Link to={`/anime/${animeId}`}>
                    <Button variant="secondary">All Episodes</Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    disabled={!hasNext}
                    onClick={() => hasNext && navigateToEpisode(episodeNumber + 1)}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Related Episodes */}
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-4">Episodes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {relatedEpisodes.map(ep => (
                      <button
                        key={ep.mal_id}
                        onClick={() => navigateToEpisode(ep.episode)}
                        className={`p-3 rounded-lg text-center transition ${
                          ep.episode === episodeNumber
                            ? "bg-kuro-600 text-white"
                            : "bg-card hover:bg-secondary"
                        }`}
                      >
                        <div className="font-semibold">Ep {ep.episode}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Using a simplified footer for watch page */}
      <footer className="bg-card py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 KuroAnime. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default WatchPage;
