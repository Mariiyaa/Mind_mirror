import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: Date,
  wentWell: String,
  couldBeBetter: String,
  feeling: String,
  mood: String, // e.g. happy, sad, neutral
});

export default mongoose.models.Entry || mongoose.model("Entry", entrySchema);
