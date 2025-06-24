import mongoose from "mongoose";

const userregister = new mongoose.Schema({
    photo:{
        name:String,
        data:Buffer,
        contentType: String,
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
  

})

export default mongoose.model('userlogindata',userregister)
