import mongoose from "mongoose";

const postschema = new mongoose.Schema({
  photo: {
    name: String,
    data: Buffer,
    contentType: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  comments: [
    {
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  followers: {
       type: Number,
       default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
});

export default mongoose.model('postdata', postschema);
