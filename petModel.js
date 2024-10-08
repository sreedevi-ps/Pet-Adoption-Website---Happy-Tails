// petModel.js
const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    name: String,
    petId:{type:Number},
    image: {
        data: Buffer,
        contentType: String
    },
    age: Number,
    breed: String,
    gender: String,
    status: {
        type: String,
        default: "Available"
    },
    category: {
        type:String,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, 
               ref: 'UserModel' } // Reference to UserModel
},{
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date' }
});

const PetModel = mongoose.model('PetModel', petSchema);

module.exports = PetModel;
