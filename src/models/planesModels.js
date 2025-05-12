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
    },
    dias: { 
        type: Number,
        required: true,
        min: 1
    }
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;