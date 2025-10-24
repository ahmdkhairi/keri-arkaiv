import { Album } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
}

export default function AlbumCard({ album, onClick }: AlbumCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-visible hover-elevate active-elevate-2 transition-all duration-300"
      onClick={onClick}
      data-testid={`card-album-${album._id}`}
    >
      {/* Album Cover */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
        <img
          src={album.cover}
          alt={`${album.title} by ${album.artist}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Album Info */}
      <div className="p-4 space-y-1">
        <h3 className="text-xl font-semibold truncate text-foreground" data-testid={`text-album-title-${album._id}`}>
          {album.title}
        </h3>
        <p className="text-base text-muted-foreground truncate" data-testid={`text-artist-${album._id}`}>
          {album.artist}
        </p>
        <p className="text-sm text-muted-foreground/75" data-testid={`text-year-${album._id}`}>
          {album.year}
        </p>
      </div>
    </Card>
  );
}
