const prisma = require('../config/prisma');

const getAllPlants = async (req, res, next) => {
  try {
    const plants = await prisma.plantCatalog.findMany();
    res.json(plants);
  } catch (error) {
    next(error);
  }
};

const getPlantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plant = await prisma.plantCatalog.findUnique({
      where: { id: parseInt(id) }
    });
    if (!plant) return res.status(404).json({ error: 'PlantCatalog entry not found' });
    res.json(plant);
  } catch (error) {
    next(error);
  }
};

const createPlant = async (req, res, next) => {
  try {
    const { commonName, scientificName, oxygenSupport, advantages, disadvantages, humanBenefits } = req.body;
    const plant = await prisma.plantCatalog.create({
      data: { commonName, scientificName, oxygenSupport, advantages, disadvantages, humanBenefits }
    });
    res.status(201).json(plant);
  } catch (error) {
    next(error);
  }
};

const updatePlant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { commonName, scientificName, oxygenSupport, advantages, disadvantages, humanBenefits } = req.body;
    const plant = await prisma.plantCatalog.update({
      where: { id: parseInt(id) },
      data: { commonName, scientificName, oxygenSupport, advantages, disadvantages, humanBenefits }
    });
    res.json(plant);
  } catch (error) {
    next(error);
  }
};

const deletePlant = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.plantCatalog.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'PlantCatalog entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant
};
