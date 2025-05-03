
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import AnimeCard from "./AnimeCard";
import { Anime } from "@/services/animeApi";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnimeSectionProps {
  title: string;
  anime: Anime[];
  viewAllLink?: string;
  loading?: boolean;
}

const AnimeSection = ({ 
  title, 
  anime, 
  viewAllLink, 
  loading = false 
}: AnimeSectionProps) => {
  return (
    <section className="py-8">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {viewAllLink && (
            <Link 
              to={viewAllLink} 
              className="flex items-center text-kuro-400 hover:text-kuro-300 transition-colors"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index} 
                className="w-full h-[350px] bg-muted rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex space-x-4">
              {anime.map((item) => (
                <div key={item.mal_id} className="w-[250px] max-w-[90vw] flex-shrink-0">
                  <AnimeCard anime={item} />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </section>
  );
};

export default AnimeSection;
