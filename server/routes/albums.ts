import {Router} from "express"
import {Album} from "../models/Album"
import { requireAdmin } from "../middleware/adminAuth";

const router = Router()


router.get("/albums/:id", async (req, res)=>{
    try {
        const album = await Album.findById(req.params.id);
        if(!album) {
            return res.status(404).json({ message: "Album not found" });
        }
        res.json(album);
    } catch (err) {
    res.status(500).json({ message: "Failed to fetch album" });
  }
})

router.get("/albums", async(_req,res)=>{
    try{
        const albums = await Album.find().sort({ year: -1});
        res.status(200).json(albums);
    } catch (err) {
        res.status(500).json({message: "Failed to fetch albums"})
    }
})

router.get("/", async (_req, res) => {
  const albums = await Album.find().sort({ year: -1 });
  res.json(albums);
});

// ADMIN ONLY
router.post("/", requireAdmin, async (req, res) => {
  const album = await Album.create(req.body);
  res.status(201).json(album);
});



export default router;