const express=require('express');

const app=express();

const port = process.env.PORT || 3000;

app.use(express.json());


const connectDB=require('./config/db');

connectDB();

const router=require('./routes/authRoutes');

app.use("/user",router);

const applicationRoutes = require("./routes/applicationRoutes");

app.use("/applications", applicationRoutes);

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);

})