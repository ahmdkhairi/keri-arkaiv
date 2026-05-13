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

  useEffect(() => {
    const scrollY = window.scrollY;
    const { overflow, position, top, width } = document.body.style;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
 
  return (
    <div 
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 p-2 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="album-detail-title"
      data-testid="modal-album-detail"
    >
      <Card 
        className="relative my-2 flex max-h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col overflow-hidden sm:my-0 sm:max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-4 top-4 z-10 rounded-full"
          onClick={onClose}
          aria-label="Close album details"
          data-testid="button-close-modal"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="custom-scroll overflow-y-auto p-6 pb-10 md:p-8">
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
            <div className="flex flex-col md:max-h-[75vh] md:overflow-y-auto md:pr-4 md:custom-scroll">
            <div className="flex min-w-0 flex-col">
              <div className="mb-6 pr-12 md:pr-0">
                <h2 id="album-detail-title" className="text-4xl font-serif font-bold mb-2 text-foreground" data-testid="text-album-title">
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
                    key={track._id ?? `${track.track_no}-${track.title}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="w-6 shrink-0 text-muted-foreground">
                        {track.track_no}
                      </span>
                      <span className="min-w-0 truncate">{track.title}</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-muted-foreground tabular-nums">
                        {track.duration ?? "--:--"}
                      </span>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          onPlayTrack(album._id, index)
                        }
                        aria-label={`Play ${track.title}`}
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
