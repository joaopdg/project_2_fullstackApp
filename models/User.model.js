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

    password: {
      type: String,
      required: [true, "Please input a password"],
    },
    
    aboutMe:{
      type:String,
      required:true
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

    imageURL: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG3eLpTAMWO-mtILepXLwg68-IChyGcXJgog&usqp=CAU",
    },

    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],

    sentReq: [{ type: Schema.Types.ObjectId, ref: "Request" }],
    receivedReq: [{ type: Schema.Types.ObjectId, ref: "Request" }],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
