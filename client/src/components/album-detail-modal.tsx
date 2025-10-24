import { useState } from "react";
import { Album, getTotalDuration } from "@shared/schema";
import { X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AlbumDetailModalProps {
  album: Album;
  onClose: () => void;
  onPlayTrack: (albumId: string, trackIndex: number) => void;
}

export default function AlbumDetailModal({ album, onClose, onPlayTrack }: AlbumDetailModalProps) {
  const [showFullAbout, setShowFullAbout] = useState(false);
  const aboutPreview = album.about.length > 200 ? album.about.slice(0, 200) + "..." : album.about;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
      data-testid="modal-album-detail"
    >
      <Card 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 z-10 rounded-full"
          onClick={onClose}
          data-testid="button-close-modal"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="p-6 md:p-8">
          {/* Two Column Layout on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-8">
            {/* Left Column - Album Cover */}
            <div>
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-muted">
                <img
                  src={album.cover}
                  alt={`${album.title} cover`}
                  className="w-full h-full object-cover"
                  data-testid="img-album-cover"
                />
              </div>
              
              {/* Album Metadata */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span data-testid="text-year">{album.year}</span>
                  <span>•</span>
                  <span data-testid="text-genre">{album.genre}</span>
                </div>
                <p className="text-sm text-muted-foreground" data-testid="text-label">
                  {album.label}
                </p>
              </div>
            </div>

            {/* Right Column - Album Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <h2 className="text-4xl font-serif font-bold mb-2 text-foreground" data-testid="text-album-title">
                  {album.title}
                </h2>
                <p className="text-2xl text-muted-foreground" data-testid="text-artist">
                  {album.artist}
                </p>
              </div>

              {/* About Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-foreground">About</h3>
                <p className="text-base leading-relaxed text-foreground/90" data-testid="text-about">
                  {showFullAbout || album.about.length <= 200 ? album.about : aboutPreview}
                </p>
                {album.about.length > 200 && (
                  <button
                    onClick={() => setShowFullAbout(!showFullAbout)}
                    className="mt-2 text-sm text-primary hover:underline"
                    data-testid="button-toggle-about"
                  >
                    {showFullAbout ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              {/* Track Listing */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Tracks</h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-track-info">
                    {album.tracks.length} tracks • {getTotalDuration(album.tracks)}
                  </p>
                </div>

                <div className="space-y-1">
                  {album.tracks.map((track, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover-elevate active-elevate-2 group cursor-pointer"
                      onClick={() => onPlayTrack(album._id, index)}
                      data-testid={`track-${index}`}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-10 h-10 rounded-full flex-shrink-0"
                          data-testid={`button-play-track-${index}`}
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </Button>
                        <span className="text-sm text-muted-foreground w-8 flex-shrink-0">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-base text-foreground truncate flex-1" data-testid={`text-track-title-${index}`}>
                          {track.title}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground flex-shrink-0" data-testid={`text-track-duration-${index}`}>
                        {track.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
