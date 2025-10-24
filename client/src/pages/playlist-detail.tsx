import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Playlist, Album, PlaylistTrack } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Trash2, Plus, Moon, Sun, AlertCircle, Music2, Search } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";

export default function PlaylistDetail() {
  const [, params] = useRoute("/playlists/:id");
  const [, setLocation] = useLocation();
  const [showAddTracks, setShowAddTracks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const playlistId = params?.id || "";

  const { data: playlist, isLoading: playlistLoading, isError: playlistError } = useQuery<Playlist>({
    queryKey: ["/api/playlists", playlistId],
    enabled: !!playlistId,
  });

  const { data: albums = [] } = useQuery<Album[]>({
    queryKey: ["/api/albums"],
  });

  const addTrackMutation = useMutation({
    mutationFn: (data: { albumId: string; trackIndex: number }) =>
      apiRequest(`/api/playlists/${playlistId}/tracks`, "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists", playlistId] });
      toast({ title: "Track added to playlist!" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add track",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeTrackMutation = useMutation({
    mutationFn: (trackIndex: number) =>
      apiRequest(`/api/playlists/${playlistId}/tracks/${trackIndex}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists", playlistId] });
      toast({ title: "Track removed from playlist!" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove track",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddTrack = (albumId: string, trackIndex: number) => {
    addTrackMutation.mutate({ albumId, trackIndex });
  };

  const handleRemoveTrack = (trackIndex: number) => {
    if (confirm("Remove this track from the playlist?")) {
      removeTrackMutation.mutate(trackIndex);
    }
  };

  const getTrackDetails = (playlistTrack: PlaylistTrack) => {
    const album = albums.find((a) => a._id === playlistTrack.albumId);
    if (!album) return null;
    const track = album.tracks[playlistTrack.trackIndex];
    if (!track) return null;
    return { album, track };
  };

  const filteredAlbums = albums.filter((album) => {
    const query = searchQuery.toLowerCase();
    return (
      album.title.toLowerCase().includes(query) ||
      album.artist.toLowerCase().includes(query) ||
      album.tracks.some((track) => track.title.toLowerCase().includes(query))
    );
  });

  if (playlistLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading playlist...</p>
      </div>
    );
  }

  if (playlistError || !playlist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Playlist Not Found</h3>
            <p className="text-muted-foreground mb-4">
              This playlist may have been deleted or doesn't exist.
            </p>
            <Link href="/playlists">
              <Button>Back to Playlists</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-4">
              <Link href="/playlists">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  data-testid="button-back-to-playlists"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-bold" data-testid="text-playlist-name">
                  {playlist.name}
                </h1>
                {playlist.description && (
                  <p className="text-sm text-muted-foreground">{playlist.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowAddTracks(true)}
                data-testid="button-add-tracks"
                className="gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Tracks
              </Button>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {playlist.tracks.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Music2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Empty Playlist</h3>
              <p className="text-muted-foreground mb-4">
                Add some tracks to get started
              </p>
              <Button onClick={() => setShowAddTracks(true)} data-testid="button-add-first-track">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Track
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-2">
            {playlist.tracks.map((playlistTrack, index) => {
              const details = getTrackDetails(playlistTrack);
              if (!details) return null;
              const { album, track } = details;

              return (
                <Card
                  key={index}
                  className="overflow-visible hover-elevate transition-all duration-200"
                  data-testid={`card-playlist-track-${index}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 text-center">
                        <span className="text-sm text-muted-foreground">{index + 1}</span>
                      </div>
                      <img
                        src={album.cover}
                        alt={album.title}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                        data-testid={`img-track-cover-${index}`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate" data-testid={`text-track-title-${index}`}>
                          {track.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {album.artist} • {album.title}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-muted-foreground">
                        {track.duration}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          data-testid={`button-play-track-${index}`}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveTrack(index)}
                          data-testid={`button-remove-track-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Dialog open={showAddTracks} onOpenChange={setShowAddTracks}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Tracks to Playlist</DialogTitle>
            <DialogDescription>
              Browse your albums and select tracks to add
            </DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search albums or tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-tracks"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {filteredAlbums.map((album) => (
              <Card key={album._id} className="overflow-visible">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{album.title}</h4>
                      <p className="text-sm text-muted-foreground">{album.artist}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {album.tracks.map((track, trackIndex) => (
                      <div
                        key={trackIndex}
                        className="flex items-center justify-between p-2 rounded hover-elevate"
                        data-testid={`row-available-track-${album._id}-${trackIndex}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-6">{trackIndex + 1}</span>
                          <span className="text-sm">{track.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{track.duration}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddTrack(album._id, trackIndex)}
                            disabled={addTrackMutation.isPending}
                            data-testid={`button-add-track-${album._id}-${trackIndex}`}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
