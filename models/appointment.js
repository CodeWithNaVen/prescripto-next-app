import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    // patient and doctor details
    userId:{type:String, required:true}, 
    docId:{type:String, required:true},
    userData:{type:Object, required:true}, 
    docData:{type:Object, required:true},

    // slot details
    slotDate:{type:String, required:true},
    slotTime:{type:String, required:true},

    // payment details
    amount:{type:Number, required:true},
    date:{type:Number, required:true},

    // appointment status
    cancel:{type:Boolean, default:false},
    isCompleted:{type:Boolean, default:false},

    //paid or not
    paymentType:{type:String, default:"cash", enum:["cash", "online"]},
    payment:{type:Boolean, default:false}
},{timestamps:true});

const appointmentModel = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;