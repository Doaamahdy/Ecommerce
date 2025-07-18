const mongoose = require('mongoose');

const blogcategorySchema = mongoose.Schema({
    title:{
      type:String,
      required:true,
      unique:true,
      index:true
    }
},{
    timestamps:true
})

module.exports = mongoose.model('BCategory',blogcategorySchema);