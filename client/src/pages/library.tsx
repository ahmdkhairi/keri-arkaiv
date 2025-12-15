import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Album } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Search, Moon, Sun, AlertCircle, Settings, List, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { Link } from "wouter";
import AlbumCard from "@/components/album-card";
import AlbumDetailModal from "@/components/album-detail-modal";
import AudioPlayer from "@/components/audio-player";
import AlbumSkeleton from "@/components/album-skeleton";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("year-desc");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentTrack, setCurrentTrack] = useState<{ albumId: string; trackIndex: number } | null>(null);
  const { theme, toggleTheme } = useTheme();

  const { data: albums = [], isLoading, isError, error } = useQuery<Album[]>({
    queryKey: ["/api/albums"],
  });

  // Filtering and sorting logic
  let filteredAlbums = albums.filter((album) => {
    const query = searchQuery.toLowerCase();
    const titleStr = album.title?.toLowerCase() || "";
    const artistStr = Array.isArray(album.artist)
      ? album.artist.join(" ").toLowerCase()
      : (album.artist?.toLowerCase?.() || "");
    const genreStr = Array.isArray(album.genre)
      ? album.genre.join(" ").toLowerCase()
      : (album.genre?.toLowerCase?.() || "");
    const originStr = album.origin?.toLowerCase() || "";

    const matchesSearch =
      titleStr.includes(query) ||
      artistStr.includes(query) ||
      genreStr.includes(query);

    const [type, value] = filterValue?.split(":") || [];

    const matchesFilter =
      filterValue === "all"
        ? true
        : type === "origin"
        ? album.country_origin?.toLowerCase().includes(value.toLowerCase())
        : type === "genre"
        ? (Array.isArray(album.genre)
            ? album.genre.join(" ").toLowerCase()
            : album.genre?.toLowerCase() || ""
          ).includes(value.toLowerCase())
        : type === "format"
        ? album.format?.toLowerCase() === value.toLowerCase()
        : type === "release"
        ? album.release?.toLowerCase() === value.toLowerCase()
        : true;
        return matchesSearch && matchesFilter;
      });
  // Apply sorting
  if (sortOrder === "year-asc") filteredAlbums.sort((a, b) => (a.year || 0) - (b.year || 0));
  else if (sortOrder === "year-desc") filteredAlbums.sort((a, b) => (b.year || 0) - (a.year || 0));
  else if (sortOrder === "alpha-asc") filteredAlbums.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortOrder === "alpha-desc") filteredAlbums.sort((a, b) => b.title.localeCompare(a.title));

  const handlePlayTrack = (albumId: string, trackIndex: number) => {
    setCurrentTrack({ albumId, trackIndex });
  };

  const currentAlbum = currentTrack ? albums.find(a => a._id === currentTrack.albumId) : null;
  const currentTrackData = currentAlbum?.tracks[currentTrack?.trackIndex ?? 0];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              keri-arkaiv
            </h1>
            <div className="flex items-center gap-2">
              {/* <Link href="/playlists">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  data-testid="button-playlists"
                >
                  <List className="w-5 h-5" />
                </Button>
              </Link> */}
              {/* <Link href="/admin">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  data-testid="button-admin"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </Link> */}
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleTheme}
                className="rounded-full"
                data-testid="button-theme-toggle"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Filtering & Sorting Toolbar */}
          <div className="flex items-center justify-between w-full">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-14 pr-4 text-base rounded-2xl border-2 focus-visible:ring-4 focus-visible:ring-offset-2 transition-all"
                data-testid="input-search"
              />
            </div>
<Select onValueChange={setFilterValue} value={filterValue}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Filter by..." />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="all">All</SelectItem>

    {/* ORIGIN */}
    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
      Origin
    </div>
    <SelectItem value="origin:Malaysia">Malaysia</SelectItem>
    <SelectItem value="origin:United States">United States</SelectItem>
    <SelectItem value="origin:Indonesia">Indonesia</SelectItem>
    <SelectItem value="origin:Korea">Korea</SelectItem>
    <SelectItem value="origin:Japan">Japan</SelectItem>
    <SelectItem value="origin:Canada">Canada</SelectItem>
    <SelectItem value="origin:China">China</SelectItem>

    {/* FORMAT */}
    <div className="px-2 py-1 mt-2 text-xs font-semibold text-muted-foreground">
      Format
    </div>
    <SelectItem value="format:CD">CD</SelectItem>
    <SelectItem value="format:Cassette">Cassette</SelectItem>

    {/* RELEASE TYPE */}
    <div className="px-2 py-1 mt-2 text-xs font-semibold text-muted-foreground">
      Release
    </div>
    <SelectItem value="release:Album">Album</SelectItem>
    <SelectItem value="release:EP">EP</SelectItem>
    <SelectItem value="release:Compilation">Compilation</SelectItem>

    {/* GENRE */}
    <div className="px-2 py-1 mt-2 text-xs font-semibold text-muted-foreground">
      Genre
    </div>
    <SelectItem value="genre:Pop">Pop</SelectItem>
    <SelectItem value="genre:Rock">Rock</SelectItem>
    <SelectItem value="genre:Hip Hop">Hip Hop</SelectItem>
    <SelectItem value="genre:Indie">Indie</SelectItem>
    <SelectItem value="genre:Folk">Folk</SelectItem>
    <SelectItem value="genre:Country">Country</SelectItem>
    <SelectItem value="genre:Electronic">Electronic</SelectItem>
    <SelectItem value="genre:Punk">Punk</SelectItem>
    <SelectItem value="genre:Grunge">Grunge</SelectItem>
    <SelectItem value="genre:Shoegaze">Shoegaze</SelectItem>
  </SelectContent>
</Select>
            <Select onValueChange={(value) => setSortOrder(value)} value={sortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year-asc">Year ↑</SelectItem>
                <SelectItem value="year-desc">Year ↓</SelectItem>
                <SelectItem value="alpha-asc">A–Z</SelectItem>
                <SelectItem value="alpha-desc">Z–A</SelectItem>
              </SelectContent>
            </Select>
          </div>
            <p className="ml-auto text-sm text-muted-foreground border-2 border-border rounded-md px-3 p-2">
              Count: {albums.length}
            </p>
          </div>
        </div>
      </header>

      {/* Album Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {[...Array(10)].map((_, i) => (
              <AlbumSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Unable to Load Albums</h2>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Failed to connect to the server"}
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your MongoDB connection and try refreshing the page.
            </p>
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              {searchQuery ? "No albums found matching your search" : "No albums in your library yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {filteredAlbums.map((album) => (
              <AlbumCard
                key={album._id}
                album={album}
                onClick={() => setSelectedAlbum(album)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Album Detail Modal */}
      {selectedAlbum && (
        <AlbumDetailModal
          album={selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
          onPlayTrack={handlePlayTrack}
        />
      )}

      {/* Audio Player */}
      {currentTrack && currentAlbum && currentTrackData && (
        <AudioPlayer
          album={currentAlbum}
          trackIndex={currentTrack.trackIndex}
          onTrackChange={(newIndex) => setCurrentTrack({ ...currentTrack, trackIndex: newIndex })}
        />
      )}
    </div>
  );
}
