
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";
import { fetchSeasonalAnime, Anime } from "@/services/animeApi";
import { Button } from "@/components/ui/button";

const SeasonalAnimePage = () => {
  const [seasonalAnime, setSeasonalAnime] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);
      try {
        const response = await fetchSeasonalAnime(currentPage);
        setSeasonalAnime(response.data);
        setTotalPages(response.pagination.last_visible_page);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load seasonal anime. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, [currentPage, toast]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get current season and year
  const getCurrentSeason = () => {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    if (month >= 0 && month < 3) return { season: "Winter", year };
    if (month >= 3 && month < 6) return { season: "Spring", year };
    if (month >= 6 && month < 9) return { season: "Summer", year };
    return { season: "Fall", year };
  };
  
  const { season, year } = getCurrentSeason();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {season} {year} Anime
            </h1>
            <p className="text-muted-foreground">
              Discover the latest anime of the current season.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(15)].map((_, index) => (
                <div key={index} className="aspect-[3/4] bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : seasonalAnime.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {seasonalAnime.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1 px-2">
                    {currentPage > 2 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </Button>
                        {currentPage > 3 && <span className="text-muted-foreground">...</span>}
                      </>
                    )}
                    
                    {currentPage > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        {currentPage - 1}
                      </Button>
                    )}
                    
                    <Button variant="default" size="sm">
                      {currentPage}
                    </Button>
                    
                    {currentPage < totalPages && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        {currentPage + 1}
                      </Button>
                    )}
                    
                    {currentPage < totalPages - 1 && (
                      <>
                        {currentPage < totalPages - 2 && <span className="text-muted-foreground">...</span>}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No seasonal anime found at this time.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SeasonalAnimePage;
