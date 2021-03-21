const mongoose= require('mongoose')

const fileSchema= new mongoose.Schema({
    originalName:{
        type: String
    },
    storageName:{
        type:String
    },
    bucket:{
        type:String
    },
    region:{
        type:String
    },
    key:{
        type:String
    },
})

const File= mongoose.model("File",fileSchema)

module.exports=File;