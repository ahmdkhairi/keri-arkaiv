import mongoose from "mongoose";
import dotenv from "dotenv";
import Track from "../models/Track.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

async function seedTracks() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");

    const albumId = new mongoose.Types.ObjectId("693d7954612c355c36197f39");

    await Track.deleteMany({ album_id: albumId });

    const tracks = [
      { track_no: 1, title: "Love Is Over", duration: "3:43" },
      { track_no: 2, title: "Bye", duration: "3:27" },
      { track_no: 3, title: "Savior", duration: "3:31" },
      { track_no: 4, title: "Intentions", duration: "3:20" },
      { track_no: 5, title: "Waterride", duration: "2:44" },
      { track_no: 6, title: "Safety Zone", duration: "3:11" },
      { track_no: 7, title: "돌아오지마 (Feat. GRAY)", duration: "3:37" },
      { track_no: 8, title: "H.S.K.T. (Feat. Wonstein)", duration: "3:38" },
      {
        track_no: 9,
        title: "Red Lipstick (Feat. Yoon Mirae)",
        duration: "3:31",
      },
      { track_no: 10, title: "Only", duration: "4:00" },
    ].map((t) => ({
      album_id: albumId,
      disc_no: 1,
      ...t,
    }));

    await Track.insertMany(tracks);

    console.log(`🎵 Seeded ${tracks.length} tracks for album 4Only`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedTracks();
