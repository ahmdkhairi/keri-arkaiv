import { z } from "zod";

// Track schema 

export const trackSchema = z.object({
  _id: z.string().optional(),           
  album_id: z.string().optional(),               
  track_no: z.number().optional(),
  title: z.string(),
  duration: z.string().nullable(),     
  file: z.string().optional(),
  artists: z.array(z.string()).optional(),
  disc_no: z.number().optional(),        
  audio_url: z.string().nullable().optional(),      
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Track = z.infer<typeof trackSchema>;

// Album schema 
export const albumSchema = z.object({
  _id: z.string(),
  title: z.string(),
  artist: z.array(z.string()),
  year: z.number(),
  genre: z.array(z.string()),
  label: z.string(),
  about: z.string(),
  barcode: z.string(),
  country_origin: z.string(),
  format: z.string(),
  release: z.string(),
  cover: z.string(),
  duration: z.string(),
  tracks: z.array(trackSchema).default([]),
});

export const insertAlbumSchema = albumSchema.omit({ _id: true }).extend({
  artist: z.union([z.array(z.string()), z.string()]),
  genre: z.union([z.array(z.string()), z.string()]),
  tracks: z.array(trackSchema.extend({
    duration: z.string(),
  })).default([]),
});

export type Album = z.infer<typeof albumSchema>;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;

export type User = {
  id: string;
  username: string;
  password: string;
};

export type InsertUser = Omit<User, "id">;

// Helper functions for track calculations
export function getTotalDuration(tracks: Track[]): string {
  const totalSeconds = tracks.reduce((acc, track) => {
    if (!track.duration) return acc;

    const [minutes = 0, seconds = 0] = track.duration.split(":").map(Number);
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
