
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import HeroCarousel from "@/components/HeroCarousel";
import AnimeSection from "@/components/AnimeSection";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { fetchTopAnime, fetchSeasonalAnime, Anime } from "@/services/animeApi";

const HomePage = () => {
  const [featuredAnime, setFeaturedAnime] = useState<Anime[]>([]);
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState({
    featured: true,
    top: true,
    seasonal: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch top anime
        const topResponse = await fetchTopAnime();
        setTopAnime(topResponse.data);
        
        // Use top 5 anime as featured
        setFeaturedAnime(topResponse.data.slice(0, 5));
        
        setIsLoading((prev) => ({ ...prev, featured: false, top: false }));
        
        // Fetch seasonal anime
        const seasonalResponse = await fetchSeasonalAnime();
        setSeasonalAnime(seasonalResponse.data);
        setIsLoading((prev) => ({ ...prev, seasonal: false }));
        
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load anime data. Please try again later.",
          variant: "destructive",
        });
        setIsLoading({
          featured: false,
          top: false,
          seasonal: false,
        });
      }
    };
    
    fetchData();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        <HeroCarousel 
          animeList={featuredAnime} 
          loading={isLoading.featured}
        />
        
        <AnimeSection 
          title="Top Anime" 
          anime={topAnime} 
          viewAllLink="/anime"
          loading={isLoading.top}
        />
        
        <AnimeSection 
          title="Currently Airing" 
          anime={seasonalAnime} 
          viewAllLink="/seasonal"
          loading={isLoading.seasonal}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
