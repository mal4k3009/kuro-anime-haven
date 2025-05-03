
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Anime } from "@/services/animeApi";

interface HeroSectionProps {
  anime: Anime | null;
}

const HeroSection = ({ anime }: HeroSectionProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  if (!anime) {
    return (
      <div className="w-full h-[70vh] bg-muted animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading featured anime...</p>
      </div>
    );
  }

  const handleWatchNow = () => {
    navigate(`/watch/${anime.mal_id}/1`);
  };

  const handleMoreInfo = () => {
    navigate(`/anime/${anime.mal_id}`);
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
            imageLoaded ? "opacity-40" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && <div className="w-full h-full bg-muted animate-pulse"></div>}
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
  );
};

export default HeroSection;
