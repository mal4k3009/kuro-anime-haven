
import { useState } from "react";
import { Link } from "react-router-dom";
import { Anime } from "@/services/animeApi";

interface AnimeCardProps {
  anime: Anime;
  featured?: boolean;
}

const AnimeCard = ({ anime, featured = false }: AnimeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className={`group relative overflow-hidden rounded-lg transition-transform duration-300 ${
        featured ? "block w-full h-[400px]" : "block w-full h-[350px]"
      } hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="relative w-full h-full">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse"></div>
        )}

        <div className="absolute inset-0 anime-card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {anime.score && (
          <div className="absolute top-2 right-2 bg-black/80 text-kuro-400 font-bold px-2 py-1 rounded text-sm">
            ★ {anime.score}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 text-white bg-gradient-to-t from-background to-transparent">
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-kuro-400 transition-colors">
          {anime.title}
        </h3>
        {featured && (
          <p className="text-sm text-gray-300 line-clamp-1 mt-1">
            {anime.genres?.slice(0, 3).map((g) => g.name).join(", ") || ""}
          </p>
        )}
      </div>
    </Link>
  );
};

export default AnimeCard;
