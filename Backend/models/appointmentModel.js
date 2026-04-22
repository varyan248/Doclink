import mongoose, { mongo } from "mongoose"

const appointmentScehma = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    
    docId : {
        type : String,
        required : true
    },
    slotDate : {
        type : String,
        reuired : true
    },
    slotTime : {
        type : String,
        required : true
    },
    userData : {
        type : Object,
        required : true
    },
    docData : {
        type : Object,
        required : true
    },
    amount : {
        type : String,
        required : true
    },
    date : {
        type : Number,
        required : true
    },
    cancelled : {
        type : Boolean,
        default : false
    },
    payment : {
        type : Boolean,
        default : false
    },
    paymentMethod : {
        type : String,
        default : ''
    },
     isCompleted : {
        type : Boolean,
        default : false
     }
})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointmentModel',  appointmentScehma)
export default appointmentModel