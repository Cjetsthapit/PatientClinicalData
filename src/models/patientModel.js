const mongoose = require("mongoose");

const patientRecordSchema = new mongoose.Schema({
  recordDate: {
    type: Date,
    required: true,
  },
  doctorNote: {
    type: String,
    required: true,
  },
  bloodOxygenLevel: {
    type: Number,
    required: true,
  },
  bloodPressure: {
    type: Number,
    required: true,
  },
  heartbeatRate: {
    type: Number,
    required: true,
  },
  respiratoryRate: {
    type: Number,
    required: true,
  },
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  isCritical: {
    type: Boolean,
    required: false,
    default: false,
  },
  patientRecords: [patientRecordSchema],
});

module.exports = mongoose.model("Patient", patientSchema);
