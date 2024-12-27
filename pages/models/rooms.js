const mongoose = require("mongoose")
const roomsSchema = new mongoose.Schema({

    // _id: {
    //     type: Object,
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    bed: {
        type: String,
        required: true 
    },
    bath: {
         type: String, 
         required: true
        },
    price: {
        type: Number, 
        required: true 
    },
    // wifi: { 
    //     type: String,
    //     enum: ['Avaliable', 'Not Avaliable'], 
    //     required: true 
    // },
    description: { 
        type: String, 
        required: true 
    },
    roompic: { 
        type: String 
    } 
});

const roomsModel = mongoose.model("rooms", roomsSchema)
module.exports = roomsModel