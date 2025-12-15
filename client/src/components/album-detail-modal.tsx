import { useEffect, useState } from "react";
import { Album, Track } from "@shared/schema";
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
 const [tracks, setTracks] = useState<Track[]>([]);
const [loadingTracks, setLoadingTracks] = useState(false);

useEffect(() => {
  if (!album._id) return;

  setLoadingTracks(true);

  fetch(`/api/albums/${album._id}/tracks`)
    .then((res) => res.json())
    .then((data) => setTracks(data))
    .finally(() => setLoadingTracks(false));
}, [album._id]);
 
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
      data-testid="modal-album-detail"
    >
      <Card 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden"
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
          <X className="ml-8 w-10 h-10" />
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
                  <span data-testid="text-genre">
                    {Array.isArray(album.genre) ? album.genre.join(", ") : album.genre}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground" data-testid="text-label">
                  {album.label}
                </p>
              </div>
            </div>

            {/* Right Column - Album Info */}
            <div className="flex flex-col max-h-[75vh] overflow-y-auto pr-4 custom-scroll">
            <div className="flex flex-col">
              <div className="mb-6">
                <h2 className="text-4xl font-serif font-bold mb-2 text-foreground" data-testid="text-album-title">
                  {album.title}
                </h2>
                <p className="text-2xl text-muted-foreground" data-testid="text-artist">
                  {Array.isArray(album.artist) ? album.artist.join(", ") : album.artist}
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

              {/* Album Details */}
              <div className="space-y-2 mb-8">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Details</h3>
                <p className="text-sm text-muted-foreground" data-testid="text-duration">
                  <strong>Duration:</strong> {album.duration || "Not Available"}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-release">
                  <strong>Release:</strong> {album.release || "Not Available"}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-format">
                  <strong>Format:</strong> {album.format || "Not Available"}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-barcode">
                  <strong>Barcode:</strong> {album.barcode === "-1" || !album.barcode ? "Not Available" : album.barcode}
                </p>
                <p className="text-sm text-muted-foreground" data-testid="text-origin">
                  <strong>Origin:</strong> {album.country_origin || "Not Available"}
                </p>
              </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Tracklist
              </h3>

              {loadingTracks && (
                <p className="text-sm text-muted-foreground">Loading tracks…</p>
              )}

              {!loadingTracks && tracks.length === 0 && (
                <p className="text-sm text-muted-foreground">No tracks available</p>
              )}

              <ul className="space-y-2">
                {tracks.map((track, index) => (
                  <li
                    key={track._id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-muted-foreground">
                        {track.track_no}
                      </span>
                      <span>{track.title}</span>
                    </div>

                    <div className="flex items-center px-5">
                      <span className="text-muted-foreground">
                        {track.duration ?? "--:--"}
                      </span>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          onPlayTrack(album._id, index)
                        }
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
