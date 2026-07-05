const prisma = require('../config/prisma');

const getAllParticipants = async (req, res, next) => {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        bookings: {
          include: {
            event: true
          }
        }
      }
    });
    res.json(participants);
  } catch (error) {
    next(error);
  }
};

const getParticipantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const participant = await prisma.participant.findUnique({
      where: { id: parseInt(id) },
      include: {
        bookings: {
          include: {
            event: true
          }
        }
      }
    });
    if (!participant) return res.status(404).json({ error: 'Participant not found' });
    res.json(participant);
  } catch (error) {
    next(error);
  }
};

const createParticipant = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const participant = await prisma.participant.create({
      data: { name, email, phone }
    });
    res.status(201).json(participant);
  } catch (error) {
    next(error);
  }
};

const updateParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const participant = await prisma.participant.update({
      where: { id: parseInt(id) },
      data: { name, email, phone }
    });
    res.json(participant);
  } catch (error) {
    next(error);
  }
};

const deleteParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.participant.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Participant deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllParticipants,
  getParticipantById,
  createParticipant,
  updateParticipant,
  deleteParticipant
};
