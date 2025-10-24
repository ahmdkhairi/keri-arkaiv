import type { Express } from "express";
import { createServer, type Server } from "http";
import { Album } from "./models/Album";
import { Playlist } from "./models/Playlist";
import { insertAlbumSchema, insertPlaylistSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/albums - Get all albums
  app.get("/api/albums", async (req, res) => {
    try {
      const albums = await Album.find().select('-__v').lean();
      
      // Transform MongoDB _id to string for frontend
      const transformedAlbums = albums.map(album => ({
        ...album,
        _id: album._id.toString(),
      }));
      
      res.json(transformedAlbums);
    } catch (error) {
      console.error("Error fetching albums:", error);
      res.status(500).json({ error: "Failed to fetch albums" });
    }
  });

  // GET /api/albums/:id - Get single album with track details
  app.get("/api/albums/:id", async (req, res) => {
    try {
      const album = await Album.findById(req.params.id).select('-__v').lean();
      
      if (!album) {
        return res.status(404).json({ error: "Album not found" });
      }
      
      // Transform MongoDB _id to string
      const transformedAlbum = {
        ...album,
        _id: album._id.toString(),
      };
      
      res.json(transformedAlbum);
    } catch (error) {
      console.error("Error fetching album:", error);
      res.status(500).json({ error: "Failed to fetch album" });
    }
  });

  // GET /api/tracks/:albumId/:trackIndex/stream - Stream audio file
  // Note: This is a demo endpoint. In production, you would stream actual audio files
  // from cloud storage (S3, Google Cloud Storage, etc.)
  app.get("/api/tracks/:albumId/:trackIndex/stream", async (req, res) => {
    try {
      const { albumId, trackIndex } = req.params;
      const album = await Album.findById(albumId);
      
      if (!album) {
        return res.status(404).json({ error: "Album not found" });
      }
      
      const track = album.tracks[parseInt(trackIndex)];
      
      if (!track) {
        return res.status(404).json({ error: "Track not found" });
      }
      
      // For demo purposes, redirect to a sample audio file
      // In production, you would stream from your storage service
      // Using a creative commons licensed sample track
      res.redirect('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    } catch (error) {
      console.error("Error streaming track:", error);
      res.status(500).json({ error: "Failed to stream track" });
    }
  });

  // POST /api/albums - Create new album
  app.post("/api/albums", async (req, res) => {
    try {
      const validatedData = insertAlbumSchema.parse(req.body);
      const newAlbum = new Album(validatedData);
      await newAlbum.save();
      
      const albumObj = newAlbum.toObject();
      const transformedAlbum = {
        ...albumObj,
        _id: albumObj._id.toString(),
      };
      
      res.status(201).json(transformedAlbum);
    } catch (error: any) {
      console.error("Error creating album:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid album data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create album" });
    }
  });

  // PUT /api/albums/:id - Update album
  app.put("/api/albums/:id", async (req, res) => {
    try {
      const validatedData = insertAlbumSchema.parse(req.body);
      const updatedAlbum = await Album.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true, runValidators: true }
      );
      
      if (!updatedAlbum) {
        return res.status(404).json({ error: "Album not found" });
      }
      
      const albumObj = updatedAlbum.toObject();
      const transformedAlbum = {
        ...albumObj,
        _id: albumObj._id.toString(),
      };
      
      res.json(transformedAlbum);
    } catch (error: any) {
      console.error("Error updating album:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid album data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update album" });
    }
  });

  // DELETE /api/albums/:id - Delete album
  app.delete("/api/albums/:id", async (req, res) => {
    try {
      const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
      
      if (!deletedAlbum) {
        return res.status(404).json({ error: "Album not found" });
      }
      
      res.json({ message: "Album deleted successfully" });
    } catch (error) {
      console.error("Error deleting album:", error);
      res.status(500).json({ error: "Failed to delete album" });
    }
  });

  // GET /api/playlists - Get all playlists
  app.get("/api/playlists", async (req, res) => {
    try {
      const playlists = await Playlist.find().select('-__v').lean();
      
      const transformedPlaylists = playlists.map(playlist => ({
        ...playlist,
        _id: playlist._id.toString(),
      }));
      
      res.json(transformedPlaylists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ error: "Failed to fetch playlists" });
    }
  });

  // GET /api/playlists/:id - Get single playlist
  app.get("/api/playlists/:id", async (req, res) => {
    try {
      const playlist = await Playlist.findById(req.params.id).select('-__v').lean();
      
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }
      
      const transformedPlaylist = {
        ...playlist,
        _id: playlist._id.toString(),
      };
      
      res.json(transformedPlaylist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      res.status(500).json({ error: "Failed to fetch playlist" });
    }
  });

  // POST /api/playlists - Create new playlist
  app.post("/api/playlists", async (req, res) => {
    try {
      const validatedData = insertPlaylistSchema.parse(req.body);
      const newPlaylist = new Playlist(validatedData);
      await newPlaylist.save();
      
      const playlistObj = newPlaylist.toObject();
      const transformedPlaylist = {
        ...playlistObj,
        _id: playlistObj._id.toString(),
      };
      
      res.status(201).json(transformedPlaylist);
    } catch (error: any) {
      console.error("Error creating playlist:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid playlist data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create playlist" });
    }
  });

  // PUT /api/playlists/:id - Update playlist
  app.put("/api/playlists/:id", async (req, res) => {
    try {
      const validatedData = insertPlaylistSchema.parse(req.body);
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true, runValidators: true }
      );
      
      if (!updatedPlaylist) {
        return res.status(404).json({ error: "Playlist not found" });
      }
      
      const playlistObj = updatedPlaylist.toObject();
      const transformedPlaylist = {
        ...playlistObj,
        _id: playlistObj._id.toString(),
      };
      
      res.json(transformedPlaylist);
    } catch (error: any) {
      console.error("Error updating playlist:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid playlist data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update playlist" });
    }
  });

  // DELETE /api/playlists/:id - Delete playlist
  app.delete("/api/playlists/:id", async (req, res) => {
    try {
      const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);
      
      if (!deletedPlaylist) {
        return res.status(404).json({ error: "Playlist not found" });
      }
      
      res.json({ message: "Playlist deleted successfully" });
    } catch (error) {
      console.error("Error deleting playlist:", error);
      res.status(500).json({ error: "Failed to delete playlist" });
    }
  });

  // POST /api/playlists/:id/tracks - Add track to playlist
  app.post("/api/playlists/:id/tracks", async (req, res) => {
    try {
      const { albumId, trackIndex } = req.body;
      
      if (!albumId || trackIndex === undefined) {
        return res.status(400).json({ error: "albumId and trackIndex are required" });
      }
      
      const playlist = await Playlist.findById(req.params.id);
      
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }
      
      playlist.tracks.push({ albumId, trackIndex });
      await playlist.save();
      
      const playlistObj = playlist.toObject();
      const transformedPlaylist = {
        ...playlistObj,
        _id: playlistObj._id.toString(),
      };
      
      res.json(transformedPlaylist);
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      res.status(500).json({ error: "Failed to add track to playlist" });
    }
  });

  // DELETE /api/playlists/:id/tracks/:trackIndex - Remove track from playlist
  app.delete("/api/playlists/:id/tracks/:trackIndex", async (req, res) => {
    try {
      const playlist = await Playlist.findById(req.params.id);
      
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }
      
      const trackIndex = parseInt(req.params.trackIndex);
      
      if (trackIndex < 0 || trackIndex >= playlist.tracks.length) {
        return res.status(400).json({ error: "Invalid track index" });
      }
      
      playlist.tracks.splice(trackIndex, 1);
      await playlist.save();
      
      const playlistObj = playlist.toObject();
      const transformedPlaylist = {
        ...playlistObj,
        _id: playlistObj._id.toString(),
      };
      
      res.json(transformedPlaylist);
    } catch (error) {
      console.error("Error removing track from playlist:", error);
      res.status(500).json({ error: "Failed to remove track from playlist" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
