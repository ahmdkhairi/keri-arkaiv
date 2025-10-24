import type { Express } from "express";
import { createServer, type Server } from "http";
import { Album } from "./models/Album";
import { insertAlbumSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
