import mongoose from "mongoose";

const TrackSchema = new mongoose.Schema(
    {
    album_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Album",
        required:true,
        index:true,
    },

    track_no:{
        type: Number,
        required: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    duration: {
        type: String,
        required: true,
    },

    artists: {
        type: [String],
        default:[],
    },

    disc_no: {
        type: Number,
        default: 1,
    },

    audio_url: {
        type: String,
        default: null,
    }
},
{timestamps:true}
);

TrackSchema.index({album_id:1,disc_no:1, track_no:1}, {unique: true})

export default mongoose.model("Track", TrackSchema)