const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Clothes",
      "Accessories",
      "Footwear",
      "Tech",
      "Books",
      "Sports",
      "Musical Instruments",
      "Furniture",
      "Other",
    ],
  },
  description: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
    enum: [
      "New with tags ",
      "Excellent used condition",
      "Gently used and well mantained",
      "Very used",
    ],
  },
  imageURL: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_SupCOWrF6_lcK9A_92Fx0OOU5FD4ucdwg&usqp=CAU",
  },
});

const Post = model("Post", postSchema);

module.exports = Post;
