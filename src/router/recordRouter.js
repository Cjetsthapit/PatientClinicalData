// const express = require('express');
// const router = express.Router();
// const Patient = require('../models/patientModel');

// // create a new record for patient
// router.post('/:patientId/records', async (req, res) => {
//     try {
//         const patient = await Patient.findById(req.params.patientId);
//         if (!patient) return res.status(404).send({ message: 'Patient not found' });

//         patient.records.push(req.body);  // Add new record
//         await patient.save();
//         res.status(201).send(patient.records[patient.records.length - 1]);  // Send the latest record
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

// //update a record for a patient
// router.put('/:patientId/records/:recordId', async (req, res) => {
//     try {
//         const patient = await Patient.findById(req.params.patientId);
//         if (!patient) return res.status(404).send({ message: 'Patient not found' });

//         const record = patient.records.id(req.params.recordId);
//         if (!record) return res.status(404).send({ message: 'Record not found' });

//         Object.assign(record, req.body);  // Update record fields
//         await patient.save();
//         res.status(200).send(record);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

// //delete a specific record of a patient:
// router.delete('/:patientId/records/:recordId', async (req, res) => {
//     try {
//         const patient = await Patient.findById(req.params.patientId);
//         if (!patient) return res.status(404).send({ message: 'Patient not found' });

//         const record = patient.records.id(req.params.recordId);
//         if (!record) return res.status(404).send({ message: 'Record not found' });

//         record.remove();  // Remove the record
//         await patient.save();
//         res.status(200).send({ message: 'Record deleted', record });
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// // Get a specific record for a patient
// router.get('/:patientId/records/:recordId', async (req, res) => {
//     try {
//         const patient = await Patient.findById(req.params.patientId);
//         if (!patient) {
//             return res.status(404).send({ message: 'Patient not found' });
//         }

//         const record = patient.records.id(req.params.recordId);
//         if (!record) {
//             return res.status(404).send({ message: 'Record not found' });
//         }

//         res.status(200).send(record);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });