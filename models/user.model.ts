import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scan",
      },
    ],
  },
  {
    timestamps: true,
    methods: {
      encryptPassword: function (password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      },
      comparePassword: function (password: string) {
        return bcrypt.compareSync(password, this.password);
      },
    },
  }
);

export default mongoose.model("User", userSchema);
