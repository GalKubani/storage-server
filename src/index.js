const express= require('express')
const cors= require('cors')

require('./db/mongoose')
const port= process.env.PORT;
const fileRouter= require('./routers/fileRouter')

const app= express();
app.use(express.json());
app.use(cors());
app.use(fileRouter);

app.use("/",(req,res)=>{
    res.send("ok")
})
app.listen(port,()=>console.log("Server connected, port:",port))