import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Playlist, Album } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPlaylistSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Music2, Moon, Sun, ArrowLeft, AlertCircle, List } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";

export default function Playlists() {
  const [, setLocation] = useLocation();
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const { data: playlists = [], isLoading, isError } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
  });

  const form = useForm<{ name: string; description: string; tracks: any[] }>({
    resolver: zodResolver(insertPlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
      tracks: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/playlists", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({ title: "Playlist created successfully!" });
      setShowForm(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create playlist",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(`/api/playlists/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({ title: "Playlist updated successfully!" });
      setShowForm(false);
      setEditingPlaylist(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update playlist",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/playlists/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      toast({ title: "Playlist deleted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete playlist",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    form.reset({
      name: playlist.name,
      description: playlist.description || "",
      tracks: playlist.tracks,
    });
    setShowForm(true);
  };

  const handleDelete = (playlist: Playlist) => {
    if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      deleteMutation.mutate(playlist._id);
    }
  };

  const handleAddNew = () => {
    setEditingPlaylist(null);
    form.reset({
      name: "",
      description: "",
      tracks: [],
    });
    setShowForm(true);
  };

  const onSubmit = (data: any) => {
    if (editingPlaylist) {
      updateMutation.mutate({ id: editingPlaylist._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-4">
              <Link href="/library">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  data-testid="button-back-to-library"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold">Playlists</h1>
            </div>
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
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Your Playlists</h2>
            <p className="text-muted-foreground mt-1">
              Organize your favorite tracks into custom playlists
            </p>
          </div>
          <Button onClick={handleAddNew} data-testid="button-create-playlist" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Playlist
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading playlists...</p>
          </div>
        ) : isError ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unable to Load Playlists</h3>
              <p className="text-muted-foreground mb-4">
                Failed to connect to the database. Please check your MongoDB connection.
              </p>
            </div>
          </Card>
        ) : playlists.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <List className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first playlist to organize your music
              </p>
              <Button onClick={handleAddNew} data-testid="button-create-first-playlist">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Playlist
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <Card
                key={playlist._id}
                className="group cursor-pointer overflow-visible hover-elevate active-elevate-2 transition-all duration-300"
                onClick={() => setLocation(`/playlists/${playlist._id}`)}
                data-testid={`card-playlist-${playlist._id}`}
              >
                <CardContent className="p-6">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-md mb-4 flex items-center justify-center">
                    <Music2 className="w-16 h-16 text-primary/40" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 truncate" data-testid={`text-playlist-name-${playlist._id}`}>
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {playlist.tracks.length} {playlist.tracks.length === 1 ? "track" : "tracks"}
                  </p>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
                  )}
                  <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(playlist)}
                      data-testid={`button-edit-playlist-${playlist._id}`}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(playlist)}
                      data-testid={`button-delete-playlist-${playlist._id}`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle data-testid="text-playlist-form-title">
              {editingPlaylist ? "Edit Playlist" : "Create Playlist"}
            </DialogTitle>
            <DialogDescription>
              {editingPlaylist ? "Update your playlist details" : "Create a new playlist to organize your music"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Playlist Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="My Awesome Playlist" data-testid="input-playlist-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="A collection of my favorite tracks..."
                        rows={3}
                        data-testid="input-playlist-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPlaylist(null);
                    form.reset();
                  }}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-playlist"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingPlaylist
                    ? "Update Playlist"
                    : "Create Playlist"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
