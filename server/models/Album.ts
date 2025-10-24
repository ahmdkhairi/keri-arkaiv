import mongoose, { Schema, Document } from 'mongoose';
import { Album as AlbumType, Track } from '@shared/schema';

export interface AlbumDocument extends Omit<AlbumType, '_id'>, Document {}

const TrackSchema = new Schema<Track>({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  file: { type: String, required: true },
}, { _id: false });

const AlbumSchema = new Schema<AlbumDocument>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  label: { type: String, required: true },
  about: { type: String, required: true },
  cover: { type: String, required: true },
  tracks: { type: [TrackSchema], required: true },
}, {
  timestamps: false,
});

export const Album = mongoose.model<AlbumDocument>('Album', AlbumSchema);
