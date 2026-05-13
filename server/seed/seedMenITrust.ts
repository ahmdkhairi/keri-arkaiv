import Track from "../models/Track";
import { connectDB } from "../db";
import { menITrustAlbums } from "./data/men-i-trust";

async function seedMenITrust() {
  await connectDB();

  for (const album of menITrustAlbums) {
    const albumId = album.albumId;

    // Always clean first (important with unique index)
    await Track.deleteMany({ album_id: albumId });

    await Track.insertMany(
      album.tracks.map((track) => ({
        album_id: albumId,
        track_no: track.track_no,
        title: track.title,

        // duration may not exist on all tracks
        duration: "duration" in track ? track.duration : null,

        // 👇 respect disc_no if provided, otherwise default to 1
        disc_no: "disc_no" in track ? track.disc_no : 1,

        artists: [],
        audio_url: null,
      }))
    );

    console.log(`✅ Seeded ${album.tracks.length} tracks for album ${albumId}`);
  }

  console.log("🎉 Men I Trust batch seeding complete");
  process.exit(0);
}

seedMenITrust().catch((err) => {
  console.error("❌ Seeding failed", err);
  process.exit(1);
});