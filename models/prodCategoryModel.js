const mongoose = require('mongoose')
const prodCategorySchema = mongoose.Schema({
 title:{
    type:String,
    required:true,
    unique:true,
    index:true, 
},

} ,{
    timestamps:true
});

module.exports = mongoose.model('PCategory',prodCategorySchema);