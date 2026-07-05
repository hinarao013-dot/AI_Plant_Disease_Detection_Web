const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');

router.get('/', participantController.getAllParticipants);
router.get('/:id', participantController.getParticipantById);
router.post('/', participantController.createParticipant);
router.put('/:id', participantController.updateParticipant);
router.delete('/:id', participantController.deleteParticipant);

module.exports = router;
