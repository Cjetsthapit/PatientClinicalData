const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  email:{type:String,requierd:true},
  gender: { type: String, required: true },
});

module.exports = mongoose.model('Patient', patientSchema);