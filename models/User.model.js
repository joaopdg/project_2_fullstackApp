const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    passwordHash: {
      type: String,
      required: [true, "Please input a password"],
    },

    location: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    contact: {
      type: Number,
      required: true,
    },

    imageUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG3eLpTAMWO-mtILepXLwg68-IChyGcXJgog&usqp=CAU",
    },

    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],

    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
