const express = require('express');
const router = express.Router();
const scanHistoryController = require('../controllers/scanHistoryController');

router.get('/', scanHistoryController.getAllScans);
router.get('/:id', scanHistoryController.getScanById);
router.post('/', scanHistoryController.createScan);
router.delete('/:id', scanHistoryController.deleteScan);

module.exports = router;
