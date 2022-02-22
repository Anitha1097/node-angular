const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const app = express();
mongoose.connect("mongodb+srv://mongo_user_1:" + process.env.MONGO_ATLAS_PW + "@cluster0.dr96v.mongodb.net/node-angular")
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT ,PATCH, DELETE, OPTIONS"
    );
    next();
});
// SuN3gQPeS5yjYeDY


// app.use((req, res, next) => {
//     console.log('First response');
//     next();
// });

// app.use((req, res, next) => {
//     res.send('Hello! response from express');
// });

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
module.exports = app;