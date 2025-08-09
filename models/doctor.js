import mongoose from "mongoose";

//admin will create regstration for doctors, doctor only can login
const doctorSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},

    doctorPic:{type:String, required:true},
    speciality:{type:String, required:true},
    degree:{type:String, required:true},

    experience:[
        {
            hospital:{type: String, required:true},
            duration:{type: String, required:true},
            position:{type: String},
        }
    ],
    about:{type:String, required:true},
    available:{type:Boolean, default:true},
    fees:{type:Number, required:true},
    address:{type:Object, required:true},
    date:{type:Number, required:true},
    slots_booked:{type:Object, default:{}},
    role:{type:String, default:"doctor"},
},{timestamps:true, minimize:false});// minimize false also allows to empty object

const doctorModel = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default doctorModel;