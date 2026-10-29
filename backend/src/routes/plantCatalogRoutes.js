const express = require('express');
const router = express.Router();
const plantCatalogController = require('../controllers/plantCatalogController');

router.get('/', plantCatalogController.getAllPlants);
router.get('/:id', plantCatalogController.getPlantById);
router.post('/', plantCatalogController.createPlant);
router.put('/:id', plantCatalogController.updatePlant);
router.delete('/:id', plantCatalogController.deletePlant);

module.exports = router;
