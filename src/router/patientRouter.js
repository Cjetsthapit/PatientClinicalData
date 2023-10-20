const express = require('express');
const router = express.Router();
const Patient = require('../models/patientModel');

// Create a new patient
router.post('/', async (req, res) => {
    const patient = new Patient(req.body);
    console.log(req.body);
    try {
      await patient.save();
      res.status(201).send(patient);
    } catch (error) {
      res.status(400).send(error);
    }
  });

// Get all patients or filter by name
router.get('/', async (req, res) => {
    try {
      let query = {};
      if (req.query.name) {
        query.name = query.name = new RegExp('^' + req.query.name, 'i');;
      }
      const patients = await Patient.find(query);
      res.status(200).send(patients);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // Get a specific patient by ID
router.get('/:id', async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).send({ message: 'Patient not found' });
      }
      res.status(200).send(patient);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // Update a specific patient by ID
router.put('/:id', async (req, res) => {
    try {
      const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!patient) {
        return res.status(404).send({ message: 'Patient not found' });
      }
      res.status(200).send(patient);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  // Delete a specific patient by ID
router.delete('/:id', async (req, res) => {
    try {
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) {
        return res.status(404).send({ message: 'Patient not found' });
      }
      res.status(200).send({ message: 'Patient deleted', patient });
    } catch (error) {
      res.status(500).send(error);
    }
  });



module.exports = router;