
import { useState } from "react";
import { Link } from "react-router-dom";
import { Episode } from "@/services/animeApi";
import { Button } from "@/components/ui/button";

interface EpisodeListProps {
  animeId: number;
  episodes: Episode[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const EpisodeList = ({
  animeId,
  episodes,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}: EpisodeListProps) => {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4">Episodes</h3>
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className="w-full h-16 bg-muted rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : episodes.length > 0 ? (
        <>
          <div className="space-y-2 mb-6">
            {episodes.map((episode) => (
              <Link
                key={episode.mal_id}
                to={`/watch/${animeId}/${episode.episode}`}
                className="flex items-center p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center font-bold text-lg">
                  {episode.episode}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium line-clamp-1">{episode.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(episode.aired).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <span className="flex items-center px-3 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No episodes found for this anime.
        </div>
      )}
    </div>
  );
};

export default EpisodeList;
