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
        query.name = new RegExp( req.query.name, 'i');
      }
      const patients = await Patient.find(query);
      res.status(200).send(patients);
    } catch (error) {
      res.status(500).send(error);
    }
  });


  router.get('/critical', async (req, res) => {
    try {
      const name = req.query.name;
  
      let filter = { isCritical: true };
  
      if (name) {
        filter.name = new RegExp(name, 'i');
      }

  
      const criticalPatients = await Patient.find(filter);
  
      res.status(200).send(criticalPatients);
    } catch (error) {
      console.error("Error retrieving critical patients:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

  // Get a specific patient by ID
router.get('/:id', async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).send({ message: 'Patient not found' });
      }
      if (patient.patientRecords && Array.isArray(patient.patientRecords)) {
        // Sorting the records in descending order by recordedDate
        patient.patientRecords.sort((a, b) => new Date(b.recordDate) - new Date(a .recordDate));
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
      console.log(patient);
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

  function checkCriticalStatus(vitals) {
    const { bloodOxygenLevel, bloodPressure, heartbeatRate, respiratoryRate } = vitals;
  
    const isCritical = 
    bloodOxygenLevel < 95 || bloodOxygenLevel > 100 ||
    bloodPressure < 90 || bloodPressure > 120 ||
    heartbeatRate < 60 || heartbeatRate > 100 ||
    respiratoryRate < 12 || respiratoryRate > 20;
  
    return isCritical;
  }

  // create a new record for patient
router.post('/:id/records', async (req, res) => {
  console.log({id:req.params.id, body:req.body})
  try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) return res.status(404).send({ message: 'Patient not found' });

      const isCriticalStatus = checkCriticalStatus(req.body)
      patient.isCritical = isCriticalStatus
      const newRecord = { ...req.body};
      patient.patientRecords.push(newRecord);  // Add new record
      await patient.save();
      res.status(201).send(patient.patientRecords[patient.patientRecords.length - 1]);  // Send the latest record
  } catch (error) {
    console.log(error)
      res.status(400).send(error);
  }
});

//update a record for a patient
router.put('/:id/records/:recordId', async (req, res) => {
  try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) return res.status(404).send({ message: 'Patient not found' });

      const record = patient.patientRecords.id(req.params.recordId);
      if (!record) return res.status(404).send({ message: 'Record not found' });

      record.set(req.body);  // Update record fields
      await patient.save();
      res.status(200).send(record);
  } catch (error) {
      res.status(400).send(error);
  }
});

//delete a specific record of a patient:
router.delete('/:id/records/:recordId', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).send({ message: 'Patient not found' });

    const recordIndex = patient.patientRecords.findIndex(
      (record) => record._id.toString() === req.params.recordId
    );

    if (recordIndex === -1) {
      return res.status(404).send({ message: 'Record not found' });
    }

    patient.patientRecords.splice(recordIndex, 1); // Remove the record
    await patient.save();
    res.status(200).send({ message: 'Record deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});


// Get a specific record for a patient
router.get('/:id/records/:recordId', async (req, res) => {
  try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
          return res.status(404).send({ message: 'Patient not found' });
      }

      const record = patient.patientRecords.id(req.params.recordId);
      if (!record) {
          return res.status(404).send({ message: 'Record not found' });
      }

      res.status(200).send(record);
  } catch (error) {
      res.status(500).send(error);
  }
});





module.exports = router;