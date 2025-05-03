
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { getVideoSources } from "@/services/animeApi";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoPlayerProps {
  animeId: number;
  episodeNumber: number;
  title: string;
}

const VideoPlayer = ({ animeId, episodeNumber, title }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sources, setSources] = useState<Array<{ quality: string; url: string }>>([]);
  const [currentQuality, setCurrentQuality] = useState("720p");
  const [isLoadingQuality, setIsLoadingQuality] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const sources = getVideoSources(animeId, episodeNumber);
    setSources(sources);
    
    const initialSource = sources.find(s => s.quality === "720p") || sources[0];
    if (initialSource) {
      setCurrentQuality(initialSource.quality);
    }

    // Cleanup timeout on unmount
    return () => {
      if (controlsTimeoutRef.current !== null) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [animeId, episodeNumber]);

  useEffect(() => {
    const video = videoRef.current;
    
    const onTimeUpdate = () => {
      if (video) {
        setCurrentTime(video.currentTime);
      }
    };
    
    const onLoadedMetadata = () => {
      if (video) {
        setDuration(video.duration);
      }
    };
    
    const onEnded = () => {
      setIsPlaying(false);
    };
    
    if (video) {
      video.addEventListener("timeupdate", onTimeUpdate);
      video.addEventListener("loadedmetadata", onLoadedMetadata);
      video.addEventListener("ended", onEnded);
    }
    
    return () => {
      if (video) {
        video.removeEventListener("timeupdate", onTimeUpdate);
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.removeEventListener("ended", onEnded);
      }
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    if (newMuteState) {
      video.volume = 0;
    } else {
      video.volume = volume > 0 ? volume : 1;
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleQualityChange = (quality: string) => {
    setIsLoadingQuality(true);
    setCurrentQuality(quality);
    
    const newSource = sources.find(s => s.quality === quality);
    if (newSource && videoRef.current) {
      const wasPlaying = !videoRef.current.paused;
      const currentTime = videoRef.current.currentTime;
      
      videoRef.current.src = newSource.url;
      videoRef.current.load();
      videoRef.current.currentTime = currentTime;
      
      if (wasPlaying) {
        videoRef.current.play().then(() => {
          setIsLoadingQuality(false);
        }).catch(() => {
          setIsLoadingQuality(false);
        });
      } else {
        setIsLoadingQuality(false);
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    // Reset the timeout
    if (controlsTimeoutRef.current !== null) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    
    // Set a new timeout
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <div 
      className="relative w-full bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full aspect-video"
        poster={`https://via.placeholder.com/1280x720/121526/6C63FF?text=Episode+${episodeNumber}`}
        onClick={handlePlayPause}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        {sources.map((source) => (
          <source 
            key={source.quality} 
            src={currentQuality === source.quality ? source.url : undefined} 
            type="video/mp4" 
          />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Loading Indicator */}
      {isLoadingQuality && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="w-12 h-12 border-4 border-kuro-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Video Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.01}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePlayPause}
              className="text-white hover:text-kuro-400 hover:bg-black/20"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMute} 
              className="text-white hover:text-kuro-400 hover:bg-black/20"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            
            <div className="w-24 hidden sm:block">
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
              />
            </div>
            
            <div className="text-xs text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={currentQuality} onValueChange={handleQualityChange}>
              <SelectTrigger className="w-[80px] h-8 text-xs bg-black/50 border-none">
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-sm">
                {sources.map((source) => (
                  <SelectItem key={source.quality} value={source.quality}>
                    {source.quality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Title Overlay (shown briefly on load) */}
      <div className="absolute top-4 left-4 right-4 opacity-0 animate-fade-in">
        <h2 className="text-white font-medium text-lg line-clamp-1 bg-black/50 px-3 py-2 rounded-md inline-block">
          {title} - Episode {episodeNumber}
        </h2>
      </div>
    </div>
  );
};

export default VideoPlayer;
