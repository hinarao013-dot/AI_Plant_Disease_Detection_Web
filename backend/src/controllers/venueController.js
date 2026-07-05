const prisma = require('../config/prisma');

const getAllVenues = async (req, res, next) => {
  try {
    const venues = await prisma.venue.findMany({
      include: {
        events: true
      }
    });
    res.json(venues);
  } catch (error) {
    next(error);
  }
};

const getVenueById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const venue = await prisma.venue.findUnique({
      where: { id: parseInt(id) },
      include: {
        events: true
      }
    });
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.json(venue);
  } catch (error) {
    next(error);
  }
};

const createVenue = async (req, res, next) => {
  try {
    const { name, address, guests } = req.body;
    const venue = await prisma.venue.create({
      data: {
        name,
        address,
        guests: parseInt(guests)
      }
    });
    res.status(201).json(venue);
  } catch (error) {
    next(error);
  }
};

const updateVenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, guests } = req.body;
    const venue = await prisma.venue.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address,
        guests: guests !== undefined ? parseInt(guests) : undefined
      }
    });
    res.json(venue);
  } catch (error) {
    next(error);
  }
};

const deleteVenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.venue.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue
};
