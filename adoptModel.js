const mongoose = require('mongoose');

const adoptSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel', // Reference to the UserModel
        required: true
    },
    petId: {
        type: Number,
        ref: 'PetModel', // Reference to the PetModel
        required: true
    },
    adoptionDate: {
        type: Date,
        default: Date.now
    }
});

const AdoptModel = mongoose.model('AdoptModel', adoptSchema);

module.exports = AdoptModel;
