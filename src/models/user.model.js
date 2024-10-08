import mongoose , {Schema} from "mongoose";

const userSchema = new Schema({
    username :{
        type :  String ,
        required : true,
        unique : true,
        lowercase : true,
        trim  : true,
        index  : true
    } ,

    email :{
        type :  String ,
        required : true,
        unique : true,
        lowercase : true,
        trim  : true,
    } ,
    fullname :{
        type :  String ,
        required : true,
        trim  : true,
        index : true
    } ,

    avtar : {
        type : String ,
        required : true 
    } ,
    coverImage :{
        type : String ,
        required : true 
    } ,

    watchHistory : {
        type : Schema.Types.ObjectId ,
        ref : 'Video' ,
    } ,

    password :{
        type : String,
        required : [true , 'Password is required']
    } ,

    refreshToken : {
        type : String 
    }

    
},{
    timestamps : true 
})

userSchema.pre("save" , async function (next) {
    // this line runs only when we  updates the password
    if(this.isModified("password")){
    this.password = bcrypt.hash(this.password , 10)
    next()
    }
})

// this function is used to inject method to userSchema
userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email ,
        username :  this.username ,
        fullname  : this.fullname 
    },
    process.env.ACCESS_TOKEN_SECRET ,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
       
    },
    process.env.REFRESH_TOKEN_SECRET ,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
export const User = mongoose.model("User" , userSchema)