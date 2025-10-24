import { z } from "zod";

// Track schema - individual songs on an album
export const trackSchema = z.object({
  title: z.string(),
  duration: z.string(), // Format: "3:45"
  file: z.string(), // URL or path to audio file
});

export type Track = z.infer<typeof trackSchema>;

// Album schema - complete album information
export const albumSchema = z.object({
  _id: z.string(),
  title: z.string(),
  artist: z.string(),
  year: z.number(),
  genre: z.string(),
  label: z.string(),
  about: z.string(),
  cover: z.string(), // URL to cover image
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
