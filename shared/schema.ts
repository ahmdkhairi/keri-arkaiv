import { z } from "zod";

// Track schema 
export const trackSchema = z.object({
  title: z.string(),
  duration: z.string(), 
  file: z.string(), // URL or path to audio file
});

export type Track = z.infer<typeof trackSchema>;

// Album schema 
export const albumSchema = z.object({
  _id: z.string(),
  title: z.string(),
  artist: z.string(),
  year: z.number(),
  genre: z.string(),
  label: z.string(),
  about: z.string(),
  origin: z.string(),
  format: z.string(),
  release: z.string(),
  cover: z.string(),
  tracks: z.array(trackSchema),
});

export const insertAlbumSchema = albumSchema.omit({ _id: true });

export type Album = z.infer<typeof albumSchema>;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;

// Helper functions for track calculations
export function getTotalDuration(tracks: Track[]): string {
  const totalSeconds = tracks.reduce((acc, track) => {
    const [minutes, seconds] = track.duration.split(':').map(Number);
    return acc + minutes * 60 + seconds;
  }, 0);
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatDuration(duration: string): string {
  return duration;
}

// Playlist track reference 
export const playlistTrackSchema = z.object({
  albumId: z.string(),
  trackIndex: z.number(),
});

export type PlaylistTrack = z.infer<typeof playlistTrackSchema>;

// Playlist schema
export const playlistSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tracks: z.array(playlistTrackSchema),
  createdAt: z.date(),
});

export const insertPlaylistSchema = playlistSchema.omit({ _id: true, createdAt: true });

export type Playlist = z.infer<typeof playlistSchema>;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
