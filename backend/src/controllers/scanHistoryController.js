const prisma = require('../config/prisma');

const getAllScans = async (req, res, next) => {
  try {
    const scans = await prisma.scanHistory.findMany({
      orderBy: {
        date: 'desc'
      }
    });
    res.json(scans);
  } catch (error) {
    next(error);
  }
};

const getScanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scan = await prisma.scanHistory.findUnique({
      where: { id: parseInt(id) }
    });
    if (!scan) return res.status(404).json({ error: 'ScanHistory not found' });
    res.json(scan);
  } catch (error) {
    next(error);
  }
};

const createScan = async (req, res, next) => {
  try {
    const { plantName, sciName, disease, solution, imageUrl } = req.body;
    
    // Create the scan entry
    const scan = await prisma.scanHistory.create({
      data: {
        plantName,
        sciName,
        disease,
        solution,
        imageUrl
      }
    });
    
    res.status(201).json(scan);
  } catch (error) {
    next(error);
  }
};

const deleteScan = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.scanHistory.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'ScanHistory deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllScans,
  getScanById,
  createScan,
  deleteScan
};
