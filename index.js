const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dbConnect = require("./config/dbConnect");
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const prodCategoryRouter = require("./routes/prodCategoryRoute");
const blogCategoryRouter = require("./routes/blogCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const PORT = process.env.PORT || 3000;

dbConnect();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", prodCategoryRouter);
app.use("/api/blogcategory", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
});
