
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Anime } from "@/services/animeApi";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroCarouselProps {
  animeList: Anime[];
  loading?: boolean;
}

const HeroCarousel = ({ animeList, loading = false }: HeroCarouselProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const currentAnime = animeList[currentIndex];

  useEffect(() => {
    if (!animeList.length || !autoplay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % animeList.length);
      setImageLoaded(false);
    }, 7000);
    
    return () => clearInterval(timer);
  }, [animeList.length, autoplay]);

  const handleWatchNow = () => {
    if (currentAnime) {
      navigate(`/watch/${currentAnime.mal_id}/1`);
    }
  };

  const handleMoreInfo = () => {
    if (currentAnime) {
      navigate(`/anime/${currentAnime.mal_id}`);
    }
  };

  if (loading || !animeList.length) {
    return (
      <div className="w-full h-[70vh] bg-muted animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading featured anime...</p>
      </div>
    );
  }

  return (
    <Carousel
      className="relative w-full h-[70vh] overflow-hidden"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <CarouselContent>
        {animeList.map((anime, index) => (
          <CarouselItem key={anime.mal_id}>
            <div className="relative w-full h-[70vh] overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover object-center opacity-40"
                  onLoad={() => index === currentIndex && setImageLoaded(true)}
                />
                <div className="absolute inset-0 hero-gradient"></div>
              </div>

              {/* Content */}
              <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-20">
                <div className="max-w-2xl animate-fade-in">
                  <h1 className="text-4xl md:text-6xl font-bold mb-3 text-white">
                    {anime.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {anime.genres.slice(0, 4).map((genre) => (
                      <span 
                        key={genre.mal_id}
                        className="px-2 py-1 bg-kuro-700/50 text-white/90 text-xs rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-gray-300 mb-6 line-clamp-3">
                    {anime.synopsis}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      onClick={handleWatchNow}
                      className="bg-kuro-600 hover:bg-kuro-700 text-white flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Watch Now
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handleMoreInfo}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      More Info
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {!isMobile && (
        <>
          <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10" />
        </>
      )}
    </Carousel>
  );
};

export default HeroCarousel;
