const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken')

const userSchema= new mongoose.Schema({
    name:{type: String,required:true,trim:true},
    email:{type: String,required:true,trim:true,lowercase:true, unique:true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid email")
        }
    }},
    password:{type: String,required:true,trim:true,
    validate(value){
        if(value.length<7){
            throw new Error("password too short")
        }
    }},
    tokens:[{
        token:{type: String,
              required:true
        }
    }],
}, {timestamps:true}
);
userSchema.virtual('files',{
    ref: 'File',
    localField: '_id',// relates the ref to the foreign field
    foreignField: 'user'
})
userSchema.methods.generateAuthToken= async function(){
    const token= jwt.sign({_id:this._id.toString()},process.env.JWT_SECRET,{expiresIn:'6 hours'})
    this.tokens= this.tokens.concat({token});
    await this.save();
    return token;
}
userSchema.methods.toJSON= function(){
    const userObj= this.toObject();
    delete userObj.password;
    delete userObj.tokens;
    return userObj
}
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,8)
    }
    next()
})
const User= mongoose.model('User',userSchema);
module.exports=User