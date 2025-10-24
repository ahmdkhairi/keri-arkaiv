import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Album, InsertAlbum, Track } from "@shared/schema";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAlbumSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, X, Music, Moon, Sun, ArrowLeft, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";

export default function Admin() {
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const { data: albums = [], isLoading, isError } = useQuery<Album[]>({
    queryKey: ["/api/albums"],
  });

  const form = useForm<InsertAlbum>({
    resolver: zodResolver(insertAlbumSchema),
    defaultValues: {
      title: "",
      artist: "",
      year: new Date().getFullYear(),
      genre: "",
      label: "",
      about: "",
      cover: "",
      tracks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tracks",
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertAlbum) => apiRequest("/api/albums", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/albums"] });
      toast({ title: "Album created successfully!" });
      setShowForm(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create album", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertAlbum }) => 
      apiRequest(`/api/albums/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/albums"] });
      toast({ title: "Album updated successfully!" });
      setShowForm(false);
      setEditingAlbum(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update album", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/albums/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/albums"] });
      toast({ title: "Album deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete album", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    form.reset({
      title: album.title,
      artist: album.artist,
      year: album.year,
      genre: album.genre,
      label: album.label,
      about: album.about,
      cover: album.cover,
      tracks: album.tracks,
    });
    setShowForm(true);
  };

  const handleDelete = (album: Album) => {
    if (confirm(`Are you sure you want to delete "${album.title}"?`)) {
      deleteMutation.mutate(album._id);
    }
  };

  const handleAddNew = () => {
    setEditingAlbum(null);
    form.reset({
      title: "",
      artist: "",
      year: new Date().getFullYear(),
      genre: "",
      label: "",
      about: "",
      cover: "",
      tracks: [],
    });
    setShowForm(true);
  };

  const onSubmit = (data: InsertAlbum) => {
    if (editingAlbum) {
      updateMutation.mutate({ id: editingAlbum._id, data });
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
              <h1 className="text-xl md:text-2xl font-bold">
                Admin Panel
              </h1>
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
            <h2 className="text-2xl font-semibold">Album Management</h2>
            <p className="text-muted-foreground mt-1">Create, edit, and delete albums in your collection</p>
          </div>
          <Button
            onClick={handleAddNew}
            data-testid="button-add-album"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Album
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading albums...</p>
          </div>
        ) : isError ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unable to Load Albums</h3>
              <p className="text-muted-foreground mb-4">
                Failed to connect to the database. Please check your MongoDB connection.
              </p>
            </div>
          </Card>
        ) : albums.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No albums yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first album</p>
              <Button onClick={handleAddNew} data-testid="button-add-first-album">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Album
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {albums.map((album) => (
              <Card key={album._id} className="overflow-visible" data-testid={`card-admin-album-${album._id}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="w-24 h-24 rounded-md object-cover"
                      data-testid={`img-album-cover-${album._id}`}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold" data-testid={`text-album-title-${album._id}`}>
                        {album.title}
                      </h3>
                      <p className="text-muted-foreground" data-testid={`text-album-artist-${album._id}`}>
                        {album.artist}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {album.year} • {album.genre} • {album.tracks.length} tracks
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(album)}
                        data-testid={`button-edit-${album._id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(album)}
                        data-testid={`button-delete-${album._id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-form-title">
              {editingAlbum ? "Edit Album" : "Add New Album"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingAlbum ? "update" : "create"} an album
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Album Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nevermind" data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="artist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artist</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nirvana" data-testid="input-artist" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          placeholder="1991"
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          data-testid="input-year"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Grunge" data-testid="input-genre" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="DGC Records" data-testid="input-label" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/cover.jpg" data-testid="input-cover" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Album description and background..."
                        rows={4}
                        data-testid="input-about"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <FormLabel>Tracks</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ title: "", duration: "", file: "" })}
                    data-testid="button-add-track"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Track
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 overflow-visible">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-4">
                          <FormField
                            control={form.control}
                            name={`tracks.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Track {index + 1} Title</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Song title" data-testid={`input-track-title-${index}`} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`tracks.${index}.duration`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="3:45" data-testid={`input-track-duration-${index}`} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`tracks.${index}.file`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>File URL</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="https://..." data-testid={`input-track-file-${index}`} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          data-testid={`button-remove-track-${index}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAlbum(null);
                    form.reset();
                  }}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingAlbum
                    ? "Update Album"
                    : "Create Album"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
