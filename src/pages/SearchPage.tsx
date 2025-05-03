
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";
import { searchAnime, Anime } from "@/services/animeApi";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      try {
        const response = await searchAnime(query, currentPage);
        setResults(response.data);
        setTotalPages(response.pagination.last_visible_page);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to search anime. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage, toast]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">
            {query ? (
              <>Search results for: <span className="text-kuro-400">"{query}"</span></>
            ) : (
              "Search Anime"
            )}
          </h1>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="aspect-[3/4] bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.map((anime) => (
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
              <p className="text-muted-foreground text-lg mb-2">
                {query 
                  ? `No results found for "${query}"`
                  : "Enter a search term to find anime"
                }
              </p>
              {query && (
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords or check your spelling.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
