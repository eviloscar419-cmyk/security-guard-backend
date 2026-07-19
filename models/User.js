const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
{

    name:
    {
        type:String,
        required:true,
        trim:true
    },


    email:
    {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },


    password:
    {
        type:String,
        required:true,
        minlength:4
    },


    role:
    {
        type:String,
        enum:[
            "Admin",
            "User"
        ],
        default:"User"
    },


    profilePicture:
    {
        type:String,
        default:""
    }


},
{
    timestamps:true,

    toJSON:
    {
        virtuals:true
    },

    toObject:
    {
        virtuals:true
    }

});



// Fix MongoDB id problem
userSchema.virtual("id")
.get(function(){

    return this._id.toString();

});



// Hide password automatically
userSchema.methods.toSafeObject=function(){

    const user=this.toObject();

    delete user.password;

    return user;

};



module.exports =
mongoose.model(
    "User",
    userSchema
);
