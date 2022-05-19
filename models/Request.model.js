const { Schema, model } = require("mongoose");

const requestSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    senderItem: { type: Schema.Types.ObjectId, ref: "Post" },

    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    receiverItem: { type: Schema.Types.ObjectId, ref: "Post" },

    message: {
        type: String,
      },

    status: {
        type: Boolean,
      },

  },
  {
    timestamps: true,
  }
);

const Request = model("Request", requestSchema);

module.exports = Request;
