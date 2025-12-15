import { Router } from "express";
import Track from "../models/Track";

const router = Router();

router.get("/albums/:id/tracks", async (req, res) => {
    try {
        const tracks = await Track.find({
            album_id: req.params.id,
        }).sort({disc_no: 1, track_no:1});
        res.status(200).json(tracks);
    } catch {
        res.status(500).json({message: "Failed to fetch tracks"});
    }
});

router.get("/tracks/:trackId", async (req, res) => {
    try {
        const track = await Track.findById(req.params.trackId)
        if(!track) {
            return res.status(404).json({ message: "Track not found" });
        }
        res.status(200).json(track);
    } catch {
        res.status(500).json({message: "Failed to fetch tracks"});
    }
});

export default router;