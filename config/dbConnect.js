const mongoose = require("mongoose");

const dbConnect = () => {

try{
    const conn = mongoose.connect(process.env.MONGOURL);
    console.log('Database connected successfullt :)');
}catch(err){
  console.log(`Error Conneting to the database ${err}`);
}
};

module.exports = dbConnect;
