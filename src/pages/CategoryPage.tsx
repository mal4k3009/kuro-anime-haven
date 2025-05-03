
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { fetchTopAnime, Anime } from "@/services/animeApi";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";
import { ChevronRight } from "lucide-react";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Category";

  useEffect(() => {
    const fetchAnimeByCategory = async () => {
      setIsLoading(true);
      try {
        // In a real app, we'd have a proper genre/category API
        // For now, we'll use top anime as a placeholder
        const response = await fetchTopAnime();
        
        // Filter anime by genre (if available)
        const filteredAnime = response.data.filter(anime => 
          anime.genres.some(genre => 
            genre.name.toLowerCase() === category?.toLowerCase()
          )
        );
        
        setAnimeList(filteredAnime.length > 0 ? filteredAnime : response.data);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load anime data. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchAnimeByCategory();
  }, [category, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-kuro-400 transition">Home</Link>
              <ChevronRight className="h-3 w-3 mx-1" />
              <Link to="/anime" className="hover:text-kuro-400 transition">Anime</Link>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span>{categoryName}</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">{categoryName} Anime</h1>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <div 
                  key={index} 
                  className="w-full h-[350px] bg-muted rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <>
              {animeList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {animeList.map(anime => (
                    <div key={anime.mal_id}>
                      <AnimeCard anime={anime} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No anime found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
