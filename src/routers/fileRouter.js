const express= require('express')
const {uploadFileToS3, deleteFileFromS3, getFileFromS3}=require('../middleware/s3-handles')
const router= new express.Router();
const {Readable}=require('stream')
const File= require('../models/fileModel');
const auth= require('../middleware/auth')

router.post('/upload-file',auth,uploadFileToS3,async(req,res)=>{
    if(!req.file){
        res.status(422).send({
            code:422,
            message:"File not uploaded"
        })
    }

    const file = new File({
        originalName: req.file.originalname,
        storageName:req.file.key.split("/")[1],
        bucket:process.env.S3_BUCKET,
        region:process.env.AWS_REGION,
        key:req.file.key,
        user:req.user
    })
    try{
        await file.save()
        res.send(file)
    }catch(err){
        console.log(err)
    }
    res.send()
})

router.get('/get-files',auth,async(req,res)=>{
    try{
        const files= await File.find({user:req.user})
        res.send(files)
    }catch(err){
        console.log(err)
    }
})

router.get('/get-file',getFileFromS3,async(req,res)=>{
    const fileName= req.query.name
    const stream=Readable.from(req.fileBuffer)
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + fileName
    );
    stream.pipe(res)
})

router.delete('/delete-file',auth,deleteFileFromS3,async(req,res)=>{
    try{

        await File.findByIdAndDelete(req.query.id)
        res.send()
    }catch(err){
        console.log(err)
    }
})


module.exports=router