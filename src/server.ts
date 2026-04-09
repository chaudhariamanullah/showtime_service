import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = 3004;

app.listen(PORT, ()=>{
    console.log("Port 3004 Is Running")
})