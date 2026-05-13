import Track from "../models/Track";
import { connectDB } from "../db";
import { taylorSwiftalbums } from "./data/taylor-swift";

async function seedTaylorSwift() {
  await connectDB();

  for (const album of taylorSwiftalbums) {
    const albumId = album.albumId;

    await Track.deleteMany({ album_id: albumId });

    await Track.insertMany(
      album.tracks.map((track) => ({
        album_id: albumId,
        track_no: track.track_no,
        title: track.title,
        duration: "duration" in track ? track.duration : null,
        disc_no: "disc_no" in track ? track.disc_no : 1,
        artists: [],
        audio_url: null,
      }))
    );

    console.log(`✅ Seeded ${album.tracks.length} tracks for album ${albumId}`);
  }

  console.log("🎉 Taylor Swift seeding complete");
  process.exit(0);
}

seedTaylorSwift().catch((err) => {
  console.error("❌ Seeding failed", err);
  process.exit(1);
});