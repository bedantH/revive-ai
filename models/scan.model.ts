import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    object: {
      type: String,
      required: true,
    },
    result: {
      type: Object,
      required: true,
    },
    is_completed: {
      type: Boolean,
      default: false,
    },
    how_desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Scan", scanSchema);
