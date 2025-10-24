import { useEffect, useRef, useState } from "react";
import { Album } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  album: Album;
  trackIndex: number;
  onTrackChange: (newIndex: number) => void;
}

export default function AudioPlayer({ album, trackIndex, onTrackChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const track = album.tracks[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (trackIndex < album.tracks.length - 1) {
        onTrackChange(trackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [trackIndex, album.tracks.length, onTrackChange]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, trackIndex]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    if (trackIndex > 0) {
      onTrackChange(trackIndex - 1);
    }
  };

  const handleSkipForward = () => {
    if (trackIndex < album.tracks.length - 1) {
      onTrackChange(trackIndex + 1);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-card/95 backdrop-blur-xl border-t border-border" data-testid="audio-player">
      <audio
        ref={audioRef}
        src={`/api/tracks/${album._id}/${trackIndex}/stream`}
        preload="metadata"
      />

      <div className="h-full px-4 md:px-8 py-4">
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 md:gap-8 h-full items-center">
          {/* Left Section - Now Playing */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-foreground" data-testid="text-current-track">
                {track.title}
              </p>
              <p className="text-xs text-muted-foreground truncate" data-testid="text-current-artist">
                {album.artist}
              </p>
            </div>
          </div>

          {/* Center Section - Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-4">
              <Button
                size="icon"
                variant="ghost"
                className="w-10 h-10 rounded-full"
                onClick={handleSkipBack}
                disabled={trackIndex === 0}
                data-testid="button-skip-back"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                size="icon"
                className="w-12 h-12 rounded-full"
                onClick={togglePlayPause}
                data-testid="button-play-pause"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="w-10 h-10 rounded-full"
                onClick={handleSkipForward}
                disabled={trackIndex === album.tracks.length - 1}
                data-testid="button-skip-forward"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-10 text-right" data-testid="text-current-time">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleProgressChange}
                className="flex-1"
                data-testid="slider-progress"
              />
              <span className="text-xs text-muted-foreground w-10" data-testid="text-duration">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right Section - Volume */}
          <div className="hidden md:flex items-center justify-end gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-full"
              onClick={toggleMute}
              data-testid="button-volume-toggle"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
              data-testid="slider-volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
