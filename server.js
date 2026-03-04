const express= require("express");
const cors = require("cors");
const mongoose=require("mongoose");
require("dotenv").config();

const searchRoutes=require("./routes/search");

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("mongoDB connected"))
.catch(err=>console.log(err))

app.use("/api/search",searchRoutes);
const historyRoutes = require("./routes/history");
app.use("/api/history", historyRoutes);
const PORT = process.env.PORT || 500;

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})