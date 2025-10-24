import mongoose, { Schema, Document } from 'mongoose';
import { Playlist as PlaylistType, PlaylistTrack } from '@shared/schema';

export interface PlaylistDocument extends Omit<PlaylistType, '_id' | 'createdAt'>, Document {
  createdAt: Date;
}

const PlaylistTrackSchema = new Schema<PlaylistTrack>({
  albumId: { type: String, required: true },
  trackIndex: { type: Number, required: true },
}, { _id: false });

const PlaylistSchema = new Schema<PlaylistDocument>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  tracks: { type: [PlaylistTrackSchema], default: [] },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export const Playlist = mongoose.model<PlaylistDocument>('Playlist', PlaylistSchema);
