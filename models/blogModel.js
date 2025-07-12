const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  numViews: {
    type: Number,
    default: 0,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  isDisliked: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D",
  },
  author:{
    type:String,
    default:"Admin"
  },
  images: [],
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    },
    timeStamps: true,
});

module.exports = mongoose.model("Blog", blogSchema);
