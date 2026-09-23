const express = require("express");

const app = express();

app.use(express.json());

// routes/middleware here

module.exports = app;
app.listen(3000 , ()=>{
     console.log(" serer is rnning on the the window ");
})