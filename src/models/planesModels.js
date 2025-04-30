const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    nombrePlan: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    }
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;