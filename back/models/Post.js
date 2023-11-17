const mongoose = require(`mongoose`)

const { Schema, model } = mongoose

const PostSchema = new Schema(
  {
    name: String,
    price: Number,
    content: String,
    image: String,
    added: Boolean,
    count: Number,
    author: { type: Schema.Types.ObjectId, ref: `User` },
  },
  {
    timestamps: true,
  }
)

const PostModel = model(`Post`, PostSchema)

module.exports = PostModel
